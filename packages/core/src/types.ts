export interface Pagination {
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  nextPage: number | null;
  prevPage: number | null;
}

export interface ApiResponse<T> {
  success: true;
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
  };
  timestamp: string;
  path: string;
}

export interface Genre {
  name: string;
  slug: string;
}

export interface MediaCard {
  title: string;
  slug: string;
  poster?: string;
  thumbnail?: string;
  cover?: string;
}

export function createPagination(
  currentPage: number,
  totalPages: number
): Pagination {
  return {
    currentPage,
    totalPages,
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1,
    nextPage: currentPage < totalPages ? currentPage + 1 : null,
    prevPage: currentPage > 1 ? currentPage - 1 : null,
  };
}
