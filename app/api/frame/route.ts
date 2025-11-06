import { NextRequest, NextResponse } from 'next/server'
import { neynarClient, getActiveUsers, getRandomUser, followUser } from '@/lib/neynar'

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

let cachedUsers: any[] = []
let lastCacheUpdate = 0
const CACHE_DURATION = 60000

async function getUsers() {
  const now = Date.now()
  
  if (cachedUsers.length === 0 || now - lastCacheUpdate > CACHE_DURATION) {
    cachedUsers = await getActiveUsers(50)
    lastCacheUpdate = now
  }
  
  return cachedUsers
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    
    const { valid, action } = await neynarClient.validateFrameAction({
      messageBytesInHex: body.trustedData.messageBytes,
    })
    
    if (!valid) {
      return new NextResponse('Frame action inválida', { status: 400 })
    }
    
    const buttonIndex = action.tapped_button.index
    const userFid = action.interactor.fid
    
    const users = await getUsers()
    
    const randomUser = getRandomUser(users, userFid)
    
    if (!randomUser) {
      return new NextResponse('No hay usuarios disponibles', { status: 400 })
    }
    
    let message = ''
    if (buttonIndex === 1) {
      message = `¡Genial! Para seguir a @${randomUser.username}, necesitas autorizar la app primero.`
    }
    
    const imageUrl = new URL('/api/image', baseUrl)
    imageUrl.searchParams.set('username', randomUser.username || 'unknown')
    imageUrl.searchParams.set('display_name', randomUser.display_name || 'Usuario')
    imageUrl.searchParams.set('bio', randomUser.profile?.bio?.text || 'Sin biografía')
    imageUrl.searchParams.set('pfp_url', randomUser.pfp_url || '')
    imageUrl.searchParams.set('follower_count', randomUser.follower_count?.toString() || '0')
    
    const html = `
<!DOCTYPE html>
<html>
  <head>
    <meta property="fc:frame" content="vNext" />
    <meta property="fc:frame:image" content="${imageUrl.toString()}" />
    <meta property="fc:frame:image:aspect_ratio" content="1:1" />
    <meta property="fc:frame:button:1" content="Seguir 👋" />
    <meta property="fc:frame:button:1:action" content="post" />
    <meta property="fc:frame:button:2" content="Siguiente ➡️" />
    <meta property="fc:frame:button:2:action" content="post" />
    <meta property="fc:frame:post_url" content="${baseUrl}/api/frame" />
    ${message ? `<meta property="og:description" content="${message}" />` : ''}
  </head>
  <body>
    <p>${message || 'Descubre nuevos amigos en Farcaster'}</p>
  </body>
</html>
`
    
    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html',
      },
    })
  } catch (error: any) {
    console.error('Error procesando frame action:', error)
    
    const errorHtml = `
<!DOCTYPE html>
<html>
  <head>
    <meta property="fc:frame" content="vNext" />
    <meta property="fc:frame:image" content="${baseUrl}/api/image" />
    <meta property="fc:frame:image:aspect_ratio" content="1:1" />
    <meta property="fc:frame:button:1" content="Reintentar 🔄" />
    <meta property="fc:frame:button:1:action" content="post" />
    <meta property="fc:frame:post_url" content="${baseUrl}/api/frame" />
  </head>
  <body>
    <p>Hubo un error. Por favor intenta de nuevo.</p>
  </body>
</html>
`
    
    return new NextResponse(errorHtml, {
      headers: {
        'Content-Type': 'text/html',
      },
    })
  }
}

export const dynamic = 'force-dynamic'
