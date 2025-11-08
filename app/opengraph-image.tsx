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
          background: 'linear-gradient(to bottom right, #1e3a5f 0%, #2d4a73 50%, #1e3a5f 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '80px',
          position: 'relative',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              fontSize: '140px',
              fontFamily: 'system-ui, -apple-system, sans-serif',
              fontWeight: '900',
              color: '#54FFA4',
              letterSpacing: '12px',
              marginBottom: '-20px',
              textTransform: 'uppercase',
              textShadow: '0 0 40px rgba(84, 255, 164, 0.5)',
            }}
          >
            NOPIXEL
          </div>

          <div
            style={{
              position: 'absolute',
              top: '140px',
              right: '180px',
              fontSize: '72px',
              fontFamily: 'system-ui, -apple-system, sans-serif',
              fontWeight: 'bold',
              color: 'white',
            }}
          >
            4.0
          </div>

          <div
            style={{
              fontSize: '56px',
              fontFamily: 'cursive',
              fontStyle: 'italic',
              color: '#b8c5d6',
              marginTop: '10px',
              marginBottom: '60px',
              letterSpacing: '2px',
            }}
          >
            Hacking Simulator
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '18px',
              alignItems: 'center',
            }}
          >
            <div
              style={{
                fontSize: '28px',
                fontFamily: 'system-ui, -apple-system, sans-serif',
                color: '#d4e0ed',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              <span style={{ color: '#54FFA4' }}>✓</span>
              <span>8 Authentic NoPixel Minigames</span>
            </div>
            <div
              style={{
                fontSize: '28px',
                fontFamily: 'system-ui, -apple-system, sans-serif',
                color: '#d4e0ed',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              <span style={{ color: '#54FFA4' }}>✓</span>
              <span>Global Leaderboards & Daily Challenges</span>
            </div>
            <div
              style={{
                fontSize: '28px',
                fontFamily: 'system-ui, -apple-system, sans-serif',
                color: '#d4e0ed',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              <span style={{ color: '#54FFA4' }}>✓</span>
              <span>100% Free • No Login Required</span>
            </div>
          </div>
        </div>

        <div
          style={{
            position: 'absolute',
            bottom: '40px',
            display: 'flex',
            alignItems: 'center',
            gap: '15px',
            backgroundColor: 'rgba(84, 255, 164, 0.15)',
            padding: '20px 40px',
            borderRadius: '50px',
            border: '2px solid rgba(84, 255, 164, 0.3)',
          }}
        >
          <div
            style={{
              fontSize: '24px',
              fontFamily: 'system-ui, -apple-system, sans-serif',
              color: '#54FFA4',
              fontWeight: 'bold',
            }}
          >
            ⭐ START PRACTICING NOW
          </div>
          <div
            style={{
              fontSize: '24px',
              fontFamily: 'system-ui, -apple-system, sans-serif',
              color: '#666',
            }}
          >
            •
          </div>
          <div
            style={{
              fontSize: '24px',
              fontFamily: 'system-ui, -apple-system, sans-serif',
              color: '#54FFA4',
            }}
          >
            no-px.vercel.app
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
