import type { MetadataRoute } from 'next'



export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: ['/', '/auth/**'],
      disallow: ['/admin/**', '/dashboard/**'],
    },
    sitemap: `${process.env.APP_URL}/sitemap.xml`,
  }
}