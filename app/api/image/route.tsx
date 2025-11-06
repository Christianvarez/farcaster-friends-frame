import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const username = searchParams.get('username') || 'farcaster_user'
    const displayName = searchParams.get('display_name') || 'Usuario de Farcaster'
    const bio = searchParams.get('bio') || 'Descubre nuevos amigos en Farcaster'
    const pfpUrl = searchParams.get('pfp_url')
    const followerCount = searchParams.get('follower_count') || '0'

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'white',
            padding: '40px',
          }}
        >
          <div
            style={{
              display: 'flex',
              width: '120px',
              height: '120px',
              borderRadius: '60px',
              overflow: 'hidden',
              border: '4px solid #8B5CF6',
              marginBottom: '24px',
              backgroundColor: '#E9D5FF',
            }}
          >
            {pfpUrl ? (
              <img
                src={pfpUrl}
                alt={username}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            ) : (
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '48px',
                  color: '#8B5CF6',
                }}
              >
                👤
              </div>
            )}
          </div>

          <div
            style={{
              fontSize: '40px',
              fontWeight: 'bold',
              color: '#1F2937',
              marginBottom: '8px',
              textAlign: 'center',
            }}
          >
            {displayName}
          </div>

          <div
            style={{
              fontSize: '24px',
              color: '#8B5CF6',
              marginBottom: '20px',
              textAlign: 'center',
            }}
          >
            @{username}
          </div>

          <div
            style={{
              fontSize: '20px',
              color: '#4B5563',
              marginBottom: '24px',
              textAlign: 'center',
              maxWidth: '80%',
              display: 'flex',
              flexWrap: 'wrap',
            }}
          >
            {bio.substring(0, 100)}{bio.length > 100 ? '...' : ''}
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              fontSize: '18px',
              color: '#6B7280',
            }}
          >
            👥 {followerCount} seguidores
          </div>

          <div
            style={{
              position: 'absolute',
              bottom: '20px',
              fontSize: '16px',
              color: '#9CA3AF',
            }}
          >
            🤝 Farcaster Friends
          </div>
        </div>
      ),
      {
        width: 600,
        height: 600,
      }
    )
  } catch (error) {
    console.error('Error generando imagen:', error)
    return new Response('Error generando imagen', { status: 500 })
  }
}
