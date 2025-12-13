import { Hono } from 'hono'
import { 
  scrapeNewComics, 
  scrapeLatestUpdates,
  scrapeComicList,
  scrapeComicDetail,
  scrapeChapterImages,
  scrapeChapterList,
  scrapeByType,
  scrapeByGenre,
  getGenres
} from './modules'

export const softkomikRoutes = new Hono()

softkomikRoutes.get('/home/new', async (c) => {
  const comics = await scrapeNewComics()
  
  return c.json({
    success: true,
    source: 'softkomik.com',
    type: 'new_comics',
    count: comics.length,
    data: comics
  })
})

softkomikRoutes.get('/home/latest', async (c) => {
  const comics = await scrapeLatestUpdates()
  
  return c.json({
    success: true,
    source: 'softkomik.com',
    type: 'latest_updates',
    count: comics.length,
    data: comics
  })
})

softkomikRoutes.get('/comics', async (c) => {
  const page = parseInt(c.req.query('page') || '1')
  const search = c.req.query('search') || undefined
  
  const result = await scrapeComicList(page, search)
  
  return c.json({
    success: true,
    source: 'softkomik.com',
    search: search || null,
    pagination: {
      currentPage: result.currentPage,
      totalPages: result.totalPages,
      hasNext: result.currentPage < result.totalPages,
      hasPrev: result.currentPage > 1
    },
    count: result.comics.length,
    data: result.comics
  })
})

softkomikRoutes.get('/comics/:slug', async (c) => {
  const { slug } = c.req.param()
  const detail = await scrapeComicDetail(slug)
  
  if (!detail) {
    return c.json({
      success: false,
      error: 'Comic not found'
    }, 404)
  }
  
  return c.json({
    success: true,
    source: 'softkomik.com',
    slug,
    data: detail
  })
})

softkomikRoutes.get('/comics/:slug/chapters', async (c) => {
  const { slug } = c.req.param()
  const chapters = await scrapeChapterList(slug)
  
  if (!chapters) {
    return c.json({
      success: false,
      error: 'Comic not found'
    }, 404)
  }
  
  return c.json({
    success: true,
    source: 'softkomik.com',
    slug,
    data: chapters
  })
})

softkomikRoutes.get('/comics/:slug/chapter/:chapter', async (c) => {
  const { slug, chapter } = c.req.param()
  const images = await scrapeChapterImages(slug, chapter)
  
  if (!images) {
    return c.json({
      success: false,
      error: 'Chapter not found or has no images'
    }, 404)
  }
  
  return c.json({
    success: true,
    source: 'softkomik.com',
    data: images
  })
})

softkomikRoutes.get('/genres', (c) => {
  const genres = getGenres()
  
  return c.json({
    success: true,
    source: 'softkomik.com',
    count: genres.length,
    data: genres
  })
})

softkomikRoutes.get('/type/:type', async (c) => {
  const { type } = c.req.param()
  const page = parseInt(c.req.query('page') || '1')
  
  const validTypes = ['manga', 'manhwa', 'manhua']
  if (!validTypes.includes(type.toLowerCase())) {
    return c.json({
      success: false,
      error: `Invalid type. Valid types: ${validTypes.join(', ')}`
    }, 400)
  }
  
  const result = await scrapeByType(type.toLowerCase(), page)
  
  return c.json({
    success: true,
    source: 'softkomik.com',
    type,
    pagination: {
      currentPage: result.currentPage,
      totalPages: result.totalPages,
      hasNext: result.currentPage < result.totalPages,
      hasPrev: result.currentPage > 1
    },
    count: result.comics.length,
    data: result.comics
  })
})

softkomikRoutes.get('/genre/:genre', async (c) => {
  const { genre } = c.req.param()
  const page = parseInt(c.req.query('page') || '1')
  
  const result = await scrapeByGenre(genre, page)
  
  return c.json({
    success: true,
    source: 'softkomik.com',
    genre,
    pagination: {
      currentPage: result.currentPage,
      totalPages: result.totalPages,
      hasNext: result.currentPage < result.totalPages,
      hasPrev: result.currentPage > 1
    },
    count: result.comics.length,
    data: result.comics
  })
})
