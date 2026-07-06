'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function PuzzleBackButton() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [backUrl, setBackUrl] = useState('/');

  useEffect(() => {
    // Check if there's a 'from' query parameter
    const from = searchParams?.get('from');
    if (from === 'daily-challenge') {
      setBackUrl('/daily-challenge');
    } else {
      // Check if the referrer was the daily challenge page
      if (typeof document !== 'undefined' && document.referrer) {
        const referrer = new URL(document.referrer);
        if (referrer.pathname === '/daily-challenge') {
          setBackUrl('/daily-challenge');
        }
      }
    }
  }, [searchParams]);

  return (
    // Desktop only: on mobile it sat exactly under the fixed hamburger button
    // (both top-4 left-4), and swipe/browser back covers the need. Top offset
    // respects the notch/Dynamic-Island safe area (viewport-fit=cover means
    // fixed elements ignore the body's safe-area padding).
    <div className="hidden md:block fixed top-[max(1rem,env(safe-area-inset-top))] left-4 z-50">
      <Link 
        href={backUrl}
        className="inline-flex items-center gap-2 px-3 py-2 bg-[#0F1B21]/80 backdrop-blur-sm border border-[#54FFA4]/30 rounded-lg text-gray-300 hover:text-[#54FFA4] hover:border-[#54FFA4] transition-all group shadow-lg"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span className="text-sm font-medium">Back</span>
      </Link>
    </div>
  );
}
