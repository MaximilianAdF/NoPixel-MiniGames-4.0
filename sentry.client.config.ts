// Sentry browser SDK — error monitoring only. No Session Replay (Microsoft
// Clarity owns replay/heatmaps), kept lean to protect the client bundle + INP.
import * as Sentry from '@sentry/nextjs';

const DSN =
  process.env.NEXT_PUBLIC_SENTRY_DSN ||
  'https://f838910608b4854248f7c9304f35877e@o4511655842283520.ingest.de.sentry.io/4511655844839504';

Sentry.init({
  dsn: DSN,
  // Report from production only so local/dev noise never burns the quota.
  enabled: process.env.NODE_ENV === 'production',
  // Error monitoring only — no performance tracing (Cloudflare RUM already
  // covers real-user perf) and no Session Replay (Clarity owns replay). The
  // tracing code is tree-shaken out via __SENTRY_TRACING__:false (next.config).
  sendDefaultPii: false,
  // Third-party ad/CMP scripts throw unactionable cross-origin errors — keep
  // them out of the quota so real site errors stay visible.
  denyUrls: [
    /scriptwrapper\.com/,
    /grow\.me/,
    /journeymv\.com/,
    /googlesyndication\.com/,
    /doubleclick\.net/,
    /adtrafficquality\.google/,
    /amazon-adsystem\.com/,
    /consentmanager\.net/,
    /uidapi\.com/,
    /uid2-sdk/,
    /optable/,
    /prebid/,
  ],
  // Ad-stack + navigation noise seen in production (blocked SDK loads, fetches
  // aborted by page navigation) — unactionable, filtered by message.
  ignoreErrors: [
    /UID2 SDK failed to load/,
    /window\.optable/,
    /ym\.0/,
    'AbortError: Fetch is aborted',
  ],
});
