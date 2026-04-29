/**
 * src/app/robots.ts
 */

import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/login/'],
    },
    sitemap: 'https://taxcalculator365.com/sitemap.xml',
  }
}
