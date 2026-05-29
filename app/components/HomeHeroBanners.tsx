'use client';

import { useUser } from '../contexts/UserContext';
import { useDailyChallenge } from '../hooks/useDailyChallenge';
import DailyChallengeHero from './DailyChallengeHero';
import OneVOneHero from './OneVOneHero';

// Renders the daily-challenge + 1v1 banner pair at the top of the home
// page. Owns the decision of which to show and how to lay them out:
//   - Both visible  → 2-column grid
//   - Only 1v1      → 1-column (when daily is completed, missing, or the
//                     user finishes it today)
//
// Avoids the "skeleton flash then disappear" layout shift completed users
// used to get: we wait for *both* the user session and the challenge fetch
// to settle before rendering anything, so completed users go straight from
// blank → just the 1v1 card with no daily skeleton in between.
export default function HomeHeroBanners() {
  const { isLoading: userLoading, isLoggedIn, dailyChallengeStatus } = useUser();
  const { challenge, loading: challengeLoading } = useDailyChallenge();

  // Have we got everything we need to make a final layout call?
  const userStatusKnown = !userLoading && (!isLoggedIn || dailyChallengeStatus !== null);
  const challengeKnown = !challengeLoading;
  const ready = userStatusKnown && challengeKnown;

  // Reserve approximate hero height during the brief settle window so the
  // rest of the page doesn't jump when the banners pop in. Empty box, no
  // skeleton, no flicker.
  if (!ready) {
    // `!mt-4` overrides the parent's `space-y-16` (4rem) — the original
    // spacing was tuned for the legacy tall hero, the new compact banners
    // make that gap feel oversized.
    return <div aria-hidden className="!mt-4 w-full max-w-5xl mx-auto mb-12 h-[88px]" />;
  }

  const dailyVisible =
    challenge !== null && !(isLoggedIn && dailyChallengeStatus?.completed);

  // When daily is hidden we keep the same grid + the same per-card width
  // as the paired layout (an empty placeholder fills the daily slot), so
  // the 1v1 card doesn't expand wider — it stays where it would have been
  // in the right column.
  return (
    <div className="!mt-4 w-full max-w-5xl mx-auto mb-12 grid gap-4 grid-cols-1 md:grid-cols-2">
      {dailyVisible && challenge ? (
        <DailyChallengeHero challenge={challenge} />
      ) : (
        <div aria-hidden className="hidden md:block" />
      )}
      <OneVOneHero />
    </div>
  );
}
