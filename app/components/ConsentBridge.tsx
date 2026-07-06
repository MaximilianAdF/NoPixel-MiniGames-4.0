'use client';

import { useEffect } from 'react';

// Single-dialog consent: the Mediavine CMP (IAB TCF, shown only where GDPR
// applies) is the one consent UI, and this bridge translates its signal into
// Google Consent Mode + Clarity. Outside GDPR regions no dialog is required —
// analytics is granted automatically. Replaces the old site cookie banner
// (two stacked consent prompts were shown in the EEA).
export default function ConsentBridge() {
  useEffect(() => {
    const grant = () => {
      (window as any).gtag?.('consent', 'update', { analytics_storage: 'granted' });
      (window as any).clarity?.('consent');
      try {
        localStorage.setItem('cookieConsent', 'accepted');
        localStorage.setItem('cookieConsentDate', new Date().toISOString());
      } catch {}
    };
    const deny = () => {
      (window as any).gtag?.('consent', 'update', { analytics_storage: 'denied' });
      try {
        localStorage.setItem('cookieConsent', 'rejected');
      } catch {}
    };

    // Honor a decision already stored by the old banner.
    try {
      const prior = localStorage.getItem('cookieConsent');
      if (prior === 'accepted') { grant(); return; }
      if (prior === 'rejected') return;
    } catch {}

    let settled = false;
    const onTcf = (tcData: any, success: boolean) => {
      if (!success || !tcData) return;
      if (tcData.eventStatus !== 'tcloaded' && tcData.eventStatus !== 'useractioncomplete') return;
      settled = true;
      if (tcData.gdprApplies === false) { grant(); return; }
      // Purpose 1 = store/access information on a device.
      if (tcData.purpose?.consents?.[1]) grant();
      else deny();
    };

    // The CMP loads late (via the ad wrapper) — poll for its API briefly.
    let tries = 0;
    const timer = setInterval(() => {
      tries += 1;
      const tcfapi = (window as any).__tcfapi;
      if (typeof tcfapi === 'function') {
        clearInterval(timer);
        tcfapi('addEventListener', 2, onTcf);
        return;
      }
      if (tries >= 16) {
        // No CMP after ~8s (blocked, or Mediavine doesn't serve one here).
        // Outside likely-GDPR regions consent isn't required — grant; in
        // Europe stay denied (GA4 keeps sending cookieless pings either way).
        clearInterval(timer);
        if (settled) return;
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
        const likelyGdpr = tz.startsWith('Europe/') || tz === 'Atlantic/Canary' || tz === 'Atlantic/Madeira';
        if (!likelyGdpr) grant();
      }
    }, 500);
    return () => clearInterval(timer);
  }, []);

  return null;
}
