import { NeynarAPIClient, Configuration } from '@neynar/nodejs-sdk'

if (!process.env.NEYNAR_API_KEY) {
  throw new Error('NEYNAR_API_KEY no está configurada')
}

const config = new Configuration({
  apiKey: process.env.NEYNAR_API_KEY,
})

export const neynarClient = new NeynarAPIClient(config)

export async function getActiveUsers(limit: number = 50) {
  try {
    const response = await neynarClient.fetchPopularCastsByUser({
      fid: 3,
      limit: 25,
    })
    
    const fids = new Set<number>()
    response.casts.forEach(cast => {
      if (cast.author.fid) {
        fids.add(cast.author.fid)
      }
    })
    
    const fidsArray = Array.from(fids).slice(0, limit)
    const users = await neynarClient.fetchBulkUsers({ fids: fidsArray })
    
    return users.users
  } catch (error) {
    console.error('Error obteniendo usuarios activos:', error)
    const fallbackFids = [3, 5, 6, 7, 8, 9, 10, 11, 12, 13]
    const users = await neynarClient.fetchBulkUsers({ fids: fallbackFids })
    return users.users
  }
}

export function getRandomUser(users: any[], excludeFid?: number) {
  let filteredUsers = users
  
  if (excludeFid) {
    filteredUsers = users.filter(user => user.fid !== excludeFid)
  }
  
  if (filteredUsers.length === 0) return null
  
  const randomIndex = Math.floor(Math.random() * filteredUsers.length)
  return filteredUsers[randomIndex]
}

export async function followUser(signerUuid: string, targetFid: number) {
  try {
    const response = await neynarClient.followUser({
      signer_uuid: signerUuid,
      target_fids: [targetFid],
    })
    return response
  } catch (error) {
    console.error('Error siguiendo usuario:', error)
    throw error
  }
}
