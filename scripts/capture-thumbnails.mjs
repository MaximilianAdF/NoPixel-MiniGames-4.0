// Auto-screenshot each puzzle page using Playwright; output to public/puzzles/<game>.png.
//
// Usage:
//   1. Start the app:  npm run dev   (or npm run build && npm start)
//   2. In another terminal:  node scripts/capture-thumbnails.mjs
//
// Optional env vars:
//   THUMB_BASE_URL   — defaults to http://localhost:3000
//   THUMB_WIDTH      — output PNG width (default 1200)
//   THUMB_HEIGHT     — output PNG height (default 675, 16:9)
//   THUMB_OUT_DIR    — output dir (default public/puzzles)
//
// Wire into your deploy by adding a "prebuild" script that runs a production
// build, starts it, runs this, kills it. For now it's a manual on-demand step.
import { chromium } from 'playwright';
import { mkdirSync, existsSync } from 'fs';
import { join } from 'path';

const BASE_URL = process.env.THUMB_BASE_URL || 'http://localhost:3000';
const WIDTH = parseInt(process.env.THUMB_WIDTH || '1200', 10);
const HEIGHT = parseInt(process.env.THUMB_HEIGHT || '675', 10);
const OUT_DIR = process.env.THUMB_OUT_DIR || 'public/puzzles';

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

if (!existsSync(OUT_DIR)) {
  mkdirSync(OUT_DIR, { recursive: true });
}

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: WIDTH, height: HEIGHT },
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

// CSS injected on every page to hide site chrome and dev overlays so the
// screenshot captures only the game itself.
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

console.log(`Capturing ${PUZZLES.length} thumbnails from ${BASE_URL}...`);
const t0 = Date.now();

const results = await Promise.allSettled(
  PUZZLES.map(async (game) => {
    const page = await context.newPage();
    try {
      const url = `${BASE_URL}/puzzles/${game}`;
      await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
      // Hide chrome before paint.
      await page.addStyleTag({ content: HIDE_CHROME_CSS });
      // Let the game's first auto-frame settle (random tiles, animations, etc.).
      await page.waitForTimeout(SETTLE_MS);
      // Full-viewport screenshot — game is centered, chrome is hidden via CSS.
      // animations:'disabled' freezes CSS animations so games with continuous
      // motion (rotating lockpick rings, falling tiles, combos) screenshot cleanly.
      const outPath = join(OUT_DIR, `${game}.png`);
      await page.screenshot({
        path: outPath,
        type: 'png',
        animations: 'disabled',
      });
      return { game, outPath, ok: true };
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
    console.log(`  ✓ ${r.value.game}  → ${r.value.outPath}`);
  } else {
    fail++;
    console.error(`  ✗ ${r.reason?.message || r.reason}`);
  }
}

console.log(`\nDone in ${Date.now() - t0}ms — ${ok} ok, ${fail} fail.`);
process.exit(fail > 0 ? 1 : 0);
