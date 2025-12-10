import { fetchHtml, fetchText, getCache, setCache, CACHE_TTL, cheerio } from '@otaku-wraper/core'

const BASE_URL = 'https://meionovels.com'

const TTL = {
	novelList: CACHE_TTL.SHORT,
	novelDetail: CACHE_TTL.MEDIUM,
	chapterList: CACHE_TTL.MEDIUM,
	chapterContent: CACHE_TTL.LONG,
	search: CACHE_TTL.SHORT,
	latest: 2 * 60 * 1000,
	genres: CACHE_TTL.LONG
}

function cleanDescription(description: string): string {
	if (!description) return description
	
	let cleaned = description
		.replace(/\s*Show more\s*$/i, '')
		.replace(/\s*Show less\s*$/i, '')
		.replace(/\s*Read more\s*$/i, '')
		.replace(/\s*Read less\s*$/i, '')
		.replace(/\s*\.\.\.\s*$/i, '')
	
	cleaned = cleaned
		.replace(/\n\s*\n\s*\n+/g, '\n\n')
		.replace(/[ \t]+/g, ' ')
		.replace(/^\s+|\s+$/g, '')
		.replace(/\n[ \t]+/g, '\n')
		.replace(/[ \t]+\n/g, '\n')
	
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

export interface Genre {
	slug: string
	name: string
}

export async function getNovelList(page = 1): Promise<{ novels: Novel[]; hasNext: boolean }> {
	const cacheKey = `novelList:${page}`
	const cached = getCache<{ novels: Novel[]; hasNext: boolean }>(cacheKey)
	if (cached) return cached

	const url = page > 1 ? `${BASE_URL}/novel/page/${page}/` : `${BASE_URL}/novel/`
	const $ = await fetchHtml(url)

	const novels: Novel[] = []
	$('.page-item-detail').each((_, el) => {
		const $el = $(el)
		const titleEl = $el.find('.post-title a')
		const imgEl = $el.find('.item-thumb img')
		const chapterEl = $el.find('.chapter a')

		if (titleEl.length) {
			const href = titleEl.attr('href') || ''
			const slug = href.replace(`${BASE_URL}/novel/`, '').replace(/\/$/, '')

			novels.push({
				slug,
				title: titleEl.text().trim(),
				cover: imgEl.attr('data-src') || imgEl.attr('src') || '',
				latestChapter: chapterEl.text().trim() || undefined,
				latestChapterUrl: chapterEl.attr('href') || undefined
			})
		}
	})

	const nextPage = $('.nav-previous a')
	const hasNext = nextPage.length > 0

	const result = { novels, hasNext }
	setCache(cacheKey, result, TTL.novelList)
	return result
}

export async function getNovelDetail(slug: string): Promise<NovelDetail | null> {
	const cacheKey = `novelDetail:${slug}`
	const cached = getCache<NovelDetail>(cacheKey)
	if (cached) return cached

	const url = `${BASE_URL}/novel/${slug}/`
	const $ = await fetchHtml(url)

	const titleEl = $('.post-title h1')
	if (!titleEl.length) return null

	const imgEl = $('.summary_image img')
	const descEl = $('.summary__content, .description-summary')
	const authorEl = $('.author-content a')
	const artistEl = $('.artist-content a')
	const ratingEl = $('.post-total-rating .score')

	const genres: string[] = []
	$('.genres-content a').each((_, el) => {
		genres.push($(el).text().trim())
	})

	let status = ''
	$('.post-status .post-content_item').each((_, el) => {
		const $el = $(el)
		const heading = $el.find('.summary-heading').text().trim().toLowerCase()
		if (heading.includes('status')) {
			status = $el.find('.summary-content').text().trim()
		}
	})

	let type = ''
	$('.post-content_item').each((_, el) => {
		const $el = $(el)
		const heading = $el.find('.summary-heading').text().trim().toLowerCase()
		if (heading.includes('type')) {
			type = $el.find('.summary-content').text().trim()
		}
	})

	const result: NovelDetail = {
		slug,
		title: titleEl.text().trim(),
		cover: imgEl.attr('data-src') || imgEl.attr('src') || '',
		description: cleanDescription(descEl.text().trim()),
		author: authorEl.text().trim(),
		artist: artistEl.text().trim(),
		genres,
		status,
		type,
		rating: ratingEl.text().trim()
	}

	setCache(cacheKey, result, TTL.novelDetail)
	return result
}

export async function getChapterList(slug: string): Promise<Chapter[]> {
	const cacheKey = `chapterList:${slug}`
	const cached = getCache<Chapter[]>(cacheKey)
	if (cached) return cached

	const url = `${BASE_URL}/novel/${slug}/ajax/chapters/`
	const html = await fetchText(url, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
	const $ = cheerio.load(html)

	const chapters: Chapter[] = []
	$('.wp-manga-chapter').each((_, el) => {
		const $el = $(el)
		const linkEl = $el.find('a')
		const dateEl = $el.find('.chapter-release-date')

		if (linkEl.length) {
			const href = linkEl.attr('href') || ''
			const chapterSlug = href.replace(`${BASE_URL}/novel/${slug}/`, '').replace(/\/$/, '')

			chapters.push({
				slug: chapterSlug,
				title: linkEl.text().trim(),
				url: href,
				date: dateEl.text().trim() || undefined
			})
		}
	})

	setCache(cacheKey, chapters, TTL.chapterList)
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
	const $ = await fetchHtml(url)

	const titleEl = $('.breadcrumb li.active')
	const novelTitleEl = $('.breadcrumb li:nth-child(3) a')
	const contentEl = $('.reading-content .text-left, .reading-content')

	if (!contentEl.length) return null

	contentEl.find('script, .ads, .adsbygoogle, ins, style, noscript').remove()

	const paragraphs: string[] = []
	const pElements = contentEl.find('p')

	if (pElements.length > 0) {
		pElements.each((_, el) => {
			const text = $(el).text().trim()
			if (text) {
				paragraphs.push(text)
			}
		})
	} else {
		const text = contentEl.text().trim()
		paragraphs.push(...text.split(/\n+/).filter((p) => p.trim()))
	}

	const cleanContent = paragraphs.join('\n\n')

	const prevEl = $('.prev_page, .nav-previous a')
	const nextEl = $('.next_page, .nav-next a')

	let prevChapter: string | undefined
	let nextChapter: string | undefined

	if (prevEl.length) {
		const prevHref = prevEl.attr('href') || ''
		prevChapter = prevHref.replace(`${BASE_URL}/novel/${novelSlug}/`, '').replace(/\/$/, '') || undefined
	}

	if (nextEl.length) {
		const nextHref = nextEl.attr('href') || ''
		nextChapter = nextHref.replace(`${BASE_URL}/novel/${novelSlug}/`, '').replace(/\/$/, '') || undefined
	}

	const result: ChapterContent = {
		title: titleEl.text().trim() || chapterSlug,
		novelTitle: novelTitleEl.text().trim(),
		novelSlug,
		content: cleanContent,
		prevChapter,
		nextChapter
	}

	setCache(cacheKey, result, TTL.chapterContent)
	return result
}

export async function searchNovels(query: string): Promise<Novel[]> {
	const cacheKey = `search:${query.toLowerCase()}`
	const cached = getCache<Novel[]>(cacheKey)
	if (cached) return cached

	const url = `${BASE_URL}/?s=${encodeURIComponent(query)}&post_type=wp-manga`
	const $ = await fetchHtml(url)

	const novels: Novel[] = []
	$('.c-tabs-item__content, .row.c-tabs-item').each((_, el) => {
		const $el = $(el)
		const titleEl = $el.find('.post-title a, h3 a')
		const imgEl = $el.find('.tab-thumb img, img')

		if (titleEl.length) {
			const href = titleEl.attr('href') || ''
			const slug = href.replace(`${BASE_URL}/novel/`, '').replace(/\/$/, '')

			novels.push({
				slug,
				title: titleEl.text().trim(),
				cover: imgEl.attr('data-src') || imgEl.attr('src') || ''
			})
		}
	})

	setCache(cacheKey, novels, TTL.search)
	return novels
}

export async function getLatestUpdates(): Promise<Novel[]> {
	const cacheKey = 'latestUpdates'
	const cached = getCache<Novel[]>(cacheKey)
	if (cached) return cached

	const $ = await fetchHtml(BASE_URL)

	const novels: Novel[] = []
	$('.page-item-detail').each((_, el) => {
		const $el = $(el)
		const titleEl = $el.find('.post-title a')
		const imgEl = $el.find('.item-thumb img')
		const chapterEl = $el.find('.chapter a')

		if (titleEl.length) {
			const href = titleEl.attr('href') || ''
			const slug = href.replace(`${BASE_URL}/novel/`, '').replace(/\/$/, '')

			novels.push({
				slug,
				title: titleEl.text().trim(),
				cover: imgEl.attr('data-src') || imgEl.attr('src') || '',
				latestChapter: chapterEl.text().trim() || undefined,
				latestChapterUrl: chapterEl.attr('href') || undefined
			})
		}
	})

	setCache(cacheKey, novels, TTL.latest)
	return novels
}

export async function getGenres(): Promise<Genre[]> {
	const cacheKey = 'genres'
	const cached = getCache<Genre[]>(cacheKey)
	if (cached) return cached

	const url = `${BASE_URL}/novel/`
	const $ = await fetchHtml(url)

	const genres: Genre[] = []
	$('.genres a[href*="novel-genre"]').each((_, el) => {
		const $el = $(el)
		const href = $el.attr('href') || ''
		const slug = href.replace(`${BASE_URL}/novel-genre/`, '').replace(/\/$/, '')
		const rawName = $el.text().trim()
		const name = rawName.replace(/\s*\(\d+\)\s*$/, '').replace(/\s+/g, ' ').trim()

		if (slug && name) {
			genres.push({ slug, name })
		}
	})

	setCache(cacheKey, genres, TTL.genres)
	return genres
}

export async function getNovelsByGenre(genre: string, page = 1): Promise<{ novels: Novel[]; hasNext: boolean }> {
	const cacheKey = `genre:${genre}:${page}`
	const cached = getCache<{ novels: Novel[]; hasNext: boolean }>(cacheKey)
	if (cached) return cached

	const url = page > 1
		? `${BASE_URL}/novel-genre/${genre}/page/${page}/`
		: `${BASE_URL}/novel-genre/${genre}/`
	const $ = await fetchHtml(url)

	const novels: Novel[] = []
	$('.page-item-detail').each((_, el) => {
		const $el = $(el)
		const titleEl = $el.find('.post-title a')
		const imgEl = $el.find('.item-thumb img')
		const chapterEl = $el.find('.chapter a')

		if (titleEl.length) {
			const href = titleEl.attr('href') || ''
			const slug = href.replace(`${BASE_URL}/novel/`, '').replace(/\/$/, '')

			novels.push({
				slug,
				title: titleEl.text().trim(),
				cover: imgEl.attr('data-src') || imgEl.attr('src') || '',
				latestChapter: chapterEl.text().trim() || undefined,
				latestChapterUrl: chapterEl.attr('href') || undefined
			})
		}
	})

	const nextPage = $('.nav-previous a')
	const hasNext = nextPage.length > 0

	const result = { novels, hasNext }
	setCache(cacheKey, result, TTL.novelList)
	return result
}
