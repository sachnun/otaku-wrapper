import { fetchHtml, cheerio } from "@otaku-wrapper/core";
import type {
  HomeResponse,
  AnimeCard,
  AnimeDetail,
  Genre,
  Season,
  Pagination,
  SearchResponse,
  GenreAnimeResponse,
  SeasonAnimeResponse,
  DownloadSection,
  DownloadLink,
  AnimeListItem,
} from "../types";

export class KusonimeService {
  private readonly baseUrl = "https://kusonime.com";

  private extractSlug(url: string): string {
    const matches = url.match(/kusonime\.com\/([^/]+)\/?$/);
    return matches ? matches[1].replace(/-subtitle-indonesia$/, "") : "";
  }

  private extractGenreSlug(url: string): string {
    const matches = url.match(/\/genres\/([^/]+)\/?$/);
    return matches ? matches[1] : "";
  }

  private extractSeasonSlug(url: string): string {
    const matches = url.match(/\/seasons\/([^/]+)\/?$/);
    return matches ? matches[1] : "";
  }

  private parsePagination($: cheerio.CheerioAPI): Pagination {
    const paginationEl = $(".wp-pagenavi, .pagination");
    const pagesText = paginationEl.find(".pages").text();
    const pageMatch = pagesText.match(/Page (\d+) of (\d+)/);

    const currentPage = pageMatch ? parseInt(pageMatch[1]) : 1;
    const totalPages = pageMatch ? parseInt(pageMatch[2]) : 1;

    return {
      currentPage,
      totalPages,
      hasPrevPage: currentPage > 1,
      hasNextPage: currentPage < totalPages,
      prevPage: currentPage > 1 ? currentPage - 1 : null,
      nextPage: currentPage < totalPages ? currentPage + 1 : null,
    };
  }

  private parseAnimeCard($: cheerio.CheerioAPI, el: cheerio.Element): AnimeCard | null {
    const $el = $(el);
    const titleEl = $el.find(".episodeye a, h2.title a").first();
    const title = titleEl.text().trim();
    const link = titleEl.attr("href") || $el.find("a").first().attr("href") || "";
    const poster = $el.find(".thumbz img, .thumb img, img").first().attr("src") || "";

    const genreEls = $el.find('.content p .fa-tag').parent().find('a');
    const genres: string[] = [];
    genreEls.each((_, genreEl) => {
      genres.push($(genreEl).text().trim());
    });

    const releaseDateText = $el.find('.content p .fa-clock-o').parent().text().trim();
    const releaseDate = releaseDateText.replace('Released on ', '').trim();

    if (title && link) {
      return {
        title,
        slug: this.extractSlug(link),
        poster,
        genres: genres.length > 0 ? genres : undefined,
        releaseDate: releaseDate || undefined,
      };
    }
    return null;
  }

  async getHome(): Promise<HomeResponse> {
    const $ = await fetchHtml(this.baseUrl);

    const latest: AnimeCard[] = [];
    const recommendations: AnimeCard[] = [];

    $(".venz ul .kover .detpost").each((_, el) => {
      const card = this.parseAnimeCard($, el);
      if (card) latest.push(card);
    });

    $(".recomx ul li .zeeb").each((_, el) => {
      const $el = $(el);
      const link = $el.find("a").attr("href") || "";
      const title = $el.find("h2").text().trim();
      const poster = $el.find("img").attr("src") || "";

      if (title && link) {
        recommendations.push({
          title,
          slug: this.extractSlug(link),
          poster,
        });
      }
    });

    return { latest, recommendations };
  }

  async search(query: string, page: number = 1): Promise<SearchResponse> {
    const url = page === 1
      ? `${this.baseUrl}/?s=${encodeURIComponent(query)}&post_type=post`
      : `${this.baseUrl}/page/${page}/?s=${encodeURIComponent(query)}&post_type=post`;

    const $ = await fetchHtml(url);

    const anime: AnimeCard[] = [];

    $(".venz ul .kover .detpost").each((_, el) => {
      const card = this.parseAnimeCard($, el);
      if (card) anime.push(card);
    });

    const pagination = this.parsePagination($);

    return { anime, pagination };
  }

  async getAnimeDetail(slug: string): Promise<AnimeDetail> {
    const possibleSlugs = [
      `${slug}-subtitle-indonesia`,
      `${slug}-batch-subtitle-indonesia`,
      `${slug}-sub-indo`,
      slug,
    ];

    let $: cheerio.CheerioAPI | null = null;
    let lastError: Error | null = null;

    for (const trySlug of possibleSlugs) {
      try {
        $ = await fetchHtml(`${this.baseUrl}/${trySlug}/`);
        const title = $(".post-thumb h1.jdlz, .jdlz").text().trim();
        if (title) break;
        $ = null;
      } catch (e) {
        lastError = e as Error;
        $ = null;
      }
    }

    if (!$) {
      const error = new Error(`Anime dengan slug '${slug}' tidak ditemukan`);
      (error as any).statusCode = 404;
      throw error;
    }

    const title = $(".post-thumb h1.jdlz, .jdlz").text().trim();

    if (!title) {
      const error = new Error(`Anime dengan slug '${slug}' tidak ditemukan`);
      (error as any).statusCode = 404;
      throw error;
    }

    const poster = $(".post-thumb img").attr("src") || "";

    const infoMap: Record<string, string> = {};
    $(".info p").each((_, el) => {
      const text = $(el).text();
      const [key, ...valueParts] = text.split(":");
      if (key && valueParts.length) {
        infoMap[key.trim().toLowerCase()] = valueParts.join(":").trim();
      }
    });

    const genres: string[] = [];
    $(".info p b:contains('Genre')").parent().find("a").each((_, el) => {
      genres.push($(el).text().trim());
    });

    const seasonText = $(".info p b:contains('Seasons')").parent().find("a").text().trim();

    const synopsisEl = $(".lexot > p").not(".dlbodz p").not(".info p");
    let synopsis = "";
    synopsisEl.each((_, el) => {
      const text = $(el).text().trim();
      if (text && !text.includes("Download") && !text.includes("Credit")) {
        synopsis += text + " ";
      }
    });
    synopsis = synopsis.trim();

    const downloads: DownloadSection[] = [];
    $(".smokeddlrh .smokeurlrh").each((_, el) => {
      const $el = $(el);
      const text = $el.text().trim();
      const resolutionMatch = text.match(/^(360P|480P|720P|1080P)/i);
      const resolution = resolutionMatch ? resolutionMatch[1] : "Unknown";

      const links: DownloadLink[] = [];
      $el.find("a").each((_, linkEl) => {
        const provider = $(linkEl).text().trim();
        const url = $(linkEl).attr("href") || "";
        if (provider && url) {
          links.push({ provider, url });
        }
      });

      if (links.length > 0) {
        downloads.push({ resolution, links });
      }
    });

    return {
      title,
      japanese: infoMap["japanese"] || undefined,
      score: infoMap["score"] || undefined,
      producer: infoMap["producers"] || undefined,
      type: infoMap["type"] || undefined,
      status: infoMap["status"] || undefined,
      totalEpisode: infoMap["total episode"] || undefined,
      duration: infoMap["duration"] || undefined,
      releaseDate: infoMap["released on"] || undefined,
      season: seasonText || undefined,
      genres,
      synopsis,
      poster,
      downloads,
    };
  }

  async getGenres(): Promise<Genre[]> {
    const $ = await fetchHtml(`${this.baseUrl}/genres/`);

    const genres: Genre[] = [];

    $(".genres li a, .tagcloud a, .section .tagcloud a[href*='/genres/']").each((_, el) => {
      const $el = $(el);
      const name = $el.text().trim();
      const href = $el.attr("href") || "";

      if (name && href && href.includes("/genres/")) {
        genres.push({
          name,
          slug: this.extractGenreSlug(href),
        });
      }
    });

    return genres;
  }

  async getAnimeByGenre(genre: string, page: number = 1): Promise<GenreAnimeResponse> {
    const url = page === 1
      ? `${this.baseUrl}/genres/${genre}/`
      : `${this.baseUrl}/genres/${genre}/page/${page}/`;

    const $ = await fetchHtml(url);

    const anime: AnimeCard[] = [];

    $(".venz ul .kover .detpost").each((_, el) => {
      const card = this.parseAnimeCard($, el);
      if (card) anime.push(card);
    });

    const pagination = this.parsePagination($);

    return { genre, anime, pagination };
  }

  async getSeasons(): Promise<Season[]> {
    const $ = await fetchHtml(this.baseUrl);

    const seasons: Season[] = [];

    $(".section .tagcloud a[href*='/seasons/']").each((_, el) => {
      const $el = $(el);
      const name = $el.text().trim();
      const href = $el.attr("href") || "";

      if (name && href) {
        seasons.push({
          name,
          slug: this.extractSeasonSlug(href),
        });
      }
    });

    return seasons;
  }

  async getAnimeBySeason(season: string, page: number = 1): Promise<SeasonAnimeResponse> {
    const url = page === 1
      ? `${this.baseUrl}/seasons/${season}/`
      : `${this.baseUrl}/seasons/${season}/page/${page}/`;

    const $ = await fetchHtml(url);

    const anime: AnimeCard[] = [];

    $(".venz ul .kover .detpost").each((_, el) => {
      const card = this.parseAnimeCard($, el);
      if (card) anime.push(card);
    });

    const pagination = this.parsePagination($);

    return { season, anime, pagination };
  }

  async getAnimeList(): Promise<Record<string, AnimeListItem[]>> {
    const $ = await fetchHtml(`${this.baseUrl}/list-anime-batch-sub-indo/`);

    const list: Record<string, AnimeListItem[]> = {};

    $(".bariskelom, .daftarkartun").each((_, el) => {
      const $el = $(el);
      const letter = $el.find(".barispenz a, .huruf").text().trim().toUpperCase() || "#";

      if (!list[letter]) {
        list[letter] = [];
      }

      $el.find(".jdlbar ul li a, .penzbar li a").each((_, linkEl) => {
        const $link = $(linkEl);
        const title = $link.text().trim();
        const href = $link.attr("href") || "";

        if (title && href) {
          list[letter].push({
            title,
            slug: this.extractSlug(href),
          });
        }
      });
    });

    return list;
  }

  async getLatestAnime(page: number = 1): Promise<SearchResponse> {
    const url = page === 1
      ? this.baseUrl
      : `${this.baseUrl}/page/${page}/`;

    const $ = await fetchHtml(url);

    const anime: AnimeCard[] = [];

    $(".venz ul .kover .detpost").each((_, el) => {
      const card = this.parseAnimeCard($, el);
      if (card) anime.push(card);
    });

    const pagination = this.parsePagination($);

    return { anime, pagination };
  }
}

export const kusonimeService = new KusonimeService();
