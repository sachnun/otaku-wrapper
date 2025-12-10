import { requestV2 } from './http'
import { transformV2Comic } from './utils'
import type { ComicListing, V2ListResponse } from './types'

export const scrapeNewComics = async (): Promise<ComicListing[]> => {
  const data = await requestV2<V2ListResponse>('/komik?page=1')
  if (!data?.data) return []
  return data.data.slice(0, 12).map(transformV2Comic)
}

export const scrapeLatestUpdates = async (): Promise<ComicListing[]> => {
  const data = await requestV2<V2ListResponse>('/komik?page=1')
  if (!data?.data) return []
  return data.data.map(transformV2Comic)
}
