'use client';

import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import LobbyLanding from './LobbyLanding';

// LobbyLanding reads useSearchParams() (the ?full=1 notice), which opts the
// route out of static prerendering. Next requires a Suspense boundary around
// it or the production build fails to export /lobby.
export default function LobbyPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-mirage-950 via-mirage-900 to-mirage-950">
          <Loader2 className="w-6 h-6 text-spring-green-400/50 animate-spin" />
        </div>
      }
    >
      <LobbyLanding />
    </Suspense>
  );
}
