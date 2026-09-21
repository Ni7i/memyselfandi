import type { MetadataRoute } from 'next'
import { getPublishedPosts } from '@/lib/content/posts'
import { getPublishedProjects } from '@/lib/content/projects'
import { SITE_URL } from '@/lib/site'

// Follows the published content in /admin.
export const dynamic = 'force-dynamic'

function lastModified(updatedAt: string | null) {
  return updatedAt ? { lastModified: new Date(updatedAt) } : {}
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, projects] = await Promise.all([getPublishedPosts(), getPublishedProjects()])
  return [
    { url: SITE_URL, changeFrequency: 'monthly', priority: 1 },
    { url: `${SITE_URL}/blog`, changeFrequency: 'monthly', priority: 0.7 },
    ...posts.map((post) => ({
      url: `${SITE_URL}/blog/${post.slug}`,
      ...lastModified(post.updatedAt),
      changeFrequency: 'yearly' as const,
      priority: 0.6,
    })),
    ...projects.map((project) => ({
      url: `${SITE_URL}/projects/${project.slug}`,
      ...lastModified(project.updatedAt),
      changeFrequency: 'yearly' as const,
      priority: 0.5,
    })),
  ]
}
