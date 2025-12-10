import { GENRES } from './constants'
import { requestV2 } from './http'
import { transformV2Comic } from './utils'
import type { SearchResult, V2ListResponse } from './types'

export const scrapeByType = async (type: string, page: number = 1): Promise<SearchResult> => {
  const params = new URLSearchParams()
  params.set('type', type)
  if (page > 1) params.set('page', String(page))

  const data = await requestV2<V2ListResponse>(`/komik?${params.toString()}`)

  if (!data) {
    return { comics: [], currentPage: 1, totalPages: 1 }
  }

  return {
    comics: data.data.map(transformV2Comic),
    currentPage: data.page,
    totalPages: data.maxPage
  }
}

export const scrapeByGenre = async (genre: string, page: number = 1): Promise<SearchResult> => {
  const params = new URLSearchParams()
  params.set('genre', genre)
  if (page > 1) params.set('page', String(page))

  const data = await requestV2<V2ListResponse>(`/komik?${params.toString()}`)

  if (!data) {
    return { comics: [], currentPage: 1, totalPages: 1 }
  }

  return {
    comics: data.data.map(transformV2Comic),
    currentPage: data.page,
    totalPages: data.maxPage
  }
}

export const getGenres = (): string[] => {
  return GENRES
}
