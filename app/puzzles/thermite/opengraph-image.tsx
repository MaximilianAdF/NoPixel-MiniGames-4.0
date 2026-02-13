import { ImageResponse } from 'next/og'

export const alt = 'Thermite Hack Practice - NoPixel 4.0 Minigames'
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
            border: '3px solid rgba(255, 69, 58, 0.3)',
            borderRadius: '20px',
          }}
        />

        {/* Top Badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '15px',
            marginBottom: '30px',
          }}
        >
          <div
            style={{
              fontSize: '40px',
              fontFamily: 'monospace',
              fontWeight: 'bold',
              color: '#54FFA4',
              letterSpacing: '-1px',
            }}
          >
            NP 4.0
          </div>
          <div
            style={{
              fontSize: '24px',
              fontFamily: 'sans-serif',
              color: '#888',
            }}
          >
            •
          </div>
          <div
            style={{
              fontSize: '24px',
              fontFamily: 'sans-serif',
              color: '#888',
            }}
          >
            Minigames
          </div>
        </div>

        {/* Game Icon/Emoji */}
        <div
          style={{
            fontSize: '120px',
            marginBottom: '20px',
          }}
        >
          🔥
        </div>

        {/* Main Title */}
        <div
          style={{
            fontSize: '72px',
            fontFamily: 'sans-serif',
            fontWeight: 'bold',
            color: 'white',
            textAlign: 'center',
            marginBottom: '15px',
            lineHeight: 1.1,
          }}
        >
          Thermite Hack
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: '32px',
            fontFamily: 'sans-serif',
            color: '#FF453A',
            textAlign: 'center',
            marginBottom: '30px',
          }}
        >
          Maze Bank • Laser Disable
        </div>

        {/* Description */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          <div
            style={{
              fontSize: '24px',
              fontFamily: 'sans-serif',
              color: '#AAA',
              textAlign: 'center',
            }}
          >
            Practice the iconic thermite sequence minigame
          </div>
          <div
            style={{
              fontSize: '24px',
              fontFamily: 'sans-serif',
              color: '#AAA',
              textAlign: 'center',
            }}
          >
            Master timing • Compete on leaderboards • Free training
          </div>
        </div>

        {/* Bottom Badge */}
        <div
          style={{
            position: 'absolute',
            bottom: '40px',
            display: 'flex',
            alignItems: 'center',
            gap: '15px',
            backgroundColor: 'rgba(84, 255, 164, 0.1)',
            padding: '15px 30px',
            borderRadius: '50px',
          }}
        >
          <div
            style={{
              fontSize: '20px',
              fontFamily: 'sans-serif',
              color: '#54FFA4',
              fontWeight: 'bold',
            }}
          >
            ⭐ FREE PRACTICE
          </div>
          <div
            style={{
              fontSize: '20px',
              fontFamily: 'sans-serif',
              color: '#666',
            }}
          >
            •
          </div>
          <div
            style={{
              fontSize: '20px',
              fontFamily: 'sans-serif',
              color: '#54FFA4',
            }}
          >
            nphacks.net
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
