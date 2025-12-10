import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi'
import { cors } from 'hono/cors'
import { etag } from 'hono/etag'
import { swaggerUI } from '@hono/swagger-ui'
import {
	getNovelList,
	getNovelDetail,
	getChapterList,
	getChapterContent,
	searchNovels,
	getLatestUpdates,
	getGenres,
	getNovelsByGenre
} from './scraper'

const app = new OpenAPIHono()

// Middleware
// Note: Compression is handled automatically by Cloudflare Workers at the edge
app.use('*', cors())
app.use('*', etag())

// Schemas
const NovelSchema = z.object({
	slug: z.string(),
	title: z.string(),
	cover: z.string(),
	latestChapter: z.string().optional(),
	latestChapterUrl: z.string().optional()
}).openapi('Novel')

const NovelDetailSchema = z.object({
	slug: z.string(),
	title: z.string(),
	cover: z.string(),
	description: z.string(),
	author: z.string(),
	artist: z.string(),
	genres: z.array(z.string()),
	status: z.string(),
	type: z.string(),
	rating: z.string()
}).openapi('NovelDetail')

const ChapterSchema = z.object({
	slug: z.string(),
	title: z.string(),
	url: z.string(),
	date: z.string().optional()
}).openapi('Chapter')

const ChapterContentSchema = z.object({
	title: z.string(),
	novelTitle: z.string(),
	novelSlug: z.string(),
	content: z.string(),
	prevChapter: z.string().optional(),
	nextChapter: z.string().optional()
}).openapi('ChapterContent')

const ErrorSchema = z.object({
	error: z.string()
}).openapi('Error')

const GenreSchema = z.object({
	slug: z.string(),
	name: z.string()
}).openapi('Genre')

// Routes
const listNovelsRoute = createRoute({
	method: 'get',
	path: '/novels',
	tags: ['Novels'],
	summary: 'List all novels',
	request: {
		query: z.object({
			page: z.string().optional().openapi({ example: '1' })
		})
	},
	responses: {
		200: {
			description: 'List of novels',
			content: {
				'application/json': {
					schema: z.object({
						novels: z.array(NovelSchema),
						hasNext: z.boolean()
					})
				}
			}
		}
	}
})

const latestNovelsRoute = createRoute({
	method: 'get',
	path: '/novels/latest',
	tags: ['Novels'],
	summary: 'Get latest updated novels',
	responses: {
		200: {
			description: 'Latest novels',
			content: {
				'application/json': {
					schema: z.object({
						novels: z.array(NovelSchema)
					})
				}
			}
		}
	}
})

const searchNovelsRoute = createRoute({
	method: 'get',
	path: '/novels/search',
	tags: ['Novels'],
	summary: 'Search novels',
	request: {
		query: z.object({
			q: z.string().openapi({ example: 'maou' })
		})
	},
	responses: {
		200: {
			description: 'Search results',
			content: {
				'application/json': {
					schema: z.object({
						novels: z.array(NovelSchema)
					})
				}
			}
		},
		400: {
			description: 'Bad request',
			content: {
				'application/json': {
					schema: ErrorSchema
				}
			}
		}
	}
})

const novelDetailRoute = createRoute({
	method: 'get',
	path: '/novels/{slug}',
	tags: ['Novels'],
	summary: 'Get novel detail',
	request: {
		params: z.object({
			slug: z.string().openapi({ example: 'maou-gakuin-no-futekigousha' })
		})
	},
	responses: {
		200: {
			description: 'Novel detail',
			content: {
				'application/json': {
					schema: NovelDetailSchema
				}
			}
		},
		404: {
			description: 'Novel not found',
			content: {
				'application/json': {
					schema: ErrorSchema
				}
			}
		}
	}
})

const chapterListRoute = createRoute({
	method: 'get',
	path: '/novels/{slug}/chapters',
	tags: ['Chapters'],
	summary: 'Get chapter list',
	request: {
		params: z.object({
			slug: z.string().openapi({ example: 'maou-gakuin-no-futekigousha' })
		})
	},
	responses: {
		200: {
			description: 'Chapter list',
			content: {
				'application/json': {
					schema: z.object({
						chapters: z.array(ChapterSchema)
					})
				}
			}
		}
	}
})

const chapterContentRoute = createRoute({
	method: 'get',
	path: '/novels/{slug}/{chapter}',
	tags: ['Chapters'],
	summary: 'Read chapter content',
	request: {
		params: z.object({
			slug: z.string().openapi({ example: 'maou-gakuin-no-futekigousha' }),
			chapter: z.string().openapi({ example: 'volume-1-chapter-1' })
		})
	},
	responses: {
		200: {
			description: 'Chapter content',
			content: {
				'application/json': {
					schema: ChapterContentSchema
				}
			}
		},
		404: {
			description: 'Chapter not found',
			content: {
				'application/json': {
					schema: ErrorSchema
				}
			}
		}
	}
})

const listGenresRoute = createRoute({
	method: 'get',
	path: '/genres',
	tags: ['Genres'],
	summary: 'List all genres',
	responses: {
		200: {
			description: 'List of genres',
			content: {
				'application/json': {
					schema: z.object({
						genres: z.array(GenreSchema)
					})
				}
			}
		}
	}
})

const novelsByGenreRoute = createRoute({
	method: 'get',
	path: '/genres/{genre}',
	tags: ['Genres'],
	summary: 'Get novels by genre',
	request: {
		params: z.object({
			genre: z.string().openapi({ example: 'action' })
		}),
		query: z.object({
			page: z.string().optional().openapi({ example: '1' })
		})
	},
	responses: {
		200: {
			description: 'Novels in genre',
			content: {
				'application/json': {
					schema: z.object({
						novels: z.array(NovelSchema),
						hasNext: z.boolean()
					})
				}
			}
		}
	}
})

// Handlers
app.openapi(listNovelsRoute, async (c) => {
	const { page } = c.req.valid('query')
	const result = await getNovelList(parseInt(page || '1'))
	return c.json(result)
})

app.openapi(latestNovelsRoute, async (c) => {
	const novels = await getLatestUpdates()
	return c.json({ novels })
})

app.openapi(searchNovelsRoute, async (c) => {
	const { q } = c.req.valid('query')
	if (!q) {
		return c.json({ error: 'Query parameter "q" is required' }, 400)
	}
	const novels = await searchNovels(q)
	return c.json({ novels })
})

app.openapi(novelDetailRoute, async (c) => {
	const { slug } = c.req.valid('param')
	const novel = await getNovelDetail(slug)
	if (!novel) {
		return c.json({ error: 'Novel not found' }, 404)
	}
	return c.json(novel)
})

app.openapi(chapterListRoute, async (c) => {
	const { slug } = c.req.valid('param')
	const chapters = await getChapterList(slug)
	return c.json({ chapters })
})

app.openapi(chapterContentRoute, async (c) => {
	const { slug, chapter } = c.req.valid('param')
	const content = await getChapterContent(slug, chapter)
	if (!content) {
		return c.json({ error: 'Chapter not found' }, 404)
	}
	return c.json(content)
})

app.openapi(listGenresRoute, async (c) => {
	const genres = await getGenres()
	return c.json({ genres })
})

app.openapi(novelsByGenreRoute, async (c) => {
	const { genre } = c.req.valid('param')
	const { page } = c.req.valid('query')
	const result = await getNovelsByGenre(genre, parseInt(page || '1'))
	return c.json(result)
})

// Redirect to docs
app.get('/', (c) => {
	return c.redirect('/docs')
})

// Swagger UI
app.get('/docs', swaggerUI({ url: '/openapi.json' }))

// OpenAPI spec
app.doc('/openapi.json', {
	openapi: '3.0.0',
	info: {
		title: 'Meio Novels API',
		description: 'Unofficial API for accessing novel content from <a href="https://meionovels.com">meionovels.com</a>'
	},
	tags: [
		{ name: 'Novels', description: 'Browse and search novels' },
		{ name: 'Genres', description: 'Browse novels by genre' },
		{ name: 'Chapters', description: 'Read novel chapters' }
	]
})

export default app
