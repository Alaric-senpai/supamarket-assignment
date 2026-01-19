import type { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Next.js Appwrite starter',
    short_name: 'Next Appwrite starter',
    description: 'A fullstack nextjs and appwrite starter cusom',
    start_url: '/',
    display: 'standalone',
    background_color: '#fff',
    theme_color: '#3b82f6',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  }
}