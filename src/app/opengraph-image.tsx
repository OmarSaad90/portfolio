import { ImageResponse } from 'next/og'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'flex-start',
          padding: '80px',
          background: '#23212C',
          color: '#eeebe2',
          fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{
            width: 96,
            height: 96,
            borderRadius: '50%',
            background: '#ddbc1a',
            marginBottom: 40,
            boxShadow: '0 0 90px 24px rgba(221,188,26,0.35)',
            display: 'flex',
          }}
        />
        <div style={{ fontSize: 64, fontWeight: 700, letterSpacing: '-0.02em', display: 'flex' }}>
          Omar Saad
        </div>
        <div style={{ fontSize: 32, color: '#16bbbc', marginTop: 16, display: 'flex' }}>
          Freelance Web Developer in Lebanon
        </div>
      </div>
    ),
    { ...size }
  )
}
