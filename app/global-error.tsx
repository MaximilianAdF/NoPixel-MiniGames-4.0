'use client';

// Root-level error boundary: catches errors thrown in the root layout/template
// (which normal error.tsx boundaries can't) and reports them to Sentry.
import * as Sentry from '@sentry/nextjs';
import { useEffect } from 'react';

export default function GlobalError({ error }: { error: Error & { digest?: string } }) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html>
      <body>
        <div
          style={{
            minHeight: '100dvh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1rem',
            background: '#0F1B21',
            color: '#fff',
            fontFamily: 'sans-serif',
            textAlign: 'center',
            padding: '2rem',
          }}
        >
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Something went wrong</h2>
          <p style={{ color: '#9ca3af' }}>An unexpected error occurred. Try reloading the page.</p>
          <a href="/" style={{ color: '#54FFA4', textDecoration: 'underline' }}>
            Back to home
          </a>
        </div>
      </body>
    </html>
  );
}
