/**
 * src/app/sitemap.ts
 */

import { MetadataRoute } from 'next'
import { getAvailableTaxYears } from '@/lib/store/taxYear'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://taxcalculator365.com'
  
  // Static routes
  const staticRoutes = ['', '/guides', '/accountants', '/blog', '/compare'].map(route => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }))

  // Tax year routes
  const taxYears = getAvailableTaxYears()
  const taxYearRoutes = taxYears.map(year => ({
    url: `${baseUrl}/tax-year/${year}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.9,
  }))

  // Guide routes
  const guides = ['dividend-tax-guide', 'self-employed-tax-uk']
  const guideRoutes = guides.map(slug => ({
    url: `${baseUrl}/guides/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  return [...staticRoutes, ...taxYearRoutes, ...guideRoutes]
}
