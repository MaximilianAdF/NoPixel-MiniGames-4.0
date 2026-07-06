// Mediavine/Journey page-level ad controls for GAME surfaces: blocks the truly
// game-blocking formats (full-screen interstitials, floating video) plus the
// DESKTOP adhesion — owner found it distracting during play, and desktop game
// pages earn via the sticky sidebar instead. Mobile keeps adhesion (it's the
// only ad unit on mobile game pages, and the layouts reserve clearance for
// it). Read by the Journey script wrapper; unknown attributes are ignored.
export default function MediavineGameSettings() {
  return (
    <div
      id="mediavine-settings"
      data-blocklist-adhesion-desktop="1"
      data-blocklist-auto-insert-sticky="1"
      data-blocklist-universal-player-desktop="1"
      data-blocklist-universal-player-mobile="1"
      data-blocklist-interstitial-mobile="1"
      data-blocklist-interstitial-desktop="1"
    />
  );
}
