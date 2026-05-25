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
`;

// JS injected in-page to strip ONLY page/body/layout bgs (not the game card).
// Targets bgs that are gradients or specific page-chrome colours; leaves
// rgb(7, 19, 32) (the game card) alone.
const STRIP_PAGE_BGS_FN = `() => {
  const PAGE_BGS = new Set([
    'rgb(2, 6, 23)',
    'rgb(15, 23, 42)',
    'rgb(5, 15, 25)',
    'rgb(10, 25, 40)',
  ]);
  for (const el of [document.documentElement, document.body]) {
    el.style.setProperty('background-color', 'transparent', 'important');
    el.style.setProperty('background-image', 'none', 'important');
  }
  document.querySelectorAll('*').forEach((el) => {
    const cs = getComputedStyle(el);
    // Strip gradients (page layout gradient) but only on big layout elements.
    // The game card itself uses solid colour, not gradient, so it's safe.
    if (cs.backgroundImage.includes('linear-gradient')) {
      el.style.setProperty('background-image', 'none', 'important');
    }
    if (PAGE_BGS.has(cs.backgroundColor)) {
      el.style.setProperty('background-color', 'transparent', 'important');
    }
  });
}`;

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
      await page.evaluate(STRIP_PAGE_BGS_FN);

      // Find the game card's bounding box: largest visible non-fixed element
      // whose centre is in the viewport and isn't itself page-sized.
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
            if (centerY > 0 && centerY < vh && area > bestArea) {
              bestArea = area;
              best = r;
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
