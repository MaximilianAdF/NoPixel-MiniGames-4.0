// Mediavine/Journey page-level ad controls for GAME surfaces: blocks the
// overlay-style units (adhesion banner, floating video, interstitials) that
// can cover a timing-critical game board. In-content units below the game
// (PuzzleInfo) stay allowed. Read by the Journey script wrapper; unknown
// attributes are ignored, so per-device variants are included for coverage.
export default function MediavineGameSettings() {
  return (
    <div
      id="mediavine-settings"
      data-blocklist-adhesion="1"
      data-blocklist-adhesion-mobile="1"
      data-blocklist-adhesion-tablet="1"
      data-blocklist-adhesion-desktop="1"
      data-blocklist-auto-insert-sticky="1"
      data-blocklist-universal-player-desktop="1"
      data-blocklist-universal-player-mobile="1"
      data-blocklist-interstitial-mobile="1"
      data-blocklist-interstitial-desktop="1"
    />
  );
}
