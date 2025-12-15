import { getAllPosts } from '@/lib/posts'
import type { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getAllPosts()
  const baseUrl = 'https://blog.hillway.in'

  const postUrls = posts.map((post) => ({
    url: `${baseUrl}/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    ...postUrls,
  ]
}