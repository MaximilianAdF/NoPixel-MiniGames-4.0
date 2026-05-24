// Auto-screenshot each puzzle page using Playwright; output to public/puzzles/<game>.png.
//
// Output is a uniform 1200×675 PNG for every game — each game's actual UI is
// tight-cropped and composited centered onto the site background colour, so
// all 8 thumbnails have identical dimensions and identical centering.
//
// Usage:
//   1. Start the app:  npm run dev   (or npm run build && npm start)
//   2. In another terminal:  npm run thumbnails
//
// Optional env vars:
//   THUMB_BASE_URL    — defaults to http://localhost:3000
//   THUMB_CANVAS_W    — output PNG width  (default 1200)
//   THUMB_CANVAS_H    — output PNG height (default 675)
//   THUMB_PADDING     — px of game-bg padding around the captured element (default 30)
//   THUMB_OUT_DIR     — output dir (default public/puzzles)
import { chromium } from 'playwright';
import sharp from 'sharp';
import { mkdirSync, existsSync } from 'fs';
import { join } from 'path';

const BASE_URL = process.env.THUMB_BASE_URL || 'http://localhost:3000';
const CANVAS_W = parseInt(process.env.THUMB_CANVAS_W || '1200', 10);
const CANVAS_H = parseInt(process.env.THUMB_CANVAS_H || '675', 10);
const PADDING = parseInt(process.env.THUMB_PADDING || '30', 10);
const OUT_DIR = process.env.THUMB_OUT_DIR || 'public/puzzles';

// Site bg colour (mirage-950: #0F1B21). Sharp wants RGB ints.
const BG = { r: 15, g: 27, b: 33 };

// Viewport — wide enough that the largest games (Thermite/Lockpick grid) fit
// without scrolling; tall enough that the puzzle layout's min-height kicks in.
const VIEWPORT_W = 1280;
const VIEWPORT_H = 800;

const PUZZLES = [
  'thermite',
  'lockpick',
  'roof-running',
  'chopping',
  'pincracker',
  'word-memory',
  'laundromat',
  'repair-kit',
];

// Time to let the game render an interesting first state before screenshotting.
const SETTLE_MS = 1500;

// CSS injected on every page to hide site chrome and dev overlays.
const HIDE_CHROME_CSS = `
  /* NavigationMenu — hamburger button (top-4 left-4), slim vertical tab
     (top-1/2 left-0), side panel (top-0 left-0 h-full), backdrop overlay
     when open (inset-0). */
  .fixed.top-4,
  .fixed.top-0,
  .fixed.top-1\\/2,
  .fixed.left-0,
  .fixed.right-0,
  .fixed.inset-0,
  /* LoginButton (top-4) and its dropdown class hook. */
  .user-menu,
  /* Contextual hints, global loading spinner, cookie banner. */
  [class*="ContextualHint"],
  [class*="GlobalLoading"],
  /* Next.js dev tooling overlays. */
  nextjs-portal,
  [data-nextjs-toast],
  [data-nextjs-dialog-overlay],
  #__next-build-watcher {
    display: none !important;
  }
`;

if (!existsSync(OUT_DIR)) {
  mkdirSync(OUT_DIR, { recursive: true });
}

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: VIEWPORT_W, height: VIEWPORT_H },
  // Pre-accept cookies so the consent banner never shows.
  storageState: {
    cookies: [],
    origins: [
      {
        origin: BASE_URL,
        localStorage: [
          { name: 'cookieConsent', value: 'accepted' },
          { name: 'cookieConsentDate', value: new Date().toISOString() },
        ],
      },
    ],
  },
});

console.log(`Capturing ${PUZZLES.length} thumbnails (${CANVAS_W}×${CANVAS_H}) from ${BASE_URL}...`);
const t0 = Date.now();

const results = await Promise.allSettled(
  PUZZLES.map(async (game) => {
    const page = await context.newPage();
    try {
      const url = `${BASE_URL}/puzzles/${game}`;
      await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
      await page.addStyleTag({ content: HIDE_CHROME_CSS });
      await page.waitForTimeout(SETTLE_MS);

      // Find the bounding box of the game's actual UI card. Heuristic:
      // largest visible non-fixed element inside <main> that isn't itself
      // viewport-sized (those are layout wrappers/backgrounds).
      const box = await page.evaluate(() => {
        const main = document.querySelector('main');
        if (!main) return null;
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        const viewportArea = vw * vh;

        let best = null;
        let bestArea = 0;
        const walk = (el) => {
          if (!(el instanceof Element)) return;
          const cs = getComputedStyle(el);
          if (cs.position === 'fixed') return;
          if (cs.display === 'none' || cs.visibility === 'hidden') return;
          const r = el.getBoundingClientRect();
          const area = r.width * r.height;
          // Skip tiny icons and the page-level wrappers (>80% of viewport).
          if (area > 5000 && area < viewportArea * 0.8) {
            // Prefer elements whose center is within the viewport — avoids
            // picking up the SEO section that scrolls off-screen below.
            const centerY = r.top + r.height / 2;
            if (centerY > 0 && centerY < vh) {
              if (area > bestArea) {
                bestArea = area;
                best = r;
              }
            }
          }
          for (const child of el.children) walk(child);
        };
        walk(main);

        return best
          ? { x: best.left, y: best.top, width: best.width, height: best.height }
          : null;
      });

      if (!box) throw new Error('Could not find game element in <main>');

      // Clip to game box + padding, staying inside the viewport.
      const clip = {
        x: Math.max(0, Math.floor(box.x - PADDING)),
        y: Math.max(0, Math.floor(box.y - PADDING)),
        width: Math.min(VIEWPORT_W, Math.ceil(box.width + PADDING * 2)),
        height: Math.min(VIEWPORT_H, Math.ceil(box.height + PADDING * 2)),
      };
      // Don't let clip extend past the viewport edges (Playwright errors).
      clip.width = Math.min(clip.width, VIEWPORT_W - clip.x);
      clip.height = Math.min(clip.height, VIEWPORT_H - clip.y);

      const tightBuffer = await page.screenshot({
        type: 'png',
        clip,
        animations: 'disabled',
      });

      // Scale the tight game capture to fill as much of the canvas as
      // possible while preserving aspect ratio. Small games (Word Memory,
      // PinCracker, Repair Kit) get enlarged so they don't sit as a tiny
      // island in a big background. Tall games (Thermite, Lockpick) get
      // letterboxed on the sides; wide games (Repair Kit) on top/bottom.
      const fitted = await sharp(tightBuffer)
        .resize({
          width: CANVAS_W,
          height: CANVAS_H,
          fit: 'inside',
        })
        .toBuffer();

      // Composite onto a uniform canvas, centered.
      const outPath = join(OUT_DIR, `${game}.png`);
      await sharp({
        create: {
          width: CANVAS_W,
          height: CANVAS_H,
          channels: 3,
          background: BG,
        },
      })
        .composite([{ input: fitted, gravity: 'center' }])
        .png({ compressionLevel: 9 })
        .toFile(outPath);

      return { game, outPath, ok: true, captured: clip };
    } finally {
      await page.close();
    }
  }),
);

await browser.close();

let ok = 0;
let fail = 0;
for (const r of results) {
  if (r.status === 'fulfilled') {
    ok++;
    const { game, outPath, captured } = r.value;
    console.log(`  ✓ ${game.padEnd(13)}→ ${outPath}  (${captured.width}×${captured.height} → ${CANVAS_W}×${CANVAS_H})`);
  } else {
    fail++;
    console.error(`  ✗ ${r.reason?.message || r.reason}`);
  }
}

console.log(`\nDone in ${Date.now() - t0}ms — ${ok} ok, ${fail} fail.`);
process.exit(fail > 0 ? 1 : 0);
