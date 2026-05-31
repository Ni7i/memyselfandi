import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://www.hpgarage.ch'
  return [
    { url: base, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/#leistungen`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/#galerie`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/#ueber-uns`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.8 },
    { url: `${base}/#kontakt`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
  ]
}
