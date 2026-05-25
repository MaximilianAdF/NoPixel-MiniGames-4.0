// Auto-screenshot each puzzle page using Playwright; output to public/puzzles/<game>.png.
//
// Output is a uniform 1200×900 (4:3) PNG with a TRANSPARENT background — the
// game's own card sits on transparent padding so it composites cleanly into
// whatever colour the home-page card uses. Each game gets a brief per-game
// warmup so sparse idle states (PinCracker, Word Memory, Chopping) show a
// richer mid-play frame.
//
// Usage:
//   1. Start the app:  npm run dev   (or npm run build && npm start)
//   2. In another terminal:  npm run thumbnails
//
// Optional env vars: THUMB_BASE_URL, THUMB_CANVAS_W, THUMB_CANVAS_H,
// THUMB_PADDING, THUMB_OUT_DIR.
import { chromium } from 'playwright';
import sharp from 'sharp';
import { mkdirSync, existsSync } from 'fs';
import { join } from 'path';

const BASE_URL = process.env.THUMB_BASE_URL || 'http://localhost:3000';
const CANVAS_W = parseInt(process.env.THUMB_CANVAS_W || '1200', 10);
const CANVAS_H = parseInt(process.env.THUMB_CANVAS_H || '900', 10);
const PADDING = parseInt(process.env.THUMB_PADDING || '30', 10);
const OUT_DIR = process.env.THUMB_OUT_DIR || 'public/puzzles';

const VIEWPORT_W = 1280;
const VIEWPORT_H = 900;

// Per-game warmup steps. Each function gets the Playwright page after the
// initial settle delay and can interact with the game to produce a more
// interesting frame before screenshot.
const WARMUPS = {
  pincracker: async (page) => {
    // PinCracker shows empty pin slots at idle. Enter a few number keys
    // so the slots populate with digits before screenshot — more visual
    // interest than four empty dashes. Don't click "Crack" (that's the
    // submit; if it's wrong, the game switches to a "Failed" state).
    for (const k of ['1', '4', '7']) {
      await page.keyboard.press(k).catch(() => {});
      await page.waitForTimeout(80);
    }
    await page.waitForTimeout(400);
  },
  'word-memory': async (page) => {
    // The very first word is always "new" (never been shown). Click "New"
    // exactly once → score becomes 1/25 and the next random word renders.
    // More than once risks pressing "Seen" wrongly and triggering failure.
    await page
      .locator('button:has-text("New")')
      .first()
      .click()
      .catch(() => {});
    await page.waitForTimeout(400);
  },
  chopping: async (page) => {
    // Read the first highlighted letter from the DOM and press it, so we
    // get a "1 letter completed" frame without risking a failed state.
    const firstKey = await page
      .evaluate(() => {
        // Game tiles are buttons/divs with single-letter text. Find the
        // first one styled as "next-to-press" (highlighted ring/border).
        const tiles = Array.from(document.querySelectorAll('button, [class*="border"], [class*="ring"]'))
          .filter((el) => {
            const t = el.textContent?.trim() ?? '';
            return /^[QWERASD]$/i.test(t);
          });
        return tiles[0]?.textContent?.trim() ?? null;
      })
      .catch(() => null);
    if (firstKey) {
      await page.keyboard.press(firstKey.toUpperCase()).catch(() => {});
      await page.waitForTimeout(400);
    }
  },
  // Games that already render rich idle content (Thermite/Lockpick/Laundromat/
  // RoofRunning) or that auto-cycle (RepairKit) just need a settle delay.
};

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

const SETTLE_MS = 1500;

// Hide site chrome AND the puzzle layout's own background decorations so the
// area around the game card is transparent in the screenshot. The game's own
// card keeps its own dark background — that's what we want visible.
const HIDE_CHROME_CSS = `
  /* Site chrome (nav, login, dropdowns) */
  .fixed.top-4,
  .fixed.top-0,
  .fixed.top-1\\/2,
  .fixed.left-0,
  .fixed.right-0,
  .fixed.inset-0,
  .user-menu,
  [class*="ContextualHint"],
  [class*="GlobalLoading"],
  /* Next.js dev tooling overlays */
  nextjs-portal,
  [data-nextjs-toast],
  [data-nextjs-dialog-overlay],
  #__next-build-watcher {
    display: none !important;
  }
  /* Strip backgrounds from the page chrome so omitBackground:true produces
     real transparent pixels around the game card. */
  html, body, main, main > div, main > div > div, [class*="puzzle"] > div {
    background: transparent !important;
    background-image: none !important;
  }
`;

if (!existsSync(OUT_DIR)) {
  mkdirSync(OUT_DIR, { recursive: true });
}

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: VIEWPORT_W, height: VIEWPORT_H },
  storageState: {
    cookies: [],
    origins: [
      {
        origin: BASE_URL,
        localStorage: [
          { name: 'cookieConsent', value: 'accepted' },
          { name: 'cookieConsentDate', value: new Date().toISOString() },
          { name: 'hasSeenRevampNotice', value: '1' },
        ],
      },
    ],
  },
});

console.log(`Capturing ${PUZZLES.length} thumbnails (${CANVAS_W}×${CANVAS_H}, transparent bg) from ${BASE_URL}...`);
const t0 = Date.now();

const results = await Promise.allSettled(
  PUZZLES.map(async (game) => {
    const page = await context.newPage();
    try {
      const url = `${BASE_URL}/puzzles/${game}`;
      await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
      await page.addStyleTag({ content: HIDE_CHROME_CSS });
      await page.waitForTimeout(SETTLE_MS);

      // Per-game warmup (no-op if not defined).
      const warmup = WARMUPS[game];
      if (warmup) await warmup(page);

      // Find the game card's bounding box (largest visible non-fixed,
      // non-viewport-sized element inside <main>).
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
          if (area > 5000 && area < viewportArea * 0.8) {
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

      const clip = {
        x: Math.max(0, Math.floor(box.x - PADDING)),
        y: Math.max(0, Math.floor(box.y - PADDING)),
        width: Math.min(VIEWPORT_W, Math.ceil(box.width + PADDING * 2)),
        height: Math.min(VIEWPORT_H, Math.ceil(box.height + PADDING * 2)),
      };
      clip.width = Math.min(clip.width, VIEWPORT_W - clip.x);
      clip.height = Math.min(clip.height, VIEWPORT_H - clip.y);

      // omitBackground:true → transparent where the page has no painted bg.
      // Our CSS injection strips html/body/layout backgrounds so the padding
      // around the game card comes through as transparent pixels.
      const tightBuffer = await page.screenshot({
        type: 'png',
        clip,
        animations: 'disabled',
        omitBackground: true,
      });

      // Scale-to-fit, preserving aspect (and alpha channel).
      const fitted = await sharp(tightBuffer)
        .resize({
          width: CANVAS_W,
          height: CANVAS_H,
          fit: 'inside',
        })
        .toBuffer();

      // Composite onto a TRANSPARENT canvas — alpha:0 RGBA. The home card's
      // background colour shows through wherever the thumbnail is transparent.
      const outPath = join(OUT_DIR, `${game}.png`);
      await sharp({
        create: {
          width: CANVAS_W,
          height: CANVAS_H,
          channels: 4,
          background: { r: 0, g: 0, b: 0, alpha: 0 },
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
