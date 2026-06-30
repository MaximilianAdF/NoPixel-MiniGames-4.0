'use client';

import Script from 'next/script';

// GA4 measurement ID. Overridable via env; falls back to the property's ID so
// it works without extra build-time config.
const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || 'G-FLSWTL4FJJ';

// Loads GA4 (gtag) directly so the custom game events pushed in utils/gtm.ts
// reach GA4 — the GTM container isn't forwarding them. GTM keeps ownership of
// page_view (send_page_view:false here) so it isn't double-counted; both share
// the _ga cookie, so sessions/users stay consistent.
// NOTE: Consent Mode default is set earlier, in the document <head> (see
// app/layout.tsx) so it applies before GTM/gtag fire — do not re-declare it here.
export default function GoogleAnalytics() {
  if (!GA_ID) return null;
  return (
    <>
      <Script
        id="ga4-src"
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=window.gtag||gtag;gtag('js',new Date());gtag('config','${GA_ID}',{send_page_view:false});`}
      </Script>
    </>
  );
}
