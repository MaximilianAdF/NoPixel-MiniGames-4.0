import { ImageResponse } from 'next/og'

export const size = {
  width: 32,
  height: 32,
}
export const contentType = 'image/png'

export default function Icon() {
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
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(84, 255, 164, 0.5)',
        }}
      >
        <div
          style={{
            fontSize: '20px',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            fontWeight: '900',
            color: '#0F1B21',
            letterSpacing: '-2px',
            textShadow: '0 1px 2px rgba(0,0,0,0.2)',
          }}
        >
          🎮
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
