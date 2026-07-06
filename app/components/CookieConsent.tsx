'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Cookie, X } from 'lucide-react';

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already consented
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      // Delay showing banner to let users see content first (reduces bounce rate)
      setTimeout(() => {
        setShowBanner(true);
        setTimeout(() => setIsVisible(true), 100); // Fade in animation
      }, 3000); // 3 second delay - users can interact with site first
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    localStorage.setItem('cookieConsentDate', new Date().toISOString());
    // Grant GA4 analytics (Consent Mode) now that the user has opted in.
    (window as any).gtag?.('consent', 'update', { analytics_storage: 'granted' });
    setIsVisible(false);
    setTimeout(() => setShowBanner(false), 300); // Wait for fade out
  };

  const handleReject = () => {
    localStorage.setItem('cookieConsent', 'rejected');
    localStorage.setItem('cookieConsentDate', new Date().toISOString());
    setIsVisible(false);
    setTimeout(() => setShowBanner(false), 300); // Wait for fade out
    
    // Keep GA4 analytics off via Consent Mode.
    (window as any).gtag?.('consent', 'update', { analytics_storage: 'denied' });
  };

  const handleClose = () => {
    // Same as reject for now
    handleReject();
  };

  if (!showBanner) return null;

  // Compact card (was a near-full-screen sheet on mobile): one line, two
  // buttons, inline privacy link — no page-dimming backdrop.
  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-[9999] p-3 sm:p-4 transition-transform duration-300 ${
        isVisible ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      <div className="max-w-xl mx-auto bg-gradient-to-br from-[#1a2930] to-[#0F1B21] border border-[#54FFA4]/40 rounded-xl shadow-2xl p-4 relative">
        <button
          onClick={handleClose}
          className="absolute top-2.5 right-2.5 text-gray-500 hover:text-white transition-colors"
          aria-label="Close cookie banner"
        >
          <X className="w-4 h-4" />
        </button>
        <div className="flex items-start gap-3">
          <Cookie className="w-5 h-5 text-[#54FFA4] flex-shrink-0 mt-0.5" />
          <p className="text-gray-300 text-sm leading-snug pr-5">
            We use cookies for site features and <strong className="text-white">Google Analytics</strong>.{' '}
            <Link href="/privacy" className="text-[#54FFA4] hover:text-[#45e894] underline">
              Privacy Policy
            </Link>
          </p>
        </div>
        <div className="flex gap-2.5 mt-3">
          <button
            onClick={handleAccept}
            className="flex-1 px-4 py-2 bg-[#54FFA4] text-[#0F1B21] rounded-lg font-bold text-sm hover:bg-[#45e894] transition-all duration-200"
          >
            Accept
          </button>
          <button
            onClick={handleReject}
            className="flex-1 px-4 py-2 bg-transparent text-white border border-white/30 rounded-lg font-semibold text-sm hover:bg-white/10 transition-all duration-200"
          >
            Reject
          </button>
        </div>
      </div>
    </div>
  );
}
