export interface AnimeCard {
  title: string;
  slug: string;
  poster: string;
  genres?: string[];
  releaseDate?: string;
  episode?: string;
}

export interface HomeResponse {
  latest: AnimeCard[];
  recommendations: AnimeCard[];
}

export interface AnimeListItem {
  title: string;
  slug: string;
}

export interface AnimeDetail {
  title: string;
  japanese?: string;
  score?: string;
  producer?: string;
  type?: string;
  status?: string;
  totalEpisode?: string;
  duration?: string;
  releaseDate?: string;
  season?: string;
  genres: string[];
  synopsis: string;
  poster: string;
  downloads: DownloadSection[];
}

export interface DownloadSection {
  resolution: string;
  links: DownloadLink[];
}

export interface DownloadLink {
  provider: string;
  url: string;
}

export interface Genre {
  name: string;
  slug: string;
}

export interface Season {
  name: string;
  slug: string;
}

export interface Pagination {
  currentPage: number;
  totalPages: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPage: number | null;
  nextPage: number | null;
}

export interface SearchResponse {
  anime: AnimeCard[];
  pagination: Pagination;
}

export interface GenreAnimeResponse {
  genre: string;
  anime: AnimeCard[];
  pagination: Pagination;
}

export interface SeasonAnimeResponse {
  season: string;
  anime: AnimeCard[];
  pagination: Pagination;
}

export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
  timestamp: string;
  path: string;
  responseTime?: string;
}

export interface ApiErrorResponse {
  success: false;
  statusCode: number;
  message: string;
  error: {
    code: string;
    details?: string;
  };
  timestamp: string;
  path: string;
}
