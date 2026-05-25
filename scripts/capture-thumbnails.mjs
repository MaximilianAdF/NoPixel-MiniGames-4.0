// Auto-screenshot each puzzle page using Playwright; output to public/puzzles/<game>.png.
//
// Each thumbnail is just the game's own card — clipped tight to the rendered
// element with a transparent background outside the card's rounded corners.
// Natural aspect per game (no forced uniform canvas), so the home page can
// display each at its actual proportions via object-contain on the card.
//
// Usage:
//   1. Start the app:  npm run dev   (or npm run build && npm start)
//   2. In another terminal:  npm run thumbnails
//
// Optional env vars:
//   THUMB_BASE_URL    — defaults to http://localhost:3000
//   THUMB_OUT_DIR     — output dir (default public/puzzles)
import { chromium } from 'playwright';
import sharp from 'sharp';
import { mkdirSync, existsSync } from 'fs';
import { join } from 'path';

// Dark "card chrome" colours to make transparent in post-processing.
// Anything in the captured PNG within COLOR_TOLERANCE of these turns alpha=0.
// Pulled from the inspection of html bg, body gradient, puzzle-layout
// gradient, and the rgb(7,19,32) inner card.
const CHROME_COLORS = [
  [7, 19, 32],
  [5, 15, 25],
  [10, 25, 40],
  [2, 6, 23],
  [15, 23, 42],
  [0, 0, 0], // pure black for the background image's darkest pixels
];
const COLOR_TOLERANCE = 18; // generous enough to catch gradient interpolations

const BASE_URL = process.env.THUMB_BASE_URL || 'http://localhost:3000';
const OUT_DIR = process.env.THUMB_OUT_DIR || 'public/puzzles';

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

// CSS injected on every page to hide site chrome and dev overlays AND strip
// page-level backgrounds so omitBackground:true produces transparent pixels
// outside the game card's rounded corners.
const HIDE_CHROME_CSS = `
  /* Site chrome (nav, login, dropdowns) */
  .fixed.top-4,
  .fixed.top-0,
  .fixed.top-1\\/2,
  .fixed.left-0,
  .fixed.right-0,
  .fixed.inset-0,
  /* Root layout's <Background> fixed image — fills the whole viewport
     behind everything, so we have to hide it for transparency. */
  .fixed.w-screen,
  .fixed.-z-50,
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
  /* Strip backgrounds from every ancestor in the path down to the
     game card so omitBackground produces real transparent pixels.
     Covers: html → body → puzzle-layout div → main → centering div
     → game wrapper. */
  html, body,
  body > div, body > div > main,
  body > div > main > div, body > div > main > div > div,
  [class*="puzzle"], [class*="puzzle"] > div {
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

console.log(`Capturing ${PUZZLES.length} natural-aspect thumbnails from ${BASE_URL}...`);
const t0 = Date.now();

const results = await Promise.allSettled(
  PUZZLES.map(async (game) => {
    const page = await context.newPage();
    try {
      const url = `${BASE_URL}/puzzles/${game}`;
      await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
      await page.addStyleTag({ content: HIDE_CHROME_CSS });
      await page.waitForTimeout(SETTLE_MS);

      // Strip ALL backgrounds via inline !important so omitBackground:true
      // produces real transparent pixels around the game pieces. Targets
      // the dark page/layout/card chrome. Game pieces with their own
      // bg-color (Thermite tiles, Roof Running cubes, buttons) keep their
      // colours because their style attribute or computed bg isn't dark
      // grey/transparent — we only nuke "chrome" colours.
      //
      // Why JS, not CSS: the root <html> and <body> have inline style
      // background-image with a linear-gradient. External CSS !important
      // _should_ beat inline non-important, but Playwright's addStyleTag
      // ordering doesn't reliably win against React-rendered inline
      // styles in this layout. Inline !important via JS is bulletproof.
      await page.evaluate(() => {
        const CHROME_BGS = new Set([
          'rgb(7, 19, 32)',     // outer dark card on every game
          'rgb(2, 6, 23)',      // body bg
          'rgb(15, 23, 42)',    // body gradient midpoint
          'rgb(5, 15, 25)',     // puzzle layout gradient start
          'rgb(10, 25, 40)',    // puzzle layout gradient mid
        ]);
        // Always nuke html + body chrome
        for (const el of [document.documentElement, document.body]) {
          el.style.setProperty('background-color', 'transparent', 'important');
          el.style.setProperty('background-image', 'none', 'important');
        }
        // Walk everything else and nuke matching chrome bgs
        document.querySelectorAll('*').forEach((el) => {
          const cs = getComputedStyle(el);
          if (CHROME_BGS.has(cs.backgroundColor) || cs.backgroundImage.includes('linear-gradient')) {
            el.style.setProperty('background-color', 'transparent', 'important');
            el.style.setProperty('background-image', 'none', 'important');
          }
        });
      });

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

      // Clip exactly to the game card's bounding box. omitBackground:true
      // gives transparent pixels outside the rounded corners — so the home
      // card's background shows through and the game card appears to "sit
      // on" the home card.
      const clip = {
        x: Math.max(0, Math.floor(box.x)),
        y: Math.max(0, Math.floor(box.y)),
        width: Math.min(VIEWPORT_W, Math.ceil(box.width)),
        height: Math.min(VIEWPORT_H, Math.ceil(box.height)),
      };
      clip.width = Math.min(clip.width, VIEWPORT_W - clip.x);
      clip.height = Math.min(clip.height, VIEWPORT_H - clip.y);

      const rgbBuffer = await page.screenshot({
        type: 'png',
        clip,
        animations: 'disabled',
        omitBackground: true,
      });

      // Post-process: color-key the dark "card chrome" pixels to transparent.
      // Playwright's omitBackground only handles BODY/HTML bgs, not the
      // nested card-chrome paints, so we do it after capture in pixel space.
      const { data, info } = await sharp(rgbBuffer)
        .ensureAlpha()
        .raw()
        .toBuffer({ resolveWithObject: true });

      // Walk pixels; set alpha=0 where the RGB is within COLOR_TOLERANCE of
      // any CHROME_COLOR. Game pieces with their own bright colours (Thermite
      // tiles, Roof Running cubes, buttons) aren't dark grey/blue so they
      // stay opaque.
      const out = Buffer.from(data);
      for (let i = 0; i < out.length; i += 4) {
        const r = out[i], g = out[i + 1], b = out[i + 2];
        for (let c = 0; c < CHROME_COLORS.length; c++) {
          const [tr, tg, tb] = CHROME_COLORS[c];
          if (
            Math.abs(r - tr) <= COLOR_TOLERANCE &&
            Math.abs(g - tg) <= COLOR_TOLERANCE &&
            Math.abs(b - tb) <= COLOR_TOLERANCE
          ) {
            out[i + 3] = 0;
            break;
          }
        }
      }

      const outPath = join(OUT_DIR, `${game}.png`);
      await sharp(out, {
        raw: { width: info.width, height: info.height, channels: 4 },
      })
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
    console.log(`  ✓ ${game.padEnd(13)}→ ${outPath}  (${captured.width}×${captured.height})`);
  } else {
    fail++;
    console.error(`  ✗ ${r.reason?.message || r.reason}`);
  }
}

console.log(`\nDone in ${Date.now() - t0}ms — ${ok} ok, ${fail} fail.`);
process.exit(fail > 0 ? 1 : 0);
