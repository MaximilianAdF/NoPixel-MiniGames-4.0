import { ImageResponse } from 'next/og'

export const alt = 'NoPixel 4.0 Minigames - Free GTA RP Practice Simulator'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

// Matches the per-game OG images' visual language (dark panel, green accent,
// eyebrow / title / bullets / pill) — pure flex flow, no absolute positioning,
// so nothing can collide.
export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #0a1518 0%, #12242a 50%, #0a1518 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '34px',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '30px' }}>
          <span style={{ color: '#54FFA4', fontWeight: 700 }}>NP 4.0</span>
          <span style={{ color: '#5b6b73' }}>•</span>
          <span style={{ color: '#8fa0a8' }}>Free Practice Trainer</span>
        </div>

        <div
          style={{
            fontSize: '84px',
            fontWeight: 900,
            color: 'white',
            letterSpacing: '1px',
            display: 'flex',
            textAlign: 'center',
          }}
        >
          NoPixel 4.0 Minigames
        </div>

        <div style={{ fontSize: '38px', color: '#54FFA4', display: 'flex' }}>
          Thermite • Lockpick • PinCracker • Roof Running + 4 more
        </div>

        <div style={{ fontSize: '30px', color: '#b9c6cc', display: 'flex' }}>
          Every GTA RP hack, free in your browser — no download, unlimited attempts
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '15px',
            backgroundColor: 'rgba(84, 255, 164, 0.12)',
            padding: '18px 44px',
            borderRadius: '50px',
            border: '2px solid rgba(84, 255, 164, 0.35)',
            marginTop: '10px',
            fontSize: '26px',
          }}
        >
          <span style={{ color: '#54FFA4', fontWeight: 700 }}>START PRACTICING</span>
          <span style={{ color: '#5b6b73' }}>•</span>
          <span style={{ color: '#54FFA4' }}>nphacks.net</span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
