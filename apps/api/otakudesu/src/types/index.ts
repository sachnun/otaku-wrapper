// Anime types
export interface AnimeCard {
  title: string;
  slug: string;
  poster: string;
  episode?: string;
  rating?: string;
  releaseDay?: string;
  releaseDate?: string;
  totalEpisode?: string;
}

export interface HomeResponse {
  ongoing: AnimeCard[];
  complete: AnimeCard[];
}

export interface AnimeListItem {
  title: string;
  slug: string;
  genres?: string[];
  status?: string;
}

export interface AnimeListResponse {
  list: Record<string, AnimeListItem[]>;
}

export interface AnimeDetail {
  title: string;
  japanese: string;
  score: string;
  producer: string;
  type: string;
  status: string;
  totalEpisode: string;
  duration: string;
  releaseDate: string;
  studio: string;
  genres: string[];
  synopsis: string;
  poster: string;
  batch?: BatchLink[];
  episodes: EpisodeListItem[];
}

export interface BatchLink {
  resolution: string;
  links: DownloadLink[];
}

export interface EpisodeListItem {
  episode: string;
  slug: string;
  date: string;
}

export interface StreamingServer {
  quality: string;
  servers: {
    provider: string;
    dataContent: string;
    isDefault?: boolean;
  }[];
}

export interface EpisodeDetail {
  title: string;
  anime: {
    title: string;
    slug: string;
  };
  prevEpisode?: string;
  nextEpisode?: string;
  streamingUrl?: string;
  streamingServers: StreamingServer[];
  downloadLinks: DownloadSection[];
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

export interface GenreAnimeResponse {
  genre: string;
  anime: AnimeCard[];
  pagination: Pagination;
}

export interface OngoingResponse {
  anime: AnimeCard[];
  pagination: Pagination;
}

export interface CompleteResponse {
  anime: AnimeCard[];
  pagination: Pagination;
}

export interface Pagination {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  totalItems: number | null;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPage: number | null;
  nextPage: number | null;
}

export interface ScheduleDay {
  day: string;
  anime: ScheduleAnime[];
}

export interface ScheduleAnime {
  title: string;
  slug: string;
}

// API Response types
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

// Streaming types
export interface ResolveStreamingResponse {
  url: string;
  html?: string;
}
