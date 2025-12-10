export const openApiSpec = {
  openapi: "3.0.3",
  info: {
    title: "Kusonime API",
    description:
      'Unofficial API for accessing anime batch content from <a href="https://kusonime.com">kusonime.com</a>',
  },
  tags: [
    {
      name: "Home",
      description: "Homepage data - latest and recommended anime",
    },
    {
      name: "Anime",
      description: "Anime listings and detailed information with download links",
    },
    {
      name: "Genre",
      description: "Genre listings and anime filtering by genre",
    },
    {
      name: "Season",
      description: "Season listings and anime filtering by season",
    },
    {
      name: "Search",
      description: "Anime search functionality",
    },
  ],
  paths: {
    "/api/home": {
      get: {
        tags: ["Home"],
        summary: "Get homepage data",
        description:
          "Retrieves the latest anime and recommendations displayed on the homepage.",
        operationId: "getHome",
        responses: {
          "200": {
            description: "Successfully retrieved homepage data",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/HomeResponse",
                },
                example: {
                  success: true,
                  statusCode: 200,
                  message: "OK",
                  data: {
                    latest: [
                      {
                        title: "Naruto Shippuden Batch",
                        slug: "naruto-shippuden",
                        poster: "https://kusonime.com/wp-content/uploads/naruto.jpg",
                        genres: ["Action", "Adventure"],
                        releaseDate: "10 Dec 2025",
                      },
                    ],
                    recommendations: [
                      {
                        title: "One Piece",
                        slug: "one-piece",
                        poster: "https://kusonime.com/wp-content/uploads/onepiece.jpg",
                      },
                    ],
                  },
                  timestamp: "2025-12-10T09:00:00.000Z",
                  path: "/api/home",
                  responseTime: "456ms",
                },
              },
            },
          },
          "502": {
            $ref: "#/components/responses/UpstreamError",
          },
        },
      },
    },
    "/api/latest": {
      get: {
        tags: ["Anime"],
        summary: "Get latest anime list",
        description: "Retrieves a paginated list of latest anime releases.",
        operationId: "getLatest",
        parameters: [
          {
            $ref: "#/components/parameters/PageParam",
          },
        ],
        responses: {
          "200": {
            description: "Successfully retrieved latest anime list",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/PaginatedAnimeResponse",
                },
                example: {
                  success: true,
                  statusCode: 200,
                  message: "OK",
                  data: {
                    anime: [
                      {
                        title: "Naruto Shippuden Batch",
                        slug: "naruto-shippuden",
                        poster: "https://kusonime.com/wp-content/uploads/naruto.jpg",
                        genres: ["Action", "Adventure"],
                        releaseDate: "10 Dec 2025",
                      },
                    ],
                    pagination: {
                      currentPage: 1,
                      totalPages: 100,
                      hasPrevPage: false,
                      hasNextPage: true,
                      prevPage: null,
                      nextPage: 2,
                    },
                  },
                  timestamp: "2025-12-10T09:00:00.000Z",
                  path: "/api/latest",
                  responseTime: "320ms",
                },
              },
            },
          },
          "502": {
            $ref: "#/components/responses/UpstreamError",
          },
        },
      },
    },
    "/api/anime-list": {
      get: {
        tags: ["Anime"],
        summary: "Get all anime alphabetically",
        description:
          'Retrieves all anime sorted alphabetically and grouped by first letter (A-Z). Includes a special "#" group for anime starting with numbers or symbols.',
        operationId: "getAnimeList",
        responses: {
          "200": {
            description: "Successfully retrieved anime list",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/AnimeListResponse",
                },
                example: {
                  success: true,
                  statusCode: 200,
                  message: "OK",
                  data: {
                    list: {
                      A: [
                        { title: "Attack on Titan", slug: "attack-on-titan" },
                        { title: "Akame ga Kill!", slug: "akame-ga-kill" },
                      ],
                      B: [
                        { title: "Bleach", slug: "bleach" },
                        { title: "Blue Lock", slug: "blue-lock" },
                      ],
                    },
                  },
                  timestamp: "2025-12-10T09:00:00.000Z",
                  path: "/api/anime-list",
                  responseTime: "890ms",
                },
              },
            },
          },
          "502": {
            $ref: "#/components/responses/UpstreamError",
          },
        },
      },
    },
    "/api/anime/{slug}": {
      get: {
        tags: ["Anime"],
        summary: "Get anime details",
        description:
          "Retrieves detailed information about a specific anime including synopsis, info, genres, and download links for multiple resolutions (360p, 480p, 720p, 1080p).",
        operationId: "getAnimeDetail",
        parameters: [
          {
            name: "slug",
            in: "path",
            required: true,
            description: "Unique anime identifier (URL slug)",
            schema: {
              type: "string",
            },
            example: "naruto-shippuden",
          },
        ],
        responses: {
          "200": {
            description: "Successfully retrieved anime details",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/AnimeDetailResponse",
                },
                example: {
                  success: true,
                  statusCode: 200,
                  message: "OK",
                  data: {
                    title: "Naruto Shippuden Batch Subtitle Indonesia",
                    japanese: "NARUTO -ナルト- 疾風伝",
                    score: "8.50",
                    producer: "Pierrot",
                    type: "TV",
                    status: "Completed",
                    totalEpisode: "500 Episode",
                    duration: "24 min per ep",
                    releaseDate: "Feb 2007",
                    season: "Winter 2007",
                    genres: ["Action", "Adventure", "Martial Arts"],
                    synopsis: "Naruto Uzumaki returns after two and a half years...",
                    poster: "https://kusonime.com/wp-content/uploads/naruto.jpg",
                    downloads: [
                      {
                        resolution: "480P",
                        links: [
                          { provider: "Mega", url: "https://mega.nz/file/xxx" },
                          { provider: "GDrive", url: "https://drive.google.com/file/xxx" },
                        ],
                      },
                      {
                        resolution: "720P",
                        links: [
                          { provider: "Mega", url: "https://mega.nz/file/yyy" },
                          { provider: "GDrive", url: "https://drive.google.com/file/yyy" },
                        ],
                      },
                    ],
                  },
                  timestamp: "2025-12-10T09:00:00.000Z",
                  path: "/api/anime/naruto-shippuden",
                  responseTime: "420ms",
                },
              },
            },
          },
          "404": {
            $ref: "#/components/responses/AnimeNotFound",
          },
          "502": {
            $ref: "#/components/responses/UpstreamError",
          },
        },
      },
    },
    "/api/genres": {
      get: {
        tags: ["Genre"],
        summary: "Get all genres",
        description: "Retrieves a complete list of all available anime genres.",
        operationId: "getGenres",
        responses: {
          "200": {
            description: "Successfully retrieved genre list",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/GenreListResponse",
                },
                example: {
                  success: true,
                  statusCode: 200,
                  message: "OK",
                  data: {
                    genres: [
                      { name: "Action", slug: "action" },
                      { name: "Adventure", slug: "adventure" },
                      { name: "Comedy", slug: "comedy" },
                      { name: "Drama", slug: "drama" },
                      { name: "Fantasy", slug: "fantasy" },
                    ],
                  },
                  timestamp: "2025-12-10T09:00:00.000Z",
                  path: "/api/genres",
                  responseTime: "180ms",
                },
              },
            },
          },
          "502": {
            $ref: "#/components/responses/UpstreamError",
          },
        },
      },
    },
    "/api/genres/{genre}": {
      get: {
        tags: ["Genre"],
        summary: "Get anime by genre",
        description:
          "Retrieves a paginated list of anime filtered by the specified genre.",
        operationId: "getAnimeByGenre",
        parameters: [
          {
            name: "genre",
            in: "path",
            required: true,
            description: "Genre slug identifier",
            schema: {
              type: "string",
            },
            example: "action",
          },
          {
            $ref: "#/components/parameters/PageParam",
          },
        ],
        responses: {
          "200": {
            description: "Successfully retrieved anime by genre",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/GenreAnimeResponse",
                },
                example: {
                  success: true,
                  statusCode: 200,
                  message: "OK",
                  data: {
                    genre: "action",
                    anime: [
                      {
                        title: "Naruto Shippuden Batch",
                        slug: "naruto-shippuden",
                        poster: "https://kusonime.com/wp-content/uploads/naruto.jpg",
                      },
                    ],
                    pagination: {
                      currentPage: 1,
                      totalPages: 50,
                      hasPrevPage: false,
                      hasNextPage: true,
                      prevPage: null,
                      nextPage: 2,
                    },
                  },
                  timestamp: "2025-12-10T09:00:00.000Z",
                  path: "/api/genres/action",
                  responseTime: "310ms",
                },
              },
            },
          },
          "502": {
            $ref: "#/components/responses/UpstreamError",
          },
        },
      },
    },
    "/api/seasons": {
      get: {
        tags: ["Season"],
        summary: "Get all seasons",
        description: "Retrieves a complete list of all available anime seasons.",
        operationId: "getSeasons",
        responses: {
          "200": {
            description: "Successfully retrieved season list",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/SeasonListResponse",
                },
                example: {
                  success: true,
                  statusCode: 200,
                  message: "OK",
                  data: {
                    seasons: [
                      { name: "Winter 2025", slug: "winter-2025" },
                      { name: "Fall 2024", slug: "fall-2024" },
                      { name: "Summer 2024", slug: "summer-2024" },
                    ],
                  },
                  timestamp: "2025-12-10T09:00:00.000Z",
                  path: "/api/seasons",
                  responseTime: "180ms",
                },
              },
            },
          },
          "502": {
            $ref: "#/components/responses/UpstreamError",
          },
        },
      },
    },
    "/api/seasons/{season}": {
      get: {
        tags: ["Season"],
        summary: "Get anime by season",
        description:
          "Retrieves a paginated list of anime filtered by the specified season.",
        operationId: "getAnimeBySeason",
        parameters: [
          {
            name: "season",
            in: "path",
            required: true,
            description: "Season slug identifier",
            schema: {
              type: "string",
            },
            example: "winter-2025",
          },
          {
            $ref: "#/components/parameters/PageParam",
          },
        ],
        responses: {
          "200": {
            description: "Successfully retrieved anime by season",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/SeasonAnimeResponse",
                },
                example: {
                  success: true,
                  statusCode: 200,
                  message: "OK",
                  data: {
                    season: "winter-2025",
                    anime: [
                      {
                        title: "Solo Leveling Season 2",
                        slug: "solo-leveling-s2",
                        poster: "https://kusonime.com/wp-content/uploads/solo.jpg",
                      },
                    ],
                    pagination: {
                      currentPage: 1,
                      totalPages: 5,
                      hasPrevPage: false,
                      hasNextPage: true,
                      prevPage: null,
                      nextPage: 2,
                    },
                  },
                  timestamp: "2025-12-10T09:00:00.000Z",
                  path: "/api/seasons/winter-2025",
                  responseTime: "310ms",
                },
              },
            },
          },
          "502": {
            $ref: "#/components/responses/UpstreamError",
          },
        },
      },
    },
    "/api/search": {
      get: {
        tags: ["Search"],
        summary: "Search anime",
        description: "Search for anime by keyword with pagination support.",
        operationId: "searchAnime",
        parameters: [
          {
            name: "q",
            in: "query",
            required: true,
            description: "Search keyword",
            schema: {
              type: "string",
              minLength: 1,
            },
            example: "naruto",
          },
          {
            $ref: "#/components/parameters/PageParam",
          },
        ],
        responses: {
          "200": {
            description: "Successfully retrieved search results",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/PaginatedAnimeResponse",
                },
                example: {
                  success: true,
                  statusCode: 200,
                  message: "OK",
                  data: {
                    anime: [
                      {
                        title: "Naruto Shippuden Batch Subtitle Indonesia",
                        slug: "naruto-shippuden",
                        poster: "https://kusonime.com/wp-content/uploads/naruto.jpg",
                      },
                      {
                        title: "Naruto Batch Subtitle Indonesia",
                        slug: "naruto",
                        poster: "https://kusonime.com/wp-content/uploads/naruto-original.jpg",
                      },
                    ],
                    pagination: {
                      currentPage: 1,
                      totalPages: 1,
                      hasPrevPage: false,
                      hasNextPage: false,
                      prevPage: null,
                      nextPage: null,
                    },
                  },
                  timestamp: "2025-12-10T09:00:00.000Z",
                  path: "/api/search",
                  responseTime: "580ms",
                },
              },
            },
          },
          "502": {
            $ref: "#/components/responses/UpstreamError",
          },
        },
      },
    },
  },
  components: {
    schemas: {
      AnimeCard: {
        type: "object",
        description: "Basic anime information card",
        properties: {
          title: {
            type: "string",
            description: "Anime title",
            example: "Naruto Shippuden Batch",
          },
          slug: {
            type: "string",
            description: "URL-friendly identifier",
            example: "naruto-shippuden",
          },
          poster: {
            type: "string",
            format: "uri",
            description: "Poster image URL",
            example: "https://kusonime.com/wp-content/uploads/naruto.jpg",
          },
          genres: {
            type: "array",
            items: { type: "string" },
            description: "List of genres",
            example: ["Action", "Adventure"],
          },
          releaseDate: {
            type: "string",
            description: "Release date",
            example: "10 Dec 2025",
          },
        },
        required: ["title", "slug", "poster"],
      },
      AnimeDetail: {
        type: "object",
        description: "Detailed anime information with download links",
        properties: {
          title: { type: "string", example: "Naruto Shippuden Batch Subtitle Indonesia" },
          japanese: { type: "string", example: "NARUTO -ナルト- 疾風伝" },
          score: { type: "string", example: "8.50" },
          producer: { type: "string", example: "Pierrot" },
          type: { type: "string", example: "TV" },
          status: { type: "string", example: "Completed" },
          totalEpisode: { type: "string", example: "500 Episode" },
          duration: { type: "string", example: "24 min per ep" },
          releaseDate: { type: "string", example: "Feb 2007" },
          season: { type: "string", example: "Winter 2007" },
          genres: {
            type: "array",
            items: { type: "string" },
            example: ["Action", "Adventure"],
          },
          synopsis: { type: "string", example: "Naruto Uzumaki returns..." },
          poster: { type: "string", format: "uri" },
          downloads: {
            type: "array",
            items: { $ref: "#/components/schemas/DownloadSection" },
          },
        },
      },
      DownloadSection: {
        type: "object",
        properties: {
          resolution: { type: "string", example: "720P" },
          links: {
            type: "array",
            items: {
              type: "object",
              properties: {
                provider: { type: "string", example: "Mega" },
                url: { type: "string", format: "uri" },
              },
            },
          },
        },
      },
      Genre: {
        type: "object",
        properties: {
          name: { type: "string", example: "Action" },
          slug: { type: "string", example: "action" },
        },
        required: ["name", "slug"],
      },
      Season: {
        type: "object",
        properties: {
          name: { type: "string", example: "Winter 2025" },
          slug: { type: "string", example: "winter-2025" },
        },
        required: ["name", "slug"],
      },
      Pagination: {
        type: "object",
        description: "Pagination metadata",
        properties: {
          currentPage: { type: "integer", example: 1 },
          totalPages: { type: "integer", example: 50 },
          hasPrevPage: { type: "boolean", example: false },
          hasNextPage: { type: "boolean", example: true },
          prevPage: { type: "integer", nullable: true, example: null },
          nextPage: { type: "integer", nullable: true, example: 2 },
        },
      },
      AnimeListItem: {
        type: "object",
        properties: {
          title: { type: "string", example: "Attack on Titan" },
          slug: { type: "string", example: "attack-on-titan" },
        },
        required: ["title", "slug"],
      },
      HomeResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: true },
          statusCode: { type: "integer", example: 200 },
          message: { type: "string", example: "OK" },
          data: {
            type: "object",
            properties: {
              latest: {
                type: "array",
                items: { $ref: "#/components/schemas/AnimeCard" },
              },
              recommendations: {
                type: "array",
                items: { $ref: "#/components/schemas/AnimeCard" },
              },
            },
          },
          timestamp: { type: "string", format: "date-time" },
          path: { type: "string" },
          responseTime: { type: "string" },
        },
      },
      PaginatedAnimeResponse: {
        type: "object",
        properties: {
          success: { type: "boolean" },
          statusCode: { type: "integer" },
          message: { type: "string" },
          data: {
            type: "object",
            properties: {
              anime: {
                type: "array",
                items: { $ref: "#/components/schemas/AnimeCard" },
              },
              pagination: { $ref: "#/components/schemas/Pagination" },
            },
          },
          timestamp: { type: "string", format: "date-time" },
          path: { type: "string" },
          responseTime: { type: "string" },
        },
      },
      AnimeListResponse: {
        type: "object",
        properties: {
          success: { type: "boolean" },
          statusCode: { type: "integer" },
          message: { type: "string" },
          data: {
            type: "object",
            properties: {
              list: {
                type: "object",
                additionalProperties: {
                  type: "array",
                  items: { $ref: "#/components/schemas/AnimeListItem" },
                },
              },
            },
          },
          timestamp: { type: "string", format: "date-time" },
          path: { type: "string" },
          responseTime: { type: "string" },
        },
      },
      AnimeDetailResponse: {
        type: "object",
        properties: {
          success: { type: "boolean" },
          statusCode: { type: "integer" },
          message: { type: "string" },
          data: { $ref: "#/components/schemas/AnimeDetail" },
          timestamp: { type: "string", format: "date-time" },
          path: { type: "string" },
          responseTime: { type: "string" },
        },
      },
      GenreListResponse: {
        type: "object",
        properties: {
          success: { type: "boolean" },
          statusCode: { type: "integer" },
          message: { type: "string" },
          data: {
            type: "object",
            properties: {
              genres: {
                type: "array",
                items: { $ref: "#/components/schemas/Genre" },
              },
            },
          },
          timestamp: { type: "string", format: "date-time" },
          path: { type: "string" },
          responseTime: { type: "string" },
        },
      },
      GenreAnimeResponse: {
        type: "object",
        properties: {
          success: { type: "boolean" },
          statusCode: { type: "integer" },
          message: { type: "string" },
          data: {
            type: "object",
            properties: {
              genre: { type: "string" },
              anime: {
                type: "array",
                items: { $ref: "#/components/schemas/AnimeCard" },
              },
              pagination: { $ref: "#/components/schemas/Pagination" },
            },
          },
          timestamp: { type: "string", format: "date-time" },
          path: { type: "string" },
          responseTime: { type: "string" },
        },
      },
      SeasonListResponse: {
        type: "object",
        properties: {
          success: { type: "boolean" },
          statusCode: { type: "integer" },
          message: { type: "string" },
          data: {
            type: "object",
            properties: {
              seasons: {
                type: "array",
                items: { $ref: "#/components/schemas/Season" },
              },
            },
          },
          timestamp: { type: "string", format: "date-time" },
          path: { type: "string" },
          responseTime: { type: "string" },
        },
      },
      SeasonAnimeResponse: {
        type: "object",
        properties: {
          success: { type: "boolean" },
          statusCode: { type: "integer" },
          message: { type: "string" },
          data: {
            type: "object",
            properties: {
              season: { type: "string" },
              anime: {
                type: "array",
                items: { $ref: "#/components/schemas/AnimeCard" },
              },
              pagination: { $ref: "#/components/schemas/Pagination" },
            },
          },
          timestamp: { type: "string", format: "date-time" },
          path: { type: "string" },
          responseTime: { type: "string" },
        },
      },
      ErrorResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: false },
          statusCode: { type: "integer" },
          message: { type: "string" },
          error: {
            type: "object",
            properties: {
              code: { type: "string" },
              details: { type: "string" },
            },
          },
          timestamp: { type: "string", format: "date-time" },
          path: { type: "string" },
        },
      },
    },
    parameters: {
      PageParam: {
        name: "page",
        in: "query",
        required: false,
        description: "Page number for pagination",
        schema: {
          type: "integer",
          minimum: 1,
          default: 1,
        },
        example: 1,
      },
    },
    responses: {
      AnimeNotFound: {
        description: "Anime not found",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/ErrorResponse" },
            example: {
              success: false,
              statusCode: 404,
              message: "Anime dengan slug 'xxx' tidak ditemukan",
              error: { code: "ANIME_NOT_FOUND" },
              timestamp: "2025-12-10T09:00:00.000Z",
              path: "/api/anime/xxx",
            },
          },
        },
      },
      UpstreamError: {
        description: "Failed to fetch data from upstream source",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/ErrorResponse" },
            example: {
              success: false,
              statusCode: 502,
              message: "Failed to fetch data from https://kusonime.com",
              error: { code: "UPSTREAM_ERROR" },
              timestamp: "2025-12-10T09:00:00.000Z",
              path: "/api/home",
            },
          },
        },
      },
    },
  },
};
