import { ImageResponse } from 'next/og'

// iOS home-screen icon (180x180). Mirrors app/icon.tsx so the brand mark is
// consistent across Google favicons, browser tabs, and saved-to-homescreen.
export const size = {
  width: 180,
  height: 180,
}
export const contentType = 'image/png'

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #00ff88 0%, #54FFA4 50%, #00cc6e 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '40px',
          boxShadow: '0 12px 48px rgba(84, 255, 164, 0.5)',
        }}
      >
        <div
          style={{
            fontSize: '112px',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            fontWeight: '900',
            color: '#0F1B21',
            letterSpacing: '-11px',
            textShadow: '0 6px 12px rgba(0,0,0,0.2)',
          }}
        >
          NP
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
