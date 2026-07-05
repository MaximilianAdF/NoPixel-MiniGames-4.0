#!/usr/bin/env node
/* Browser inspection tool for the SEO agent — lets it SEE the live site.

Usage:
  node scripts/seo-agent/inspect.js <url> [--mobile] [--shot reports/_shots/name.png] [--scroll]

Prints JSON: http status, title, meta description, canonical, h1s, console/page
errors, ad state (#sidebar, adhesion/ad iframes), and layout red flags
(horizontal overflow, elements overlapping the bottom ad zone). With --shot it
saves a screenshot the agent can view with the Read tool. --mobile uses a
390x844 viewport; --scroll scrolls mid-page first (triggers lazy content/ads).
*/
const { chromium } = require('playwright');

(async () => {
  const args = process.argv.slice(2);
  const url = args.find((a) => !a.startsWith('--'));
  if (!url) { console.error('usage: inspect.js <url> [--mobile] [--shot path.png] [--scroll]'); process.exit(1); }
  const mobile = args.includes('--mobile');
  const scroll = args.includes('--scroll');
  const shotIdx = args.indexOf('--shot');
  const shot = shotIdx > -1 ? args[shotIdx + 1] : null;

  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: mobile ? { width: 390, height: 844 } : { width: 1920, height: 1080 },
    userAgent: mobile
      ? 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148 Safari/604.1'
      : undefined,
  });
  const errors = [];
  page.on('pageerror', (e) => errors.push({ type: 'pageerror', msg: String(e).slice(0, 200) }));
  page.on('console', (m) => { if (m.type() === 'error') errors.push({ type: 'console', msg: m.text().slice(0, 200) }); });

  const resp = await page.goto(url, { waitUntil: 'networkidle', timeout: 45000 }).catch(() => null);
  await page.waitForTimeout(6000);
  if (scroll) {
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2));
    await page.waitForTimeout(3000);
  }

  const facts = await page.evaluate(() => {
    const q = (s) => document.querySelector(s);
    const adIframes = [...document.querySelectorAll('iframe')].filter((f) => f.offsetWidth > 20)
      .map((f) => `${f.offsetWidth}x${f.offsetHeight}`);
    const sidebar = document.getElementById('sidebar');
    const bodyW = document.documentElement.scrollWidth;
    return {
      title: document.title,
      metaDescription: q('meta[name="description"]')?.content?.slice(0, 200) || null,
      canonical: q('link[rel="canonical"]')?.href || null,
      h1s: [...document.querySelectorAll('h1')].map((h) => h.textContent.trim().slice(0, 90)),
      ogImage: q('meta[property="og:image"]')?.content || null,
      sidebarAd: sidebar ? `${Math.round(sidebar.offsetWidth)}x${Math.round(sidebar.offsetHeight)}` : null,
      visibleAdIframes: adIframes.slice(0, 8),
      horizontalOverflow: bodyW > window.innerWidth + 2 ? `${bodyW}px vs ${window.innerWidth}px viewport` : null,
    };
  });

  if (shot) await page.screenshot({ path: shot, fullPage: false });
  await browser.close();

  console.log(JSON.stringify({
    url, status: resp ? resp.status() : 'NO RESPONSE', viewport: mobile ? 'mobile 390x844' : 'desktop 1920x1080',
    ...facts, errors: errors.slice(0, 10), screenshot: shot || null,
  }, null, 1));
})();
