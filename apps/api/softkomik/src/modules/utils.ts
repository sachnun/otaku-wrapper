import { BASE_URL, IMAGE_BASE_URL, COVER_BASE_URL } from './constants'
import type { ComicListing, V2ComicItem } from './types'

export const resolveImage = (imagePath: string | null | undefined): string | null => {
  if (!imagePath) return null
  if (imagePath.startsWith('http')) return imagePath

  const normalizedPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath

  if (normalizedPath.startsWith('image-cover/') || normalizedPath.startsWith('uploads-cover')) {
    return `${COVER_BASE_URL}/${normalizedPath}`
  }

  if (normalizedPath.startsWith('NodeJs/') || normalizedPath.startsWith('img-file/')) {
    return `${IMAGE_BASE_URL}/softkomik/${normalizedPath}`
  }

  return `${IMAGE_BASE_URL}/${normalizedPath}`
}

export const extractSlug = (titleSlug: string): string => {
  return titleSlug.replace(/-bahasa-indonesia$/, '')
}

export const transformV2Comic = (item: V2ComicItem): ComicListing => ({
  title: item.title,
  slug: extractSlug(item.title_slug),
  url: `${BASE_URL}/${item.title_slug}`,
  thumbnail: resolveImage(item.gambar),
  type: item.type || null,
  status: item.status || null,
  latestChapter: item.latest_chapter || null,
  updatedAt: item.updated_at || null,
  visitor: item.visitor || null
})
