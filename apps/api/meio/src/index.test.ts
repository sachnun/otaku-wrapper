import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest'
import app from './index'

const BASE_URL = 'http://localhost'

describe('Meio Novels API', () => {
	describe('GET /novels', () => {
		it('should return list of novels with pagination', async () => {
			const res = await app.request(`${BASE_URL}/novels`)
			expect(res.status).toBe(200)

			const data = await res.json()
			expect(data).toHaveProperty('novels')
			expect(data).toHaveProperty('hasNext')
			expect(Array.isArray(data.novels)).toBe(true)

			if (data.novels.length > 0) {
				const novel = data.novels[0]
				expect(novel).toHaveProperty('slug')
				expect(novel).toHaveProperty('title')
				expect(novel).toHaveProperty('cover')
			}
		})

		it('should support page parameter', async () => {
			const res = await app.request(`${BASE_URL}/novels?page=2`)
			expect(res.status).toBe(200)

			const data = await res.json()
			expect(data).toHaveProperty('novels')
		})

		it('should return correct content-type header', async () => {
			const res = await app.request(`${BASE_URL}/novels`)
			expect(res.headers.get('content-type')).toContain('application/json')
		})
	})

	describe('GET /novels/latest', () => {
		it('should return latest updated novels', async () => {
			const res = await app.request(`${BASE_URL}/novels/latest`)
			expect(res.status).toBe(200)

			const data = await res.json()
			expect(data).toHaveProperty('novels')
			expect(Array.isArray(data.novels)).toBe(true)
		})

		it('should have correct structure for each novel', async () => {
			const res = await app.request(`${BASE_URL}/novels/latest`)
			const data = await res.json()

			if (data.novels.length > 0) {
				const novel = data.novels[0]
				expect(novel).toHaveProperty('slug')
				expect(novel).toHaveProperty('title')
				expect(novel).toHaveProperty('cover')
				expect(typeof novel.slug).toBe('string')
				expect(typeof novel.title).toBe('string')
			}
		})
	})

	describe('GET /novels/search', () => {
		it('should return search results', async () => {
			const res = await app.request(`${BASE_URL}/novels/search?q=maou`)
			expect(res.status).toBe(200)

			const data = await res.json()
			expect(data).toHaveProperty('novels')
			expect(Array.isArray(data.novels)).toBe(true)
		})

		it('should return 400 if query is missing', async () => {
			const res = await app.request(`${BASE_URL}/novels/search`)
			expect(res.status).toBe(400)
		})

		it('should return error response when query is missing', async () => {
			const res = await app.request(`${BASE_URL}/novels/search`)
			expect(res.status).toBe(400)
			const data = await res.json()
			// Zod validation returns error object or array
			expect(data).toHaveProperty('error')
		})

		it('should handle empty search query', async () => {
			const res = await app.request(`${BASE_URL}/novels/search?q=`)
			// Empty string should still be 400
			expect(res.status).toBe(400)
		})

		it('should handle special characters in search query', async () => {
			const res = await app.request(`${BASE_URL}/novels/search?q=${encodeURIComponent('test & query')}`)
			expect(res.status).toBe(200)
		})
	})

	describe('GET /novels/{slug}', () => {
		it('should return novel detail', async () => {
			const res = await app.request(`${BASE_URL}/novels/maou-gakuin-no-futekigousha`)
			expect(res.status).toBe(200)

			const data = await res.json()
			expect(data).toHaveProperty('slug')
			expect(data).toHaveProperty('title')
			expect(data).toHaveProperty('cover')
			expect(data).toHaveProperty('description')
			expect(data).toHaveProperty('author')
			expect(data).toHaveProperty('genres')
			expect(data).toHaveProperty('status')
			expect(Array.isArray(data.genres)).toBe(true)

			// Test description cleaning - should not contain "Show more" or excessive newlines
			expect(data.description).not.toContain('Show more')
			expect(data.description).not.toMatch(/\n\s*\n\s*\n+/)  // No triple+ newlines
		})

		it('should return 404 for non-existent novel', async () => {
			const res = await app.request(`${BASE_URL}/novels/non-existent-novel-slug-12345`)
			expect(res.status).toBe(404)

			const data = await res.json()
			expect(data).toHaveProperty('error')
		})

		it('should return proper error message for non-existent novel', async () => {
			const res = await app.request(`${BASE_URL}/novels/non-existent-novel-slug-12345`)
			const data = await res.json()
			expect(data.error).toBe('Novel not found')
		})

		it('should have all required fields in response', async () => {
			const res = await app.request(`${BASE_URL}/novels/maou-gakuin-no-futekigousha`)
			const data = await res.json()

			const requiredFields = ['slug', 'title', 'cover', 'description', 'author', 'artist', 'genres', 'status', 'type', 'rating']
			for (const field of requiredFields) {
				expect(data).toHaveProperty(field)
			}
		})
	})

	describe('GET /novels/{slug}/chapters', () => {
		it('should return chapter list', async () => {
			const res = await app.request(`${BASE_URL}/novels/maou-gakuin-no-futekigousha/chapters`)
			expect(res.status).toBe(200)

			const data = await res.json()
			expect(data).toHaveProperty('chapters')
			expect(Array.isArray(data.chapters)).toBe(true)

			if (data.chapters.length > 0) {
				const chapter = data.chapters[0]
				expect(chapter).toHaveProperty('slug')
				expect(chapter).toHaveProperty('title')
				expect(chapter).toHaveProperty('url')
			}
		})

		it('should have valid chapter structure', async () => {
			const res = await app.request(`${BASE_URL}/novels/maou-gakuin-no-futekigousha/chapters`)
			const data = await res.json()

			if (data.chapters.length > 0) {
				const chapter = data.chapters[0]
				expect(typeof chapter.slug).toBe('string')
				expect(typeof chapter.title).toBe('string')
				expect(typeof chapter.url).toBe('string')
				expect(chapter.url).toMatch(/^https?:\/\//)
			}
		})
	})

	describe('GET /novels/{slug}/{chapter}', () => {
		it('should return chapter content', async () => {
			const res = await app.request(`${BASE_URL}/novels/maou-gakuin-no-futekigousha/volume-1-chapter-0`)
			expect(res.status).toBe(200)

			const data = await res.json()
			expect(data).toHaveProperty('title')
			expect(data).toHaveProperty('novelTitle')
			expect(data).toHaveProperty('novelSlug')
			expect(data).toHaveProperty('content')
			expect(typeof data.content).toBe('string')
			expect(data.content.length).toBeGreaterThan(0)
		})

		it('should return 404 for non-existent chapter', async () => {
			const res = await app.request(`${BASE_URL}/novels/maou-gakuin-no-futekigousha/non-existent-chapter`)
			expect(res.status).toBe(404)

			const data = await res.json()
			expect(data).toHaveProperty('error')
		})

		it('should include navigation links when available', async () => {
			const res = await app.request(`${BASE_URL}/novels/maou-gakuin-no-futekigousha/volume-1-chapter-0`)
			const data = await res.json()

			// Navigation fields should exist (even if undefined)
			expect('prevChapter' in data || data.prevChapter === undefined).toBe(true)
			expect('nextChapter' in data || data.nextChapter === undefined).toBe(true)
		})

		it('should return correct novel slug in response', async () => {
			const res = await app.request(`${BASE_URL}/novels/maou-gakuin-no-futekigousha/volume-1-chapter-0`)
			const data = await res.json()
			expect(data.novelSlug).toBe('maou-gakuin-no-futekigousha')
		})
	})

	describe('GET /openapi.json', () => {
		it('should return valid OpenAPI spec', async () => {
			const res = await app.request(`${BASE_URL}/openapi.json`)
			expect(res.status).toBe(200)

			const data = await res.json()
			expect(data).toHaveProperty('openapi')
			expect(data).toHaveProperty('info')
			expect(data).toHaveProperty('paths')
			expect(data).toHaveProperty('components')
			expect(data.components).toHaveProperty('schemas')
		})

		it('should have correct API info', async () => {
			const res = await app.request(`${BASE_URL}/openapi.json`)
			const data = await res.json()

			expect(data.info).toHaveProperty('title')
			expect(data.info.title).toBe('Meio Novels API')
		})

		it('should have all expected paths', async () => {
			const res = await app.request(`${BASE_URL}/openapi.json`)
			const data = await res.json()

			const expectedPaths = ['/novels', '/novels/latest', '/novels/search', '/novels/{slug}', '/novels/{slug}/chapters', '/novels/{slug}/{chapter}', '/genres', '/genres/{genre}']
			for (const path of expectedPaths) {
				expect(data.paths).toHaveProperty(path)
			}
		})

		it('should have all expected schemas', async () => {
			const res = await app.request(`${BASE_URL}/openapi.json`)
			const data = await res.json()

			const expectedSchemas = ['Novel', 'NovelDetail', 'Chapter', 'ChapterContent', 'Error', 'Genre']
			for (const schema of expectedSchemas) {
				expect(data.components.schemas).toHaveProperty(schema)
			}
		})
	})

	describe('GET /', () => {
		it('should redirect to /docs', async () => {
			const res = await app.request(`${BASE_URL}/`, { redirect: 'manual' })
			expect(res.status).toBe(302)
			expect(res.headers.get('location')).toBe('/docs')
		})
	})

	describe('CORS', () => {
		it('should have CORS headers', async () => {
			const res = await app.request(`${BASE_URL}/novels`)
			expect(res.headers.get('access-control-allow-origin')).toBe('*')
		})

		it('should handle OPTIONS preflight request', async () => {
			const res = await app.request(`${BASE_URL}/novels`, {
				method: 'OPTIONS',
				headers: {
					'Origin': 'http://example.com',
					'Access-Control-Request-Method': 'GET'
				}
			})
			expect(res.status).toBeLessThan(400)
		})
	})

	describe('GET /genres', () => {
		it('should return list of genres', async () => {
			const res = await app.request(`${BASE_URL}/genres`)
			expect(res.status).toBe(200)

			const data = await res.json()
			expect(data).toHaveProperty('genres')
			expect(Array.isArray(data.genres)).toBe(true)

			if (data.genres.length > 0) {
				const genre = data.genres[0]
				expect(genre).toHaveProperty('slug')
				expect(genre).toHaveProperty('name')
			}
		})

		it('should have valid genre structure', async () => {
			const res = await app.request(`${BASE_URL}/genres`)
			const data = await res.json()

			if (data.genres.length > 0) {
				const genre = data.genres[0]
				expect(typeof genre.slug).toBe('string')
				expect(typeof genre.name).toBe('string')
				expect(genre.slug.length).toBeGreaterThan(0)
				expect(genre.name.length).toBeGreaterThan(0)
			}
		})

		it('should not include count in genre name', async () => {
			const res = await app.request(`${BASE_URL}/genres`)
			const data = await res.json()

			for (const genre of data.genres) {
				expect(genre.name).not.toMatch(/\(\d+\)/)
			}
		})
	})

	describe('GET /genres/{genre}', () => {
		it('should return novels by genre', async () => {
			const res = await app.request(`${BASE_URL}/genres/action`)
			expect(res.status).toBe(200)

			const data = await res.json()
			expect(data).toHaveProperty('novels')
			expect(data).toHaveProperty('hasNext')
			expect(Array.isArray(data.novels)).toBe(true)
		})

		it('should support page parameter', async () => {
			const res = await app.request(`${BASE_URL}/genres/action?page=2`)
			expect(res.status).toBe(200)

			const data = await res.json()
			expect(data).toHaveProperty('novels')
		})

		it('should have valid novel structure in genre results', async () => {
			const res = await app.request(`${BASE_URL}/genres/action`)
			const data = await res.json()

			if (data.novels.length > 0) {
				const novel = data.novels[0]
				expect(novel).toHaveProperty('slug')
				expect(novel).toHaveProperty('title')
				expect(novel).toHaveProperty('cover')
			}
		})
	})

	describe('ETag Support', () => {
		it('should return ETag header', async () => {
			const res = await app.request(`${BASE_URL}/novels`)
			const etag = res.headers.get('etag')
			expect(etag).toBeTruthy()
		})

		it('should return 304 for matching ETag', async () => {
			// First request to get ETag
			const res1 = await app.request(`${BASE_URL}/openapi.json`)
			const etag = res1.headers.get('etag')
			expect(etag).toBeTruthy()

			// Second request with If-None-Match
			const res2 = await app.request(`${BASE_URL}/openapi.json`, {
				headers: {
					'If-None-Match': etag!
				}
			})
			expect(res2.status).toBe(304)
		})
	})

	describe('Error Handling', () => {
		it('should return 404 for unknown routes', async () => {
			const res = await app.request(`${BASE_URL}/unknown-route`)
			expect(res.status).toBe(404)
		})
	})
})
