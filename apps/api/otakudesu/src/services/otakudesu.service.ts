import { fetchHtml, cheerio, DEFAULT_HEADERS } from '@otaku-wraper/core';
import type {
  HomeResponse,
  AnimeCard,
  AnimeDetail,
  EpisodeDetail,
  Genre,
  ScheduleDay,
  OngoingResponse,
  CompleteResponse,
  GenreAnimeResponse,
  Pagination,
  EpisodeListItem,
  DownloadSection,
  AnimeListItem,
  StreamingServer,
  ResolveStreamingResponse,
} from '../types';

export class OtakudesuService {
  private readonly baseUrl = 'https://otakudesu.best';

  private extractSlug(url: string): string {
    const matches = url.match(/\/(?:anime|episode)\/([^/]+)\/?/);
    return matches ? matches[1] : '';
  }

  private extractGenreSlug(url: string): string {
    const matches = url.match(/\/genres\/([^/]+)\/?/);
    return matches ? matches[1] : '';
  }

  private parsePagination(
    $: cheerio.CheerioAPI,
    itemsPerPage: number = 50,
  ): Pagination {
    const paginationEl = $('.pagenavix, .pagination');
    const currentPageEl = paginationEl.find('.page-numbers.current');
    const currentPage = parseInt(currentPageEl.text()) || 1;

    const allPages = paginationEl
      .find('.page-numbers:not(.prev):not(.next)')
      .map((_, el) => parseInt($(el).text()) || 0)
      .get()
      .filter((n) => n > 0);

    const totalPages = allPages.length > 0 ? Math.max(...allPages) : 1;
    const totalItems = totalPages > 0 ? totalPages * itemsPerPage : null;

    return {
      currentPage,
      totalPages,
      itemsPerPage,
      totalItems,
      hasPrevPage: currentPage > 1,
      hasNextPage: currentPage < totalPages,
      prevPage: currentPage > 1 ? currentPage - 1 : null,
      nextPage: currentPage < totalPages ? currentPage + 1 : null,
    };
  }

  async getHome(): Promise<HomeResponse> {
    const $ = await fetchHtml(this.baseUrl);

    const ongoing: AnimeCard[] = [];
    const complete: AnimeCard[] = [];

    // Parse ongoing anime
    $('.venz ul')
      .first()
      .find('li')
      .each((_, el) => {
        const $el = $(el);
        const title = $el.find('.jdlflm').text().trim();
        const link = $el.find('.thumb a').attr('href') || '';
        const poster = $el.find('.thumbz img').attr('src') || '';
        const episode = $el.find('.epz').text().replace('Episode', '').trim();
        const releaseDay = $el.find('.epztipe').text().trim();
        const releaseDate = $el.find('.newnime').text().trim();

        if (title && link) {
          ongoing.push({
            title,
            slug: this.extractSlug(link),
            poster,
            episode,
            releaseDay,
            releaseDate,
          });
        }
      });

    // Parse complete anime
    $('.venz ul')
      .last()
      .find('li')
      .each((_, el) => {
        const $el = $(el);
        const title = $el.find('.jdlflm').text().trim();
        const link = $el.find('.thumb a').attr('href') || '';
        const poster = $el.find('.thumbz img').attr('src') || '';
        const totalEpisode = $el.find('.epz').text().trim();
        const rating = $el.find('.epztipe').text().trim();
        const releaseDate = $el.find('.newnime').text().trim();

        if (title && link) {
          complete.push({
            title,
            slug: this.extractSlug(link),
            poster,
            totalEpisode,
            rating,
            releaseDate,
          });
        }
      });

    return { ongoing, complete };
  }

  async getOngoing(page: number = 1): Promise<OngoingResponse> {
    const url =
      page === 1
        ? `${this.baseUrl}/ongoing-anime/`
        : `${this.baseUrl}/ongoing-anime/page/${page}/`;
    const $ = await fetchHtml(url);

    const anime: AnimeCard[] = [];

    $('.venz ul li, .rapi .detpost').each((_, el) => {
      const $el = $(el);
      const title = $el.find('.jdlflm, .judul-anime').text().trim();
      const link = $el.find('.thumb a, a').first().attr('href') || '';
      const poster =
        $el.find('.thumbz img, img').first().attr('src') ||
        $el.find('.thumbz img, img').first().attr('data-src') ||
        '';
      const episode = $el.find('.epz').text().replace('Episode', '').trim();
      const releaseDay = $el.find('.epztipe').text().trim();
      const releaseDate = $el.find('.newnime').text().trim();

      if (title && link && link.includes('/anime/')) {
        anime.push({
          title,
          slug: this.extractSlug(link),
          poster,
          episode,
          releaseDay,
          releaseDate,
        });
      }
    });

    const pagination = this.parsePagination($);

    return { anime, pagination };
  }

  async getComplete(page: number = 1): Promise<CompleteResponse> {
    const url =
      page === 1
        ? `${this.baseUrl}/complete-anime/`
        : `${this.baseUrl}/complete-anime/page/${page}/`;
    const $ = await fetchHtml(url);

    const anime: AnimeCard[] = [];

    $('.venz ul li, .rapi .detpost').each((_, el) => {
      const $el = $(el);
      const title = $el.find('.jdlflm, .judul-anime').text().trim();
      const link = $el.find('.thumb a, a').first().attr('href') || '';
      const poster =
        $el.find('.thumbz img, img').first().attr('src') ||
        $el.find('.thumbz img, img').first().attr('data-src') ||
        '';
      const totalEpisode = $el.find('.epz').text().trim();
      const rating = $el.find('.epztipe').text().trim();
      const releaseDate = $el.find('.newnime').text().trim();

      if (title && link && link.includes('/anime/')) {
        anime.push({
          title,
          slug: this.extractSlug(link),
          poster,
          totalEpisode,
          rating,
          releaseDate,
        });
      }
    });

    const pagination = this.parsePagination($);

    return { anime, pagination };
  }

  async getAnimeList(): Promise<Record<string, AnimeListItem[]>> {
    const $ = await fetchHtml(`${this.baseUrl}/anime-list/`);

    const list: Record<string, AnimeListItem[]> = {};

    $('.bariskelom').each((_, el) => {
      const $el = $(el);
      const letter =
        $el.find('.barispenz a').text().trim().toUpperCase() || '#';

      if (!list[letter]) {
        list[letter] = [];
      }

      $el.find('.jdlbar ul li a').each((_, linkEl) => {
        const $link = $(linkEl);
        const title = $link.text().trim();
        const href = $link.attr('href') || '';

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

  async getAnimeDetail(slug: string): Promise<AnimeDetail> {
    const $ = await fetchHtml(`${this.baseUrl}/anime/${slug}/`);

    const title = $('.jdlrx h1')
      .text()
      .trim()
      .replace(/\s*\(Episode\s*\d+\s*[-–]\s*\d+\)\s*/i, '')
      .replace(/(\s*(Subtitle Indonesia|Sub Indo))+$/i, '')
      .trim();
    const poster = $('.fotoanime img').attr('src') || '';

    // Check if anime exists
    if (!title) {
      const error = new Error(`Anime dengan slug '${slug}' tidak ditemukan`);
      (error as any).statusCode = 404;
      throw error;
    }

    // Parse info
    const infoMap: Record<string, string> = {};
    $('.infozingle p').each((_, el) => {
      const text = $(el).text();
      const [key, ...valueParts] = text.split(':');
      if (key && valueParts.length) {
        infoMap[key.trim().toLowerCase()] = valueParts.join(':').trim();
      }
    });

    // Parse genres
    const genres: string[] = [];
    $('.infozingle p span a[href*="/genres/"]').each((_, el) => {
      genres.push($(el).text().trim());
    });

    // Parse synopsis
    const synopsis = $('.sinopc').text().trim();

    // Parse episodes
    const episodes: EpisodeListItem[] = [];
    $('.episodelist ul li').each((_, el) => {
      const $el = $(el);
      const link = $el.find('a').attr('href') || '';
      const epTitle = $el.find('a').text().trim();
      const date = $el.find('.zeebr').text().trim();

      const epMatch = epTitle.match(/Episode\s*(\d+)/i);
      const episode = epMatch ? epMatch[1] : epTitle;

      if (link.includes('/episode/')) {
        episodes.push({
          episode,
          slug: this.extractSlug(link),
          date,
        });
      }
    });

    return {
      title,
      japanese: infoMap['japanese'] || '',
      score: infoMap['skor'] || '',
      producer: infoMap['produser'] || '',
      type: infoMap['tipe'] || '',
      status: infoMap['status'] || '',
      totalEpisode: infoMap['total episode'] || '',
      duration: infoMap['durasi'] || '',
      releaseDate: infoMap['tanggal rilis'] || '',
      studio: infoMap['studio'] || '',
      genres,
      synopsis,
      poster,
      episodes,
    };
  }

  async getEpisodeDetail(slug: string): Promise<EpisodeDetail> {
    const $ = await fetchHtml(`${this.baseUrl}/episode/${slug}/`);

    const title = $('.posttl').text().trim();

    // Check if episode exists
    if (!title) {
      const error = new Error(`Episode dengan slug '${slug}' tidak ditemukan`);
      (error as any).statusCode = 404;
      throw error;
    }

    // Get anime info
    const animeLink =
      $('.flir a[href*="/anime/"]').attr('href') ||
      $('.flir a:contains("See All")').attr('href') ||
      '';
    const animeTitle = title.replace(/\s*Episode\s*\d+.*$/i, '').trim();

    // Navigation
    const prevLink = $('.flir a:contains("Previous")').attr('href') || '';
    const nextLink = $('.flir a:contains("Next")').attr('href') || '';

    // Streaming URL
    const streamingUrl = $('#embed_holder iframe').attr('src') || '';

    // Parse streaming servers
    const streamingServers: StreamingServer[] = [];
    const qualityMap: Record<
      string,
      { provider: string; dataContent: string; isDefault?: boolean }[]
    > = {};

    $('.mirrorstream ul').each((_, ulEl) => {
      const $ul = $(ulEl);
      const className = $ul.attr('class') || '';

      const qualityMatch = className.match(/m(\d+p)/);
      const quality = qualityMatch ? qualityMatch[1] : 'unknown';

      if (!qualityMap[quality]) {
        qualityMap[quality] = [];
      }

      $ul.find('li a[data-content]').each((_, linkEl) => {
        const $link = $(linkEl);
        const provider = $link.text().trim();
        const dataContent = $link.attr('data-content') || '';
        const isDefault = $link.attr('data-default') === 'true';

        if (provider && dataContent) {
          qualityMap[quality].push({
            provider,
            dataContent,
            isDefault: isDefault || undefined,
          });
        }
      });
    });

    for (const [quality, servers] of Object.entries(qualityMap)) {
      if (servers.length > 0) {
        streamingServers.push({ quality, servers });
      }
    }

    // Download links
    const downloadLinks: DownloadSection[] = [];

    $('.download ul li').each((_, el) => {
      const $el = $(el);
      const resolution = $el.find('strong').text().trim();
      const links: { provider: string; url: string }[] = [];

      $el.find('a').each((_, linkEl) => {
        const $link = $(linkEl);
        const provider = $link.text().trim();
        const url = $link.attr('href') || '';

        if (provider && url) {
          links.push({ provider, url });
        }
      });

      if (resolution && links.length > 0) {
        downloadLinks.push({ resolution, links });
      }
    });

    return {
      title,
      anime: {
        title: animeTitle,
        slug: this.extractSlug(animeLink),
      },
      prevEpisode: prevLink ? this.extractSlug(prevLink) : undefined,
      nextEpisode: nextLink ? this.extractSlug(nextLink) : undefined,
      streamingUrl: streamingUrl || undefined,
      streamingServers,
      downloadLinks,
    };
  }

  async getGenres(): Promise<Genre[]> {
    const $ = await fetchHtml(`${this.baseUrl}/genre-list/`);

    const genres: Genre[] = [];

    $('.genres li a').each((_, el) => {
      const $el = $(el);
      const name = $el.text().trim();
      const href = $el.attr('href') || '';

      if (name && href) {
        genres.push({
          name,
          slug: this.extractGenreSlug(href),
        });
      }
    });

    return genres;
  }

  async getAnimeByGenre(
    genre: string,
    page: number = 1,
  ): Promise<GenreAnimeResponse> {
    const url =
      page === 1
        ? `${this.baseUrl}/genres/${genre}/`
        : `${this.baseUrl}/genres/${genre}/page/${page}/`;
    const $ = await fetchHtml(url);

    const anime: AnimeCard[] = [];

    $('.col-anime, .col-md-4, .venz li, .page .col-6').each((_, el) => {
      const $el = $(el);
      const title = $el
        .find('.col-anime-title a, .jdlflm, .judul-anime, h3, h4')
        .first()
        .text()
        .trim();
      const link = $el.find('a').first().attr('href') || '';
      const poster =
        $el.find('img').first().attr('src') ||
        $el.find('img').first().attr('data-src') ||
        '';
      const rating = $el.find('.col-anime-rating, .epztipe').text().trim();

      if (title && link && link.includes('/anime/')) {
        anime.push({
          title,
          slug: this.extractSlug(link),
          poster,
          rating,
        });
      }
    });

    const pagination = this.parsePagination($);

    return {
      genre,
      anime,
      pagination,
    };
  }

  async getSchedule(): Promise<ScheduleDay[]> {
    const $ = await fetchHtml(`${this.baseUrl}/jadwal-rilis/`);

    const schedule: ScheduleDay[] = [];
    const days = [
      'Senin',
      'Selasa',
      'Rabu',
      'Kamis',
      'Jumat',
      'Sabtu',
      'Minggu',
    ];

    $('.kglist321').each((index, el) => {
      const $el = $(el);
      const day =
        $el.find('h2').text().trim() || days[index] || `Day ${index + 1}`;
      const animeList: { title: string; slug: string }[] = [];

      $el.find('ul li a').each((_, linkEl) => {
        const $link = $(linkEl);
        const title = $link.text().trim();
        const href = $link.attr('href') || '';

        if (title && href) {
          animeList.push({
            title,
            slug: this.extractSlug(href),
          });
        }
      });

      if (animeList.length > 0) {
        schedule.push({
          day,
          anime: animeList,
        });
      }
    });

    return schedule;
  }

  async search(query: string): Promise<AnimeCard[]> {
    const $ = await fetchHtml(
      `${this.baseUrl}/?s=${encodeURIComponent(query)}&post_type=anime`,
    );

    const anime: AnimeCard[] = [];

    $('.chivsrc li').each((_, el) => {
      const $el = $(el);
      const title = $el.find('h2 a').text().trim();
      const link = $el.find('h2 a').attr('href') || '';
      const poster = $el.find('img').attr('src') || '';

      let rating = '';
      $el.find('.set').each((__, setEl) => {
        const text = $(setEl).text();
        if (text.includes('Rating')) {
          rating = text.replace('Rating :', '').trim();
        }
      });

      if (title && link && link.includes('/anime/')) {
        anime.push({
          title,
          slug: this.extractSlug(link),
          poster,
          rating: rating || undefined,
        });
      }
    });

    return anime;
  }

  async resolveStreamingUrl(
    dataContent: string,
  ): Promise<ResolveStreamingResponse> {
    interface StreamingParams {
      id?: number;
      i?: number;
      q?: string;
    }

    interface AjaxResponse {
      data?: string;
    }

    // Decode the base64 data-content
    const decoded = atob(dataContent);
    const params: StreamingParams = JSON.parse(decoded);

    // Get the nonce
    const nonceResponse = await fetch(
      `${this.baseUrl}/wp-admin/admin-ajax.php`,
      {
        method: 'POST',
        headers: {
          ...DEFAULT_HEADERS,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          action: 'aa1208d27f29ca340c92c66d1926f13f',
        }),
      },
    );

    if (!nonceResponse.ok) {
      throw new Error('Failed to get nonce for streaming');
    }

    const nonceData: AjaxResponse = await nonceResponse.json();
    const nonce = nonceData?.data;

    if (!nonce) {
      const error = new Error('Failed to get nonce for streaming');
      (error as any).statusCode = 502;
      throw error;
    }

    const playerResponse = await fetch(
      `${this.baseUrl}/wp-admin/admin-ajax.php`,
      {
        method: 'POST',
        headers: {
          ...DEFAULT_HEADERS,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          action: '2a3505c93b0035d3f455df82bf976b84',
          nonce: nonce,
          id: params.id?.toString() || '',
          i: params.i?.toString() || '',
          q: params.q || '',
        }),
      },
    );

    if (!playerResponse.ok) {
      throw new Error('Failed to get streaming player');
    }

    const playerData: AjaxResponse = await playerResponse.json();
    const encodedHtml = playerData?.data;

    if (!encodedHtml) {
      const error = new Error('Failed to get streaming player');
      (error as any).statusCode = 502;
      throw error;
    }

    // Decode the base64 HTML response
    const html = atob(encodedHtml);

    // Extract iframe src
    const iframeMatch = html.match(/src="([^"]+)"/);
    const url = iframeMatch ? iframeMatch[1] : '';

    return {
      url,
      html,
    };
  }
}

// Export singleton instance
export const otakudesuService = new OtakudesuService();
