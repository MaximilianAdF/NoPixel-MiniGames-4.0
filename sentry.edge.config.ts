// Sentry SDK for the edge runtime (middleware / edge routes). Error monitoring only.
import * as Sentry from '@sentry/nextjs';

const DSN =
  process.env.NEXT_PUBLIC_SENTRY_DSN ||
  'https://f838910608b4854248f7c9304f35877e@o4511655842283520.ingest.de.sentry.io/4511655844839504';

Sentry.init({
  dsn: DSN,
  enabled: process.env.NODE_ENV === 'production',
  // Error monitoring only — no performance tracing.
  sendDefaultPii: false,
});
