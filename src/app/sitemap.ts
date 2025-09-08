import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_WEB_URL || 'http://charlielola.com'
  
  const routes = [
    '',
    '/pricing',
    '/showcase',
    '/posts',
    '/docs',
  ]

  const locales = ['en', 'zh']
  
  const sitemap: MetadataRoute.Sitemap = []

  // Add homepage and main routes for each locale
  routes.forEach(route => {
    locales.forEach(locale => {
      sitemap.push({
        url: `${baseUrl}${locale === 'en' ? '' : `/${locale}`}${route}`,
        lastModified: new Date(),
        changeFrequency: route === '' ? 'daily' : route === '/posts' ? 'weekly' : 'monthly',
        priority: route === '' ? 1 : 0.8,
      })
    })
  })

  // Add alternate language versions
  routes.forEach(route => {
    sitemap.push({
      url: `${baseUrl}${route}`,
      lastModified: new Date(),
      changeFrequency: route === '' ? 'daily' : route === '/posts' ? 'weekly' : 'monthly',
      priority: route === '' ? 1 : 0.8,
      alternates: {
        languages: {
          en: `${baseUrl}${route}`,
          zh: `${baseUrl}/zh${route}`,
        },
      },
    })
  })

  return sitemap
}