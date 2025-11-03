import { ImageResponse } from 'next/og'

export const alt = 'NoPixel 4.0 Minigames - Free GTA RP Practice Simulator'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #0F1B21 0%, #1a2930 50%, #0F1B21 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '60px',
          position: 'relative',
        }}
      >
        {/* Decorative border */}
        <div
          style={{
            position: 'absolute',
            top: '30px',
            left: '30px',
            right: '30px',
            bottom: '30px',
            border: '3px solid rgba(84, 255, 164, 0.2)',
            borderRadius: '20px',
          }}
        />

        {/* Logo/Brand */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            marginBottom: '40px',
          }}
        >
          <div
            style={{
              fontSize: '80px',
              fontFamily: 'monospace',
              fontWeight: 'bold',
              color: '#54FFA4',
              letterSpacing: '-2px',
              textShadow: '0 0 20px rgba(84, 255, 164, 0.5)',
            }}
          >
            NP
          </div>
          <div
            style={{
              fontSize: '48px',
              fontFamily: 'sans-serif',
              fontWeight: 'bold',
              color: 'white',
            }}
          >
            NoPixel 4.0
          </div>
        </div>

        {/* Main Title */}
        <div
          style={{
            fontSize: '64px',
            fontFamily: 'sans-serif',
            fontWeight: 'bold',
            color: 'white',
            textAlign: 'center',
            marginBottom: '20px',
            lineHeight: 1.2,
          }}
        >
          Free GTA RP Practice Simulator
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: '32px',
            fontFamily: 'sans-serif',
            color: '#54FFA4',
            textAlign: 'center',
            marginBottom: '40px',
          }}
        >
          Master Thermite • Lockpick • VAR • Laundromat & More
        </div>

        {/* Features */}
        <div
          style={{
            display: 'flex',
            gap: '40px',
            fontSize: '24px',
            color: '#9CA3AF',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ color: '#54FFA4', fontSize: '32px' }}>•</div>
            <div>Global Leaderboards</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ color: '#54FFA4', fontSize: '32px' }}>•</div>
            <div>Expert Tips</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ color: '#54FFA4', fontSize: '32px' }}>•</div>
            <div>100% Free</div>
          </div>
        </div>

        {/* Bottom domain */}
        <div
          style={{
            position: 'absolute',
            bottom: '40px',
            fontSize: '28px',
            fontFamily: 'monospace',
            color: '#54FFA4',
            opacity: 0.8,
          }}
        >
          no-px.vercel.app
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
