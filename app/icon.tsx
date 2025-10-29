import { ImageResponse } from 'next/og'

// Image metadata
export const size = {
  width: 32,
  height: 32,
}
export const contentType = 'image/png'

// Image generation
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'transparent',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            fontSize: '20px',
            fontFamily: 'monospace',
            fontWeight: 'bold',
            background: 'linear-gradient(135deg, #09de6e 0%, #64ffda 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
            display: 'flex',
            letterSpacing: '1px',
          }}
        >
          np
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
