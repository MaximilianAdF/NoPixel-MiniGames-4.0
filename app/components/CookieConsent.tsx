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
    setIsVisible(false);
    setTimeout(() => setShowBanner(false), 300); // Wait for fade out
  };

  const handleReject = () => {
    localStorage.setItem('cookieConsent', 'rejected');
    localStorage.setItem('cookieConsentDate', new Date().toISOString());
    setIsVisible(false);
    setTimeout(() => setShowBanner(false), 300); // Wait for fade out
    
    // Optionally: Disable analytics and ads if rejected
    // You can add logic here to disable Google Analytics and AdSense
    if (typeof window !== 'undefined') {
      // Disable Google Analytics
      (window as any)['ga-disable-GA_MEASUREMENT_ID'] = true;
    }
  };

  const handleClose = () => {
    // Same as reject for now
    handleReject();
  };

  if (!showBanner) return null;

  return (
    <>
      {/* Backdrop - semi-transparent, allows interaction */}
      <div
        className={`fixed inset-0 bg-black/30 z-[9998] transition-opacity duration-300 pointer-events-none ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Cookie Banner */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-[9999] p-4 md:p-6 transition-transform duration-300 ${
          isVisible ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div className="max-w-4xl mx-auto bg-gradient-to-br from-[#1a2930] to-[#0F1B21] border-2 border-[#54FFA4]/50 rounded-xl shadow-2xl overflow-hidden">
          <div className="relative p-6 md:p-8">
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
              aria-label="Close cookie banner"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Content */}
            <div className="flex items-start gap-4 mb-6">
              <div className="flex-shrink-0">
                <Cookie className="w-8 h-8 md:w-10 md:h-10 text-[#54FFA4]" />
              </div>
              <div className="flex-1 pr-8">
                <h3 className="text-xl md:text-2xl font-bold text-white mb-3">
                  🍪 Cookie & Advertising Notice
                </h3>
                <p className="text-gray-300 text-sm md:text-base leading-relaxed mb-3">
                  We use cookies and third-party services to enhance your experience, analyze site traffic, and display personalized advertisements through <strong className="text-white">Google AdSense</strong>. 
                  This includes <strong className="text-white">Google Analytics</strong> for understanding how you use our site, and <strong className="text-white">advertising cookies</strong> that may track your browsing across websites to show relevant ads.
                </p>
                <p className="text-gray-300 text-sm md:text-base leading-relaxed mb-3">
                  By clicking <strong className="text-white">&quot;Accept All&quot;</strong>, you consent to:
                </p>
                <ul className="text-gray-300 text-xs md:text-sm space-y-1 mb-3 ml-4 list-disc">
                  <li>Functional cookies for site features and preferences</li>
                  <li>Google Analytics tracking for site analytics</li>
                  <li>Google AdSense personalized advertising cookies</li>
                  <li>Third-party cookies from ad partners</li>
                </ul>
                <p className="text-gray-400 text-xs md:text-sm">
                  You can manage preferences in your browser or visit our{' '}
                  <Link href="/privacy" className="text-[#54FFA4] hover:text-[#45e894] underline">
                    Privacy Policy
                  </Link>
                  {' '}and{' '}
                  <Link href="/advertising" className="text-[#54FFA4] hover:text-[#45e894] underline">
                    Advertising Policy
                  </Link>
                  {' '}for details.
                </p>
              </div>
            </div>

            {/* Cookie Types (Expandable - Optional) */}
            <div className="mb-6 p-4 bg-[#0F1B21]/50 rounded-lg border border-[#54FFA4]/20">
              <p className="text-sm text-gray-300 mb-2">
                <strong className="text-white">🔹 Essential Cookies:</strong> Required for basic site functionality (login, settings)
              </p>
              <p className="text-sm text-gray-300 mb-2">
                <strong className="text-white">🔹 Analytics Cookies:</strong> Help us understand how you use the site (Google Analytics)
              </p>
              <p className="text-sm text-gray-300">
                <strong className="text-white">🔹 Advertising Cookies:</strong> Used to show relevant ads (Google AdSense)
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <button
                onClick={handleAccept}
                className="flex-1 px-6 py-3 bg-[#54FFA4] text-[#0F1B21] rounded-lg font-bold text-base hover:bg-[#45e894] transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Accept All Cookies
              </button>
              <button
                onClick={handleReject}
                className="flex-1 px-6 py-3 bg-transparent text-white border-2 border-white/30 rounded-lg font-semibold text-base hover:bg-white/10 transition-all duration-200"
              >
                Reject Non-Essential
              </button>
              <Link
                href="/privacy"
                onClick={() => {
                  setIsVisible(false);
                  setTimeout(() => setShowBanner(false), 300);
                }}
                className="flex-1 px-6 py-3 bg-transparent text-gray-300 border-2 border-gray-600 rounded-lg font-semibold text-base hover:bg-gray-600/20 transition-all duration-200 text-center"
              >
                Learn More
              </Link>
            </div>

            {/* Fine Print */}
            <p className="text-xs text-gray-500 mt-4 text-center">
              By using this website, you agree to our{' '}
              <Link href="/terms" className="text-[#54FFA4] hover:underline">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className="text-[#54FFA4] hover:underline">
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
