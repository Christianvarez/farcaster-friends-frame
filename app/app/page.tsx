import { Metadata } from 'next'

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

export const metadata: Metadata = {
  title: 'Farcaster Friends - Conecta con nuevos amigos',
  description: 'Descubre y conecta con nuevos amigos en Farcaster',
  openGraph: {
    title: 'Farcaster Friends',
    description: 'Descubre y conecta con nuevos amigos',
    images: [`${baseUrl}/api/image`],
  },
  other: {
    'fc:frame': 'vNext',
    'fc:frame:image': `${baseUrl}/api/image`,
    'fc:frame:image:aspect_ratio': '1:1',
    'fc:frame:button:1': 'Seguir 👋',
    'fc:frame:button:1:action': 'post',
    'fc:frame:button:2': 'Siguiente ➡️',
    'fc:frame:button:2:action': 'post',
    'fc:frame:post_url': `${baseUrl}/api/frame`,
  },
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-center font-mono text-sm">
        <h1 className="text-4xl font-bold text-center mb-4">
          Farcaster Friends 🤝
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Un Frame para descubrir y conectar con nuevos amigos en Farcaster
        </p>
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md mx-auto">
          <h2 className="text-2xl font-semibold mb-4">Cómo usar:</h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-700">
            <li>Comparte este Frame en Warpcast</li>
            <li>Descubre perfiles interesantes</li>
            <li>Dale a "Seguir" para conectar</li>
            <li>O "Siguiente" para ver más perfiles</li>
          </ol>
        </div>
      </div>
    </main>
  )
}
