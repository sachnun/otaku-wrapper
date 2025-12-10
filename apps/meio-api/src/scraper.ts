import { parse, HTMLElement } from 'node-html-parser'

const BASE_URL = 'https://meionovels.com'

// In-memory cache
interface CacheEntry<T> {
	data: T
	expiry: number
}

const cache = new Map<string, CacheEntry<any>>()

// Cache TTL in milliseconds
const CACHE_TTL = {
	novelList: 5 * 60 * 1000,      // 5 minutes
	novelDetail: 30 * 60 * 1000,   // 30 minutes
	chapterList: 10 * 60 * 1000,   // 10 minutes
	chapterContent: 60 * 60 * 1000, // 1 hour
	search: 5 * 60 * 1000,         // 5 minutes
	latest: 2 * 60 * 1000,         // 2 minutes
	genres: 60 * 60 * 1000         // 1 hour
}

function getCache<T>(key: string): T | null {
	const entry = cache.get(key)
	if (!entry) return null
	if (Date.now() > entry.expiry) {
		cache.delete(key)
		return null
	}
	return entry.data as T
}

function setCache<T>(key: string, data: T, ttl: number): void {
	cache.set(key, { data, expiry: Date.now() + ttl })
}

function cleanDescription(description: string): string {
	if (!description) return description
	
	// Remove "Show more" text and similar UI elements
	let cleaned = description
		.replace(/\s*Show more\s*$/i, '')
		.replace(/\s*Show less\s*$/i, '')
		.replace(/\s*Read more\s*$/i, '')
		.replace(/\s*Read less\s*$/i, '')
		.replace(/\s*\.\.\.\s*$/i, '')
	
	// Clean up excessive whitespace and newlines
	cleaned = cleaned
		.replace(/\n\s*\n\s*\n+/g, '\n\n')  // Multiple consecutive newlines to double newline
		.replace(/[ \t]+/g, ' ')            // Multiple spaces/tabs to single space
		.replace(/^\s+|\s+$/g, '')          // Trim start and end
		.replace(/\n[ \t]+/g, '\n')         // Spaces after newlines
		.replace(/[ \t]+\n/g, '\n')         // Spaces before newlines
	
	return cleaned
}

export interface Novel {
	slug: string
	title: string
	cover: string
	latestChapter?: string
	latestChapterUrl?: string
}

export interface NovelDetail {
	slug: string
	title: string
	cover: string
	description: string
	author: string
	artist: string
	genres: string[]
	status: string
	type: string
	rating: string
}

export interface Chapter {
	slug: string
	title: string
	url: string
	date?: string
}

export interface ChapterContent {
	title: string
	novelTitle: string
	novelSlug: string
	content: string
	prevChapter?: string
	nextChapter?: string
}

async function fetchHtml(url: string): Promise<HTMLElement> {
	const res = await fetch(url, {
		headers: {
			'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
		}
	})
	const html = await res.text()
	return parse(html)
}

export async function getNovelList(page = 1): Promise<{ novels: Novel[]; hasNext: boolean }> {
	const cacheKey = `novelList:${page}`
	const cached = getCache<{ novels: Novel[]; hasNext: boolean }>(cacheKey)
	if (cached) return cached

	const url = page > 1 ? `${BASE_URL}/novel/page/${page}/` : `${BASE_URL}/novel/`
	const doc = await fetchHtml(url)

	const novels: Novel[] = []
	const items = doc.querySelectorAll('.page-item-detail')

	for (const item of items) {
		const titleEl = item.querySelector('.post-title a')
		const imgEl = item.querySelector('.item-thumb img')
		const chapterEl = item.querySelector('.chapter a')

		if (titleEl) {
			const href = titleEl.getAttribute('href') || ''
			const slug = href.replace(`${BASE_URL}/novel/`, '').replace(/\/$/, '')

			novels.push({
				slug,
				title: titleEl.text.trim(),
				cover: imgEl?.getAttribute('data-src') || imgEl?.getAttribute('src') || '',
				latestChapter: chapterEl?.text.trim(),
				latestChapterUrl: chapterEl?.getAttribute('href')
			})
		}
	}

	const nextPage = doc.querySelector('.nav-previous a')
	const hasNext = !!nextPage

	const result = { novels, hasNext }
	setCache(cacheKey, result, CACHE_TTL.novelList)
	return result
}

export async function getNovelDetail(slug: string): Promise<NovelDetail | null> {
	const cacheKey = `novelDetail:${slug}`
	const cached = getCache<NovelDetail>(cacheKey)
	if (cached) return cached

	const url = `${BASE_URL}/novel/${slug}/`
	const doc = await fetchHtml(url)

	const titleEl = doc.querySelector('.post-title h1')
	if (!titleEl) return null

	const imgEl = doc.querySelector('.summary_image img')
	const descEl = doc.querySelector('.summary__content, .description-summary')
	const authorEl = doc.querySelector('.author-content a')
	const artistEl = doc.querySelector('.artist-content a')
	const statusEl = doc.querySelector('.post-status .summary-content')
	const typeEl = doc.querySelector('.post-content_item:contains("Type") .summary-content')
	const ratingEl = doc.querySelector('.post-total-rating .score')

	const genres: string[] = []
	doc.querySelectorAll('.genres-content a').forEach((el) => {
		genres.push(el.text.trim())
	})

	// Get status from post-status section
	let status = ''
	const statusItems = doc.querySelectorAll('.post-status .post-content_item')
	for (const item of statusItems) {
		const heading = item.querySelector('.summary-heading')?.text.trim().toLowerCase()
		if (heading?.includes('status')) {
			status = item.querySelector('.summary-content')?.text.trim() || ''
		}
	}

	// Get type
	let type = ''
	const contentItems = doc.querySelectorAll('.post-content_item')
	for (const item of contentItems) {
		const heading = item.querySelector('.summary-heading')?.text.trim().toLowerCase()
		if (heading?.includes('type')) {
			type = item.querySelector('.summary-content')?.text.trim() || ''
		}
	}

	const result = {
		slug,
		title: titleEl.text.trim(),
		cover: imgEl?.getAttribute('data-src') || imgEl?.getAttribute('src') || '',
		description: cleanDescription(descEl?.text.trim() || ''),
		author: authorEl?.text.trim() || '',
		artist: artistEl?.text.trim() || '',
		genres,
		status,
		type,
		rating: ratingEl?.text.trim() || ''
	}

	setCache(cacheKey, result, CACHE_TTL.novelDetail)
	return result
}

export async function getChapterList(slug: string): Promise<Chapter[]> {
	const cacheKey = `chapterList:${slug}`
	const cached = getCache<Chapter[]>(cacheKey)
	if (cached) return cached

	// Chapters are loaded via AJAX POST request
	const url = `${BASE_URL}/novel/${slug}/ajax/chapters/`
	const res = await fetch(url, {
		method: 'POST',
		headers: {
			'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
		}
	})
	const html = await res.text()
	const doc = parse(html)

	const chapters: Chapter[] = []
	const items = doc.querySelectorAll('.wp-manga-chapter')

	for (const item of items) {
		const linkEl = item.querySelector('a')
		const dateEl = item.querySelector('.chapter-release-date')

		if (linkEl) {
			const href = linkEl.getAttribute('href') || ''
			const chapterSlug = href.replace(`${BASE_URL}/novel/${slug}/`, '').replace(/\/$/, '')

			chapters.push({
				slug: chapterSlug,
				title: linkEl.text.trim(),
				url: href,
				date: dateEl?.text.trim()
			})
		}
	}

	setCache(cacheKey, chapters, CACHE_TTL.chapterList)
	return chapters
}

export async function getChapterContent(
	novelSlug: string,
	chapterSlug: string
): Promise<ChapterContent | null> {
	const cacheKey = `chapterContent:${novelSlug}:${chapterSlug}`
	const cached = getCache<ChapterContent>(cacheKey)
	if (cached) return cached

	const url = `${BASE_URL}/novel/${novelSlug}/${chapterSlug}/`
	const doc = await fetchHtml(url)

	const titleEl = doc.querySelector('.breadcrumb li.active')
	const novelTitleEl = doc.querySelector('.breadcrumb li:nth-child(3) a')
	const contentEl = doc.querySelector('.reading-content .text-left, .reading-content')

	if (!contentEl) return null

	// Clean content - remove scripts and ads
	contentEl.querySelectorAll('script, .ads, .adsbygoogle, ins, style, noscript').forEach((el) => el.remove())

	// Extract clean text while preserving paragraph structure
	const paragraphs: string[] = []
	const pElements = contentEl.querySelectorAll('p')

	if (pElements.length > 0) {
		for (const p of pElements) {
			const text = p.text.trim()
			if (text) {
				paragraphs.push(text)
			}
		}
	} else {
		// Fallback: split by br or just get text
		const text = contentEl.text.trim()
		paragraphs.push(...text.split(/\n+/).filter((p) => p.trim()))
	}

	const cleanContent = paragraphs.join('\n\n')

	// Get navigation
	const prevEl = doc.querySelector('.prev_page, .nav-previous a')
	const nextEl = doc.querySelector('.next_page, .nav-next a')

	let prevChapter: string | undefined
	let nextChapter: string | undefined

	if (prevEl) {
		const prevHref = prevEl.getAttribute('href') || ''
		prevChapter = prevHref.replace(`${BASE_URL}/novel/${novelSlug}/`, '').replace(/\/$/, '')
	}

	if (nextEl) {
		const nextHref = nextEl.getAttribute('href') || ''
		nextChapter = nextHref.replace(`${BASE_URL}/novel/${novelSlug}/`, '').replace(/\/$/, '')
	}

	const result = {
		title: titleEl?.text.trim() || chapterSlug,
		novelTitle: novelTitleEl?.text.trim() || '',
		novelSlug,
		content: cleanContent,
		prevChapter,
		nextChapter
	}

	setCache(cacheKey, result, CACHE_TTL.chapterContent)
	return result
}

export async function searchNovels(query: string): Promise<Novel[]> {
	const cacheKey = `search:${query.toLowerCase()}`
	const cached = getCache<Novel[]>(cacheKey)
	if (cached) return cached

	const url = `${BASE_URL}/?s=${encodeURIComponent(query)}&post_type=wp-manga`
	const doc = await fetchHtml(url)

	const novels: Novel[] = []
	const items = doc.querySelectorAll('.c-tabs-item__content, .row.c-tabs-item')

	for (const item of items) {
		const titleEl = item.querySelector('.post-title a, h3 a')
		const imgEl = item.querySelector('.tab-thumb img, img')

		if (titleEl) {
			const href = titleEl.getAttribute('href') || ''
			const slug = href.replace(`${BASE_URL}/novel/`, '').replace(/\/$/, '')

			novels.push({
				slug,
				title: titleEl.text.trim(),
				cover: imgEl?.getAttribute('data-src') || imgEl?.getAttribute('src') || ''
			})
		}
	}

	setCache(cacheKey, novels, CACHE_TTL.search)
	return novels
}

export async function getLatestUpdates(): Promise<Novel[]> {
	const cacheKey = 'latestUpdates'
	const cached = getCache<Novel[]>(cacheKey)
	if (cached) return cached

	const doc = await fetchHtml(BASE_URL)

	const novels: Novel[] = []
	const items = doc.querySelectorAll('.page-item-detail')

	for (const item of items) {
		const titleEl = item.querySelector('.post-title a')
		const imgEl = item.querySelector('.item-thumb img')
		const chapterEl = item.querySelector('.chapter a')

		if (titleEl) {
			const href = titleEl.getAttribute('href') || ''
			const slug = href.replace(`${BASE_URL}/novel/`, '').replace(/\/$/, '')

			novels.push({
				slug,
				title: titleEl.text.trim(),
				cover: imgEl?.getAttribute('data-src') || imgEl?.getAttribute('src') || '',
				latestChapter: chapterEl?.text.trim(),
				latestChapterUrl: chapterEl?.getAttribute('href')
			})
		}
	}

	setCache(cacheKey, novels, CACHE_TTL.latest)
	return novels
}

export interface Genre {
	slug: string
	name: string
}

export async function getGenres(): Promise<Genre[]> {
	const cacheKey = 'genres'
	const cached = getCache<Genre[]>(cacheKey)
	if (cached) return cached

	const url = `${BASE_URL}/novel/`
	const doc = await fetchHtml(url)

	const genres: Genre[] = []
	const links = doc.querySelectorAll('.genres a[href*="novel-genre"]')

	for (const link of links) {
		const href = link.getAttribute('href') || ''
		const slug = href.replace(`${BASE_URL}/novel-genre/`, '').replace(/\/$/, '')
		// Clean name - remove count and extra whitespace
		const rawName = link.text.trim()
		const name = rawName.replace(/\s*\(\d+\)\s*$/, '').replace(/\s+/g, ' ').trim()

		if (slug && name) {
			genres.push({ slug, name })
		}
	}

	setCache(cacheKey, genres, CACHE_TTL.genres)
	return genres
}

export async function getNovelsByGenre(genre: string, page = 1): Promise<{ novels: Novel[]; hasNext: boolean }> {
	const cacheKey = `genre:${genre}:${page}`
	const cached = getCache<{ novels: Novel[]; hasNext: boolean }>(cacheKey)
	if (cached) return cached

	const url = page > 1
		? `${BASE_URL}/novel-genre/${genre}/page/${page}/`
		: `${BASE_URL}/novel-genre/${genre}/`
	const doc = await fetchHtml(url)

	const novels: Novel[] = []
	const items = doc.querySelectorAll('.page-item-detail')

	for (const item of items) {
		const titleEl = item.querySelector('.post-title a')
		const imgEl = item.querySelector('.item-thumb img')
		const chapterEl = item.querySelector('.chapter a')

		if (titleEl) {
			const href = titleEl.getAttribute('href') || ''
			const slug = href.replace(`${BASE_URL}/novel/`, '').replace(/\/$/, '')

			novels.push({
				slug,
				title: titleEl.text.trim(),
				cover: imgEl?.getAttribute('data-src') || imgEl?.getAttribute('src') || '',
				latestChapter: chapterEl?.text.trim(),
				latestChapterUrl: chapterEl?.getAttribute('href')
			})
		}
	}

	const nextPage = doc.querySelector('.nav-previous a')
	const hasNext = !!nextPage

	const result = { novels, hasNext }
	setCache(cacheKey, result, CACHE_TTL.novelList)
	return result
}
