import { fetchText, fetchJson, DEFAULT_HEADERS } from '@otaku-wrapper/core'
import { BASE_URL, V2_API_URL } from './constants'

export const request = async (path: string): Promise<string> => {
  const url = path.startsWith('http') ? path : `${BASE_URL}${path}`
  return fetchText(url, { referer: BASE_URL })
}

export const requestV2 = async <T>(path: string): Promise<T | null> => {
  const url = `${V2_API_URL}${path}`
  try {
    return await fetchJson<T>(url, { referer: BASE_URL })
  } catch {
    return null
  }
}

export { DEFAULT_HEADERS }
