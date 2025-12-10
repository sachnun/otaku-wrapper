// === PUBLIC TYPES ===

export type ComicListing = {
  title: string
  slug: string
  url: string
  thumbnail: string | null
  type: string | null
  status: string | null
  latestChapter: string | null
  updatedAt: string | null
  visitor: number | null
}

export type ComicDetail = {
  title: string
  alternativeTitle: string | null
  type: string | null
  status: string | null
  releaseYear: string | null
  author: string | null
  rating: { value: number; member: number } | null
  description: string | null
  genres: string[]
  thumbnail: string | null
  visitor: number | null
  latestChapter: string | null
  updatedAt: string | null
}

export type ChapterInfo = {
  number: string
  url: string
}

export type ChapterImages = {
  title: string
  comicSlug: string
  chapterNumber: string
  images: string[]
  prevChapter: string | null
  nextChapter: string | null
}

export type SearchResult = {
  comics: ComicListing[]
  currentPage: number
  totalPages: number
}

export type ChapterListResult = {
  title: string
  firstChapter: string | null
  latestChapter: string | null
  totalChapters: number
  chapters: ChapterInfo[]
}

// === V2 API RAW TYPES ===

export type V2ComicItem = {
  _id: string
  title: string
  title_slug: string
  type: string
  status: string
  gambar: string
  latest_chapter: string
  updated_at: string
  visitor?: number
  latestChapter?: number
  post?: string | string[]
}

export type V2ComicDetail = {
  _id: string
  title: string
  title_alt?: string
  title_slug: string
  type: string
  status: string
  tahun?: string | null
  author?: string
  sinopsis?: string
  Genre?: string[]
  gambar: string
  latest_chapter: string
  updated_at: string
  visitor?: number
  rating?: { value: number; member: number }
}

export type V2ListResponse = {
  page: number
  maxPage: number
  data: V2ComicItem[]
}

export type V2ChapterListResponse = {
  title: string
  startChapter: { chapter: string }[]
  newChapter: { chapter: string }[]
  chapter: { chapter: string }[]
}

export type V2ChapterImagesResponse = {
  komik: {
    title: string
    title_slug: string
    type: string
  }
  chapter: string
  data: {
    chapter: string
    imageSrc: string[]
  } | null
  prevChapter: { chapter: string }[]
  nextChapter: { chapter: string }[]
}
