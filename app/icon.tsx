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
          background: 'linear-gradient(135deg, #0F1B21 0%, #1a2930 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '6px',
          border: '2px solid #54FFA4',
        }}
      >
        <div
          style={{
            fontSize: '18px',
            fontFamily: 'monospace',
            fontWeight: 'bold',
            color: '#54FFA4',
            letterSpacing: '-1px',
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
