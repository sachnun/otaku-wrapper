import { request, requestV2 } from './http'
import { resolveImage } from './utils'
import { BASE_URL } from './constants'
import type { ChapterImages, V2ChapterImagesResponse, V2ChapterListResponse, ChapterListResult, ChapterInfo } from './types'

interface NextDataChapter {
  data?: { imageSrc?: string[] }
  komik?: { title?: string; slug?: string }
  prevChapter?: Array<{ chapter?: string }>
  nextChapter?: Array<{ chapter?: string }>
}

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

const tryFetchChapterHtml = async (fullSlug: string, chapter: string): Promise<{ data: NextDataChapter; usedChapter: string } | null> => {
  const variations = getChapterVariations(chapter)

  for (const chapterVar of variations) {
    try {
      const html = await request(`/${fullSlug}/chapter/${chapterVar}`)
      const match = html.match(/<script id="__NEXT_DATA__"[^>]*>([^<]+)<\/script>/)
      if (!match) continue

      const nextData = JSON.parse(match[1])
      const pageProps = nextData?.props?.pageProps?.data
      if (pageProps?.data?.imageSrc && pageProps.data.imageSrc.length > 0) {
        return { data: pageProps, usedChapter: chapterVar }
      }
    } catch {
      continue
    }
  }

  return null
}

export const scrapeChapterImages = async (comicSlug: string, chapter: string): Promise<ChapterImages | null> => {
  const fullSlug = `${comicSlug}-bahasa-indonesia`

  // Try V2 API first
  let result = await tryFetchChapterV2(fullSlug, chapter)

  // Fallback to HTML scraping if V2 fails
  if (!result) {
    const htmlResult = await tryFetchChapterHtml(fullSlug, chapter)
    if (htmlResult) {
      const { data, usedChapter } = htmlResult
      const images: string[] = []
      if (data.data?.imageSrc) {
        for (const src of data.data.imageSrc) {
          const fullUrl = resolveImage(src)
          if (fullUrl) images.push(fullUrl)
        }
      }

      return {
        title: data.komik?.title || '',
        comicSlug,
        chapterNumber: usedChapter,
        images,
        prevChapter: data.prevChapter?.[0]?.chapter || null,
        nextChapter: data.nextChapter?.[0]?.chapter || null
      }
    }
    return null
  }

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

  // Try V2 API first
  const data = await requestV2<V2ChapterListResponse>(`/komik/${fullSlug}/chapter?limit=9999999`)

  if (data) {
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

  // Fallback to HTML scraping
  try {
    const html = await request(`/${fullSlug}`)
    const match = html.match(/<script id="__NEXT_DATA__"[^>]*>([^<]+)<\/script>/)
    if (!match) return null

    const nextData = JSON.parse(match[1])
    const pageProps = nextData?.props?.pageProps
    const chapterList = pageProps?.chapter || []

    const chapters: ChapterInfo[] = chapterList.map((ch: { chapter: string }) => ({
      number: ch.chapter,
      url: `${BASE_URL}/${fullSlug}/chapter/${ch.chapter}`
    }))

    return {
      title: pageProps?.title || '',
      firstChapter: pageProps?.startChapter?.[0]?.chapter || null,
      latestChapter: pageProps?.newChapter?.[0]?.chapter || null,
      totalChapters: chapters.length,
      chapters
    }
  } catch {
    return null
  }
}
