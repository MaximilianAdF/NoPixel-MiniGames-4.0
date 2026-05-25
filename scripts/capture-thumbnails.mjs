// Auto-screenshot each puzzle page using Playwright; output to public/puzzles/<game>.png.
//
// Each thumbnail keeps the game's own card (NPHackContainer) intact with its
// dark bg, title bar, content and buttons — just like the game looks on its
// own page. The area outside the card's rounded corners is transparent so
// the home-page card surface shows through.
//
// Usage:
//   1. Start the app:  npm run dev   (or npm run build && npm start)
//   2. In another terminal:  npm run thumbnails
//
// Optional env vars: THUMB_BASE_URL, THUMB_OUT_DIR.
import { chromium } from 'playwright';
import { mkdirSync, existsSync } from 'fs';
import { join } from 'path';

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

// Short settle delay — long enough for first-paint and game initial state to
// render. Chopping and other timed games will auto-fail if we wait too long
// (timer expires with no user input), so keep this minimal.
const SETTLE_MS = 600;

// CSS that strips site chrome AND page-level backgrounds so omitBackground
// produces transparent pixels outside the game card's rounded corners.
// Does NOT touch the game card's own dark bg — that stays opaque.
const PREP_CSS = `
  /* Site chrome (nav hamburger, login button, etc.) */
  .fixed.top-4,
  .fixed.top-0,
  .fixed.top-1\\/2,
  .fixed.left-0,
  .fixed.right-0,
  .fixed.inset-0,
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
  /* Hide the settings gear button inside the game's title bar — clutters
     the thumbnail and isn't relevant to a preview. :has() selector picks
     the parent button div so the empty space collapses too. */
  *:has(> .svg-inline--fa.fa-gear),
  *:has(> svg.fa-gear) {
    display: none !important;
  }
  /* Strip backgrounds from every ancestor of the game card so omitBackground
     can produce transparent pixels in the rounded-corner gaps. The game
     card itself (rgb(7,19,32)) is solid colour, not a gradient, so this
     doesn't touch it. */
  html, body,
  body > div, body > div > main,
  body > div > main > div, body > div > main > div > div,
  [class*="puzzle"], [class*="puzzle"] > div {
    background: transparent !important;
    background-image: none !important;
  }
  /* globals.css paints html::before and body::before/::after with fixed
     gradients at z-index -100 — these are pseudo-elements that no element-
     level inline style can touch, so kill them via CSS. */
  html::before, html::after,
  body::before, body::after {
    display: none !important;
    background: transparent !important;
    background-image: none !important;
    content: none !important;
  }
`;

// JS injected in-page: finds the game card (rgb(7, 19, 32)), then walks
// UP its ancestor chain and strips every ancestor's bg-color/bg-image
// inline with !important. Guarantees the game card itself stays painted
// while every layer behind it becomes truly transparent.
const STRIP_ANCESTORS_FN = `(() => {
  // Find the game card by bg colour.
  let card = null;
  document.querySelectorAll('*').forEach((el) => {
    const cs = getComputedStyle(el);
    if (cs.backgroundColor === 'rgb(7, 19, 32)') {
      const r = el.getBoundingClientRect();
      const area = r.width * r.height;
      if (!card || area > card._area) {
        card = el;
        card._area = area;
      }
    }
  });
  if (!card) return 'no-card-found';

  // Strip every ancestor's bg up to html.
  let cur = card.parentElement;
  while (cur) {
    cur.style.setProperty('background-color', 'transparent', 'important');
    cur.style.setProperty('background-image', 'none', 'important');
    cur = cur.parentElement;
  }
  // Also html itself.
  document.documentElement.style.setProperty('background-color', 'transparent', 'important');
  document.documentElement.style.setProperty('background-image', 'none', 'important');
  return 'ok';
})()`;

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
        ],
      },
    ],
  },
});

console.log(`Capturing ${PUZZLES.length} game-card thumbnails from ${BASE_URL}...`);
const t0 = Date.now();

const results = await Promise.allSettled(
  PUZZLES.map(async (game) => {
    const page = await context.newPage();
    try {
      const url = `${BASE_URL}/puzzles/${game}`;
      await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
      await page.addStyleTag({ content: PREP_CSS });
      await page.waitForTimeout(SETTLE_MS);
      const stripResult = await page.evaluate(STRIP_ANCESTORS_FN);
      if (stripResult !== 'ok') {
        console.warn(`  ⚠ ${game}: ${stripResult}`);
      }

      // Find the game card's bounding box. Every game wraps its content in an
      // element with backgroundColor: rgb(7, 19, 32) — that's the dark card
      // (NPHackContainer-like). Target it specifically; if not found, fall
      // back to the largest visible non-fixed HTML element (skip SVG/g
      // elements since they often overflow their parents and report wrong
      // sizes).
      const box = await page.evaluate(() => {
        const main = document.querySelector('main');
        if (!main) return null;
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        const viewportArea = vw * vh;

        // Primary: find the largest element with the game-card bg colour.
        let cardBest = null;
        let cardArea = 0;
        // Fallback: largest visible HTML (non-SVG) element, like before.
        let fallbackBest = null;
        let fallbackArea = 0;

        const walk = (el) => {
          if (!(el instanceof Element)) return;
          const cs = getComputedStyle(el);
          if (cs.position === 'fixed') return;
          if (cs.display === 'none' || cs.visibility === 'hidden') return;
          const r = el.getBoundingClientRect();
          const area = r.width * r.height;
          const centerY = r.top + r.height / 2;
          const inView = centerY > 0 && centerY < vh;

          if (cs.backgroundColor === 'rgb(7, 19, 32)' && inView && area > cardArea) {
            cardArea = area;
            cardBest = r;
          }

          // Fallback only counts plain HTML elements (skip SVG, g, path —
          // those can over-report size due to overflow).
          const isHtml = el instanceof HTMLElement;
          if (
            isHtml &&
            area > 5000 &&
            area < viewportArea * 0.8 &&
            inView &&
            area > fallbackArea
          ) {
            fallbackArea = area;
            fallbackBest = r;
          }

          for (const child of el.children) walk(child);
        };
        walk(main);

        const picked = cardBest || fallbackBest;
        return picked
          ? { x: picked.left, y: picked.top, width: picked.width, height: picked.height }
          : null;
      });

      if (!box) throw new Error('Could not find game element in <main>');

      const clip = {
        x: Math.max(0, Math.floor(box.x)),
        y: Math.max(0, Math.floor(box.y)),
        width: Math.min(VIEWPORT_W, Math.ceil(box.width)),
        height: Math.min(VIEWPORT_H, Math.ceil(box.height)),
      };
      clip.width = Math.min(clip.width, VIEWPORT_W - clip.x);
      clip.height = Math.min(clip.height, VIEWPORT_H - clip.y);

      const outPath = join(OUT_DIR, `${game}.png`);
      await page.screenshot({
        type: 'png',
        path: outPath,
        clip,
        animations: 'disabled',
        omitBackground: true,
      });

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
