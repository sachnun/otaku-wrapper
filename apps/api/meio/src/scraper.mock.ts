import type { Novel, NovelDetail, Chapter, ChapterContent, Genre } from './scraper'

// Mock data for testing
export const mockNovels: Novel[] = [
	{
		slug: 'test-novel-1',
		title: 'Test Novel One',
		cover: 'https://example.com/cover1.jpg',
		latestChapter: 'Chapter 10',
		latestChapterUrl: 'https://meionovels.com/novel/test-novel-1/chapter-10/'
	},
	{
		slug: 'test-novel-2',
		title: 'Test Novel Two',
		cover: 'https://example.com/cover2.jpg',
		latestChapter: 'Chapter 5',
		latestChapterUrl: 'https://meionovels.com/novel/test-novel-2/chapter-5/'
	}
]

export const mockNovelDetail: NovelDetail = {
	slug: 'test-novel-1',
	title: 'Test Novel One',
	cover: 'https://example.com/cover1.jpg',
	description: 'This is a test novel description for unit testing purposes.',
	author: 'Test Author',
	artist: 'Test Artist',
	genres: ['Action', 'Adventure', 'Fantasy'],
	status: 'Ongoing',
	type: 'Light Novel',
	rating: '4.5'
}

export const mockChapters: Chapter[] = [
	{
		slug: 'chapter-1',
		title: 'Chapter 1: The Beginning',
		url: 'https://meionovels.com/novel/test-novel-1/chapter-1/',
		date: 'January 1, 2024'
	},
	{
		slug: 'chapter-2',
		title: 'Chapter 2: The Journey',
		url: 'https://meionovels.com/novel/test-novel-1/chapter-2/',
		date: 'January 2, 2024'
	},
	{
		slug: 'chapter-3',
		title: 'Chapter 3: The Adventure',
		url: 'https://meionovels.com/novel/test-novel-1/chapter-3/',
		date: 'January 3, 2024'
	}
]

export const mockChapterContent: ChapterContent = {
	title: 'Chapter 1: The Beginning',
	novelTitle: 'Test Novel One',
	novelSlug: 'test-novel-1',
	content: 'This is the content of chapter 1.\n\nIt has multiple paragraphs.\n\nAnd tells a story.',
	prevChapter: undefined,
	nextChapter: 'chapter-2'
}

export const mockGenres: Genre[] = [
	{ slug: 'action', name: 'Action' },
	{ slug: 'adventure', name: 'Adventure' },
	{ slug: 'fantasy', name: 'Fantasy' },
	{ slug: 'romance', name: 'Romance' },
	{ slug: 'comedy', name: 'Comedy' }
]

// Mock functions
export async function getNovelList(page = 1): Promise<{ novels: Novel[]; hasNext: boolean }> {
	return { novels: mockNovels, hasNext: page < 3 }
}

export async function getNovelDetail(slug: string): Promise<NovelDetail | null> {
	if (slug === 'non-existent-novel-slug-12345') return null
	return { ...mockNovelDetail, slug }
}

export async function getChapterList(slug: string): Promise<Chapter[]> {
	return mockChapters
}

export async function getChapterContent(novelSlug: string, chapterSlug: string): Promise<ChapterContent | null> {
	if (chapterSlug === 'non-existent-chapter') return null
	return {
		...mockChapterContent,
		novelSlug,
		title: chapterSlug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
	}
}

export async function searchNovels(query: string): Promise<Novel[]> {
	return mockNovels.filter(n => n.title.toLowerCase().includes(query.toLowerCase()))
}

export async function getLatestUpdates(): Promise<Novel[]> {
	return mockNovels
}

export async function getGenres(): Promise<Genre[]> {
	return mockGenres
}

export async function getNovelsByGenre(genre: string, page = 1): Promise<{ novels: Novel[]; hasNext: boolean }> {
	return { novels: mockNovels, hasNext: page < 2 }
}
