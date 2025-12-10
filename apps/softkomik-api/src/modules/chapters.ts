import { requestV2 } from './http'
import { resolveImage } from './utils'
import { BASE_URL } from './constants'
import type { ChapterImages, V2ChapterImagesResponse, V2ChapterListResponse, ChapterListResult, ChapterInfo } from './types'

const getChapterVariations = (chapter: string): string[] => {
  const variations: string[] = [chapter]

  const num = parseInt(chapter)
  if (!isNaN(num) && String(num) === chapter) {
    if (chapter.length < 2) variations.push(num.toString().padStart(2, '0'))
    if (chapter.length < 3) variations.push(num.toString().padStart(3, '0'))
    if (chapter.length < 4) variations.push(num.toString().padStart(4, '0'))
  }

  return [...new Set(variations)]
}

const tryFetchChapterV2 = async (fullSlug: string, chapter: string): Promise<{ data: V2ChapterImagesResponse; usedChapter: string } | null> => {
  const variations = getChapterVariations(chapter)

  for (const chapterVar of variations) {
    const data = await requestV2<V2ChapterImagesResponse>(`/komik/${fullSlug}/chapter/${chapterVar}`)
    if (data?.data?.imageSrc && data.data.imageSrc.length > 0) {
      return { data, usedChapter: chapterVar }
    }
  }

  return null
}

export const scrapeChapterImages = async (comicSlug: string, chapter: string): Promise<ChapterImages | null> => {
  const fullSlug = `${comicSlug}-bahasa-indonesia`
  const result = await tryFetchChapterV2(fullSlug, chapter)
  if (!result) return null

  const { data, usedChapter } = result

  const images: string[] = []
  if (data.data?.imageSrc) {
    for (const src of data.data.imageSrc) {
      const fullUrl = resolveImage(src)
      if (fullUrl) images.push(fullUrl)
    }
  }

  const prevChapter = data.prevChapter?.[0]?.chapter || null
  const nextChapter = data.nextChapter?.[0]?.chapter || null

  return {
    title: data.komik?.title || '',
    comicSlug,
    chapterNumber: usedChapter,
    images,
    prevChapter,
    nextChapter
  }
}

export const scrapeChapterList = async (slug: string): Promise<ChapterListResult | null> => {
  const fullSlug = `${slug}-bahasa-indonesia`
  const data = await requestV2<V2ChapterListResponse>(`/komik/${fullSlug}/chapter?limit=9999999`)

  if (!data) return null

  const chapters: ChapterInfo[] = data.chapter.map((ch) => ({
    number: ch.chapter,
    url: `${BASE_URL}/${fullSlug}/chapter/${ch.chapter}`
  }))

  return {
    title: data.title,
    firstChapter: data.startChapter?.[0]?.chapter || null,
    latestChapter: data.newChapter?.[0]?.chapter || null,
    totalChapters: chapters.length,
    chapters
  }
}
