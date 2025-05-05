// src/app/sitemap.ts

import {client} from '@/sanity/lib/client'
import {SITEMAP_QUERY} from '@/sanity/lib/queries'
import {MetadataRoute} from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    const paths = await client.fetch(SITEMAP_QUERY)

    if (!paths) return []

    const baseUrl = process.env.VERCEL
      ? `https://${process.env.VERCEL_URL}` // 環境変数名は適宜変更
      : 'http://localhost:3000'

    return paths.map((path) => ({
      url: new URL(path.href!, baseUrl).toString(),
      lastModified: new Date(path._updatedAt),
      changeFrequency: 'weekly',
      priority: 1,
    }))
  } catch (error) {
    console.error('Failed to generate sitemap:', error)
    return []
  }
}
