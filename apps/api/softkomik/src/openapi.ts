export const softkomikOpenApiSpec = {
  openapi: '3.0.0',
  info: {
    title: 'Softkomik API',
    description: 'Unofficial API for accessing comic content from <a href="https://softkomik.com">softkomik.com</a>'
  },
  tags: [
    { name: 'Home', description: 'Homepage data endpoints' },
    { name: 'Comics', description: 'Comic list, detail, and chapter endpoints' },
    { name: 'Browse', description: 'Browse by type and genre' }
  ],
  paths: {
    '/home/new': {
      get: {
        tags: ['Home'],
        summary: 'Get new comics',
        description: 'Returns list of new comics from homepage "Komik Baru" section',
        responses: {
          '200': {
            description: 'Successful response',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ComicListResponse' }
              }
            }
          }
        }
      }
    },
    '/home/latest': {
      get: {
        tags: ['Home'],
        summary: 'Get latest updates',
        description: 'Returns list of recently updated comics from homepage "Update Terbaru" section',
        responses: {
          '200': {
            description: 'Successful response',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ComicListResponse' }
              }
            }
          }
        }
      }
    },
    '/comics': {
      get: {
        tags: ['Comics'],
        summary: 'List comics',
        description: 'Returns paginated list of comics with optional search',
        parameters: [
          {
            name: 'page',
            in: 'query',
            description: 'Page number (default: 1)',
            schema: { type: 'integer', default: 1 }
          },
          {
            name: 'search',
            in: 'query',
            description: 'Search keyword',
            schema: { type: 'string' }
          }
        ],
        responses: {
          '200': {
            description: 'Successful response',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/PaginatedComicResponse' }
              }
            }
          }
        }
      }
    },
    '/comics/{slug}': {
      get: {
        tags: ['Comics'],
        summary: 'Get comic detail',
        description: 'Returns detailed information about a comic',
        parameters: [
          {
            name: 'slug',
            in: 'path',
            required: true,
            description: 'Comic slug',
            schema: { type: 'string' }
          }
        ],
        responses: {
          '200': {
            description: 'Successful response',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ComicDetailResponse' }
              }
            }
          },
          '404': {
            description: 'Comic not found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' }
              }
            }
          }
        }
      }
    },
    '/comics/{slug}/chapters': {
      get: {
        tags: ['Comics'],
        summary: 'Get chapter list',
        description: 'Returns list of all chapters for a comic',
        parameters: [
          {
            name: 'slug',
            in: 'path',
            required: true,
            description: 'Comic slug',
            schema: { type: 'string' }
          }
        ],
        responses: {
          '200': {
            description: 'Successful response',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ChapterListResponse' }
              }
            }
          },
          '404': {
            description: 'Comic not found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' }
              }
            }
          }
        }
      }
    },
    '/comics/{slug}/chapter/{chapter}': {
      get: {
        tags: ['Comics'],
        summary: 'Get chapter images',
        description: 'Returns all image URLs for a specific chapter',
        parameters: [
          {
            name: 'slug',
            in: 'path',
            required: true,
            description: 'Comic slug',
            schema: { type: 'string' }
          },
          {
            name: 'chapter',
            in: 'path',
            required: true,
            description: 'Chapter number',
            schema: { type: 'string' }
          }
        ],
        responses: {
          '200': {
            description: 'Successful response',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ChapterImagesResponse' }
              }
            }
          },
          '404': {
            description: 'Chapter not found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' }
              }
            }
          }
        }
      }
    },
    '/genres': {
      get: {
        tags: ['Browse'],
        summary: 'Get genres list',
        description: 'Returns list of available genres',
        responses: {
          '200': {
            description: 'Successful response',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/GenresResponse' }
              }
            }
          }
        }
      }
    },
    '/type/{type}': {
      get: {
        tags: ['Browse'],
        summary: 'Browse by type',
        description: 'Returns comics filtered by type (manga, manhwa, or manhua)',
        parameters: [
          {
            name: 'type',
            in: 'path',
            required: true,
            description: 'Comic type',
            schema: { type: 'string', enum: ['manga', 'manhwa', 'manhua'] }
          },
          {
            name: 'page',
            in: 'query',
            description: 'Page number (default: 1)',
            schema: { type: 'integer', default: 1 }
          }
        ],
        responses: {
          '200': {
            description: 'Successful response',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/PaginatedComicResponse' }
              }
            }
          },
          '400': {
            description: 'Invalid type',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' }
              }
            }
          }
        }
      }
    },
    '/genre/{genre}': {
      get: {
        tags: ['Browse'],
        summary: 'Browse by genre',
        description: 'Returns comics filtered by genre',
        parameters: [
          {
            name: 'genre',
            in: 'path',
            required: true,
            description: 'Genre name',
            schema: { type: 'string' }
          },
          {
            name: 'page',
            in: 'query',
            description: 'Page number (default: 1)',
            schema: { type: 'integer', default: 1 }
          }
        ],
        responses: {
          '200': {
            description: 'Successful response',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/PaginatedComicResponse' }
              }
            }
          }
        }
      }
    }
  },
  components: {
    schemas: {
      ComicListResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean' },
          source: { type: 'string' },
          type: { type: 'string' },
          count: { type: 'integer' },
          data: { type: 'array', items: { $ref: '#/components/schemas/ComicListing' } }
        }
      },
      PaginatedComicResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean' },
          source: { type: 'string' },
          search: { type: 'string', nullable: true },
          pagination: { $ref: '#/components/schemas/Pagination' },
          count: { type: 'integer' },
          data: { type: 'array', items: { $ref: '#/components/schemas/ComicListing' } }
        }
      },
      ComicDetailResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean' },
          source: { type: 'string' },
          slug: { type: 'string' },
          data: { $ref: '#/components/schemas/ComicDetail' }
        }
      },
      ChapterImagesResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean' },
          source: { type: 'string' },
          data: { $ref: '#/components/schemas/ChapterImages' }
        }
      },
      ChapterListResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean' },
          source: { type: 'string' },
          slug: { type: 'string' },
          data: { $ref: '#/components/schemas/ChapterList' }
        }
      },
      GenresResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean' },
          source: { type: 'string' },
          count: { type: 'integer' },
          data: { type: 'array', items: { type: 'string' } }
        }
      },
      ErrorResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          error: { type: 'string' }
        }
      },
      ComicListing: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          slug: { type: 'string' },
          url: { type: 'string' },
          thumbnail: { type: 'string', nullable: true },
          type: { type: 'string', nullable: true },
          status: { type: 'string', nullable: true },
          latestChapter: { type: 'string', nullable: true },
          updatedAt: { type: 'string', nullable: true },
          visitor: { type: 'integer', nullable: true }
        }
      },
      ComicDetail: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          alternativeTitle: { type: 'string', nullable: true },
          type: { type: 'string', nullable: true },
          status: { type: 'string', nullable: true },
          releaseYear: { type: 'string', nullable: true },
          author: { type: 'string', nullable: true },
          rating: { type: 'object', nullable: true },
          description: { type: 'string', nullable: true },
          genres: { type: 'array', items: { type: 'string' } },
          thumbnail: { type: 'string', nullable: true },
          visitor: { type: 'number', nullable: true },
          latestChapter: { type: 'string', nullable: true },
          updatedAt: { type: 'string', nullable: true }
        }
      },
      ChapterImages: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          comicSlug: { type: 'string' },
          chapterNumber: { type: 'string' },
          images: { type: 'array', items: { type: 'string' } },
          prevChapter: { type: 'string', nullable: true },
          nextChapter: { type: 'string', nullable: true }
        }
      },
      ChapterList: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          firstChapter: { type: 'string', nullable: true },
          latestChapter: { type: 'string', nullable: true },
          totalChapters: { type: 'integer' },
          chapters: { type: 'array', items: { type: 'object' } }
        }
      },
      Pagination: {
        type: 'object',
        properties: {
          currentPage: { type: 'integer' },
          totalPages: { type: 'integer' },
          hasNext: { type: 'boolean' },
          hasPrev: { type: 'boolean' }
        }
      }
    }
  }
}
