// Mediavine/Journey page-level ad controls for GAME surfaces: blocks only the
// truly game-blocking formats (full-screen interstitials, floating video).
// Adhesion (sticky bottom banner) stays ALLOWED — game layouts reserve bottom
// clearance for it instead, so it earns without covering the board. Read by
// the Journey script wrapper; unknown attributes are ignored.
export default function MediavineGameSettings() {
  return (
    <div
      id="mediavine-settings"
      data-blocklist-auto-insert-sticky="1"
      data-blocklist-universal-player-desktop="1"
      data-blocklist-universal-player-mobile="1"
      data-blocklist-interstitial-mobile="1"
      data-blocklist-interstitial-desktop="1"
    />
  );
}
