export const openApiSpec = {
  openapi: "3.0.3",
  info: {
    title: "Otakudesu API",
    description: "REST API for scraping anime data from Otakudesu.",
    version: "1.0.0",
    license: {
      name: "MIT",
      url: "https://opensource.org/licenses/MIT",
    },
  },
  servers: [
    {
      url: "/",
      description: "Current server",
    },
  ],
  tags: [
    {
      name: "Home",
      description: "Homepage data - latest ongoing and completed anime",
    },
    {
      name: "Anime",
      description: "Anime listings and detailed information",
    },
    {
      name: "Episode",
      description: "Episode details with streaming and download links",
    },
    {
      name: "Genre",
      description: "Genre listings and anime filtering by genre",
    },
    {
      name: "Schedule",
      description: "Weekly anime release schedule",
    },
    {
      name: "Search",
      description: "Anime search functionality",
    },
    {
      name: "Streaming",
      description: "Resolve streaming player URLs from encoded data",
    },
  ],
  paths: {
    "/api/home": {
      get: {
        tags: ["Home"],
        summary: "Get homepage data",
        description:
          "Retrieves the latest ongoing and completed anime displayed on the homepage. Returns two arrays containing anime cards with basic information.",
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
                    ongoing: [
                      {
                        title: "One Punch Man Season 3",
                        slug: "punch-man-s3-sub-indo",
                        poster:
                          "https://otakudesu.best/wp-content/uploads/2025/10/One-Punch-Man-Season-3.jpg",
                        episode: "8",
                        releaseDay: "Thursday",
                        releaseDate: "05 Dec",
                      },
                    ],
                    complete: [
                      {
                        title: "Dandadan",
                        slug: "dandadan-sub-indo",
                        poster:
                          "https://otakudesu.best/wp-content/uploads/2024/10/Dandadan.jpg",
                        totalEpisode: "12 Episode",
                        rating: "8.50",
                        releaseDate: "20 Nov",
                      },
                    ],
                  },
                  timestamp: "2025-12-06T09:00:00.000Z",
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
    "/api/ongoing": {
      get: {
        tags: ["Anime"],
        summary: "Get ongoing anime list",
        description:
          "Retrieves a paginated list of currently airing anime. Each page contains up to 50 anime entries.",
        operationId: "getOngoing",
        parameters: [
          {
            $ref: "#/components/parameters/PageParam",
          },
        ],
        responses: {
          "200": {
            description: "Successfully retrieved ongoing anime list",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/OngoingResponse",
                },
                example: {
                  success: true,
                  statusCode: 200,
                  message: "OK",
                  data: {
                    anime: [
                      {
                        title: "One Punch Man Season 3",
                        slug: "punch-man-s3-sub-indo",
                        poster:
                          "https://otakudesu.best/wp-content/uploads/2025/10/One-Punch-Man-Season-3.jpg",
                        episode: "8",
                        releaseDay: "Thursday",
                        releaseDate: "05 Dec",
                      },
                    ],
                    pagination: {
                      currentPage: 1,
                      totalPages: 5,
                      itemsPerPage: 50,
                      totalItems: 250,
                      hasPrevPage: false,
                      hasNextPage: true,
                      prevPage: null,
                      nextPage: 2,
                    },
                  },
                  timestamp: "2025-12-06T09:00:00.000Z",
                  path: "/api/ongoing",
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
    "/api/complete": {
      get: {
        tags: ["Anime"],
        summary: "Get completed anime list",
        description:
          "Retrieves a paginated list of completed anime. Each page contains up to 50 anime entries.",
        operationId: "getComplete",
        parameters: [
          {
            $ref: "#/components/parameters/PageParam",
          },
        ],
        responses: {
          "200": {
            description: "Successfully retrieved completed anime list",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/CompleteResponse",
                },
                example: {
                  success: true,
                  statusCode: 200,
                  message: "OK",
                  data: {
                    anime: [
                      {
                        title: "Dandadan",
                        slug: "dandadan-sub-indo",
                        poster:
                          "https://otakudesu.best/wp-content/uploads/2024/10/Dandadan.jpg",
                        totalEpisode: "12 Episode",
                        rating: "8.50",
                        releaseDate: "20 Nov",
                      },
                    ],
                    pagination: {
                      currentPage: 1,
                      totalPages: 100,
                      itemsPerPage: 50,
                      totalItems: 5000,
                      hasPrevPage: false,
                      hasNextPage: true,
                      prevPage: null,
                      nextPage: 2,
                    },
                  },
                  timestamp: "2025-12-06T09:00:00.000Z",
                  path: "/api/complete",
                  responseTime: "280ms",
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
                        {
                          title: "Attack on Titan",
                          slug: "attack-on-titan-sub-indo",
                        },
                        {
                          title: "Akame ga Kill!",
                          slug: "akame-ga-kill-sub-indo",
                        },
                      ],
                      B: [
                        { title: "Bleach", slug: "bleach-sub-indo" },
                        { title: "Blue Lock", slug: "blue-lock-sub-indo" },
                      ],
                    },
                  },
                  timestamp: "2025-12-06T09:00:00.000Z",
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
          "Retrieves detailed information about a specific anime including synopsis, info (score, studio, duration, etc.), genres, and complete episode list.",
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
            example: "punch-man-s3-sub-indo",
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
                    title: "One Punch Man Season 3",
                    japanese: "ワンパンマン Season 3",
                    score: "7.14",
                    producer: "Bandai Namco Pictures",
                    type: "TV",
                    status: "Ongoing",
                    totalEpisode: "Unknown",
                    duration: "24 min per ep",
                    releaseDate: "Oct 2025",
                    studio: "J.C.Staff",
                    genres: [
                      "Action",
                      "Comedy",
                      "Parody",
                      "Sci-Fi",
                      "Super Power",
                    ],
                    synopsis:
                      "The seemingly ordinary and unimpressive Saitama has a rather unique hobby: being a hero...",
                    poster:
                      "https://otakudesu.best/wp-content/uploads/2025/10/One-Punch-Man-Season-3.jpg",
                    episodes: [
                      {
                        episode: "8",
                        slug: "onpm-s3-episode-8-sub-indo",
                        date: "05 Dec 2025",
                      },
                      {
                        episode: "7",
                        slug: "onpm-s3-episode-7-sub-indo",
                        date: "28 Nov 2025",
                      },
                    ],
                  },
                  timestamp: "2025-12-06T09:00:00.000Z",
                  path: "/api/anime/punch-man-s3-sub-indo",
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
    "/api/episode/{slug}": {
      get: {
        tags: ["Episode"],
        summary: "Get episode details",
        description:
          "Retrieves detailed information about a specific episode including streaming servers (with multiple quality options) and download links (with multiple providers per resolution).",
        operationId: "getEpisodeDetail",
        parameters: [
          {
            name: "slug",
            in: "path",
            required: true,
            description: "Unique episode identifier (URL slug)",
            schema: {
              type: "string",
            },
            example: "onpm-s3-episode-8-sub-indo",
          },
        ],
        responses: {
          "200": {
            description: "Successfully retrieved episode details",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/EpisodeDetailResponse",
                },
                example: {
                  success: true,
                  statusCode: 200,
                  message: "OK",
                  data: {
                    title:
                      "One Punch Man Season 3 Episode 8 Subtitle Indonesia",
                    anime: {
                      title: "One Punch Man Season 3",
                      slug: "punch-man-s3-sub-indo",
                    },
                    prevEpisode: "onpm-s3-episode-7-sub-indo",
                    nextEpisode: null,
                    streamingUrl: "https://player.example.com/embed/xxx",
                    streamingServers: [
                      {
                        quality: "360p",
                        servers: [
                          {
                            provider: "Streamwish",
                            dataContent:
                              "eyJpZCI6MTkwNDQzLCJpIjowLCJxIjoiMzYwcCJ9",
                          },
                          {
                            provider: "Doodstream",
                            dataContent:
                              "eyJpZCI6MTkwNDQzLCJpIjoxLCJxIjoiMzYwcCJ9",
                          },
                        ],
                      },
                      {
                        quality: "480p",
                        servers: [
                          {
                            provider: "Streamwish",
                            dataContent:
                              "eyJpZCI6MTkwNDQzLCJpIjowLCJxIjoiNDgwcCJ9",
                            isDefault: true,
                          },
                        ],
                      },
                      {
                        quality: "720p",
                        servers: [
                          {
                            provider: "Streamwish",
                            dataContent:
                              "eyJpZCI6MTkwNDQzLCJpIjowLCJxIjoiNzIwcCJ9",
                          },
                        ],
                      },
                    ],
                    downloadLinks: [
                      {
                        resolution: "MP4 360p",
                        links: [
                          { provider: "Mega", url: "https://mega.nz/file/xxx" },
                          {
                            provider: "GDrive",
                            url: "https://drive.google.com/file/xxx",
                          },
                        ],
                      },
                      {
                        resolution: "MP4 480p",
                        links: [
                          { provider: "Mega", url: "https://mega.nz/file/yyy" },
                          {
                            provider: "GDrive",
                            url: "https://drive.google.com/file/yyy",
                          },
                        ],
                      },
                      {
                        resolution: "MP4 720p",
                        links: [
                          { provider: "Mega", url: "https://mega.nz/file/zzz" },
                          {
                            provider: "GDrive",
                            url: "https://drive.google.com/file/zzz",
                          },
                        ],
                      },
                    ],
                  },
                  timestamp: "2025-12-06T09:00:00.000Z",
                  path: "/api/episode/onpm-s3-episode-8-sub-indo",
                  responseTime: "350ms",
                },
              },
            },
          },
          "404": {
            $ref: "#/components/responses/EpisodeNotFound",
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
                      { name: "Horror", slug: "horror" },
                      { name: "Isekai", slug: "isekai" },
                      { name: "Romance", slug: "romance" },
                      { name: "Sci-Fi", slug: "sci-fi" },
                      { name: "Slice of Life", slug: "slice-of-life" },
                    ],
                  },
                  timestamp: "2025-12-06T09:00:00.000Z",
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
                        title: "One Punch Man Season 3",
                        slug: "punch-man-s3-sub-indo",
                        poster:
                          "https://otakudesu.best/wp-content/uploads/2025/10/One-Punch-Man-Season-3.jpg",
                        rating: "7.14",
                      },
                      {
                        title: "Jujutsu Kaisen",
                        slug: "jujutsu-kaisen-sub-indo",
                        poster:
                          "https://otakudesu.best/wp-content/uploads/2020/10/Jujutsu-Kaisen.jpg",
                        rating: "8.60",
                      },
                    ],
                    pagination: {
                      currentPage: 1,
                      totalPages: 50,
                      itemsPerPage: 50,
                      totalItems: 2500,
                      hasPrevPage: false,
                      hasNextPage: true,
                      prevPage: null,
                      nextPage: 2,
                    },
                  },
                  timestamp: "2025-12-06T09:00:00.000Z",
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
    "/api/schedule": {
      get: {
        tags: ["Schedule"],
        summary: "Get weekly release schedule",
        description:
          "Retrieves the anime release schedule organized by day of the week (Monday to Sunday).",
        operationId: "getSchedule",
        responses: {
          "200": {
            description: "Successfully retrieved schedule",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ScheduleResponse",
                },
                example: {
                  success: true,
                  statusCode: 200,
                  message: "OK",
                  data: {
                    schedule: [
                      {
                        day: "Senin",
                        anime: [
                          {
                            title: "Blue Lock Season 2",
                            slug: "blue-lock-s2-sub-indo",
                          },
                          {
                            title: "Dragon Ball Daima",
                            slug: "dragon-ball-daima-sub-indo",
                          },
                        ],
                      },
                      {
                        day: "Selasa",
                        anime: [
                          {
                            title: "Fairy Tail: 100 Years Quest",
                            slug: "fairy-tail-100-years-quest-sub-indo",
                          },
                        ],
                      },
                      {
                        day: "Rabu",
                        anime: [
                          {
                            title: "Re:Zero Season 3",
                            slug: "re-zero-s3-sub-indo",
                          },
                        ],
                      },
                      {
                        day: "Kamis",
                        anime: [
                          {
                            title: "One Punch Man Season 3",
                            slug: "punch-man-s3-sub-indo",
                          },
                        ],
                      },
                      {
                        day: "Jumat",
                        anime: [
                          {
                            title: "Bleach: TYBW",
                            slug: "bleach-tybw-sub-indo",
                          },
                        ],
                      },
                      {
                        day: "Sabtu",
                        anime: [
                          { title: "Dan Da Dan", slug: "dandadan-sub-indo" },
                        ],
                      },
                      {
                        day: "Minggu",
                        anime: [
                          {
                            title: "MF Ghost Season 2",
                            slug: "mf-ghost-s2-sub-indo",
                          },
                        ],
                      },
                    ],
                  },
                  timestamp: "2025-12-06T09:00:00.000Z",
                  path: "/api/schedule",
                  responseTime: "240ms",
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
        description:
          "Search for anime by keyword. Returns anime matching the search query.",
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
            example: "one punch",
          },
        ],
        responses: {
          "200": {
            description: "Successfully retrieved search results",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/SearchResponse",
                },
                example: {
                  success: true,
                  statusCode: 200,
                  message: "OK",
                  data: {
                    anime: [
                      {
                        title: "One Punch Man Season 3 Subtitle Indonesia",
                        slug: "punch-man-s3-sub-indo",
                        poster:
                          "https://otakudesu.best/wp-content/uploads/2025/10/One-Punch-Man-Season-3.jpg",
                        rating: "7.14",
                      },
                      {
                        title: "One Punch Man Season 2 Subtitle Indonesia",
                        slug: "punch-man-season-2-subtitle-indonesia",
                        poster:
                          "https://otakudesu.best/wp-content/uploads/2019/04/One-Punch-Man-Season-2-Sub-Indo.jpg",
                        rating: "7.67",
                      },
                      {
                        title: "One Punch Man BD Subtitle Indonesia",
                        slug: "one-punch-sub-indo",
                        poster:
                          "https://otakudesu.best/wp-content/uploads/2019/02/One-Punch-Man-Sub-Indo.jpg",
                        rating: "8.75",
                      },
                    ],
                  },
                  timestamp: "2025-12-06T09:00:00.000Z",
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
    "/api/resolve-streaming": {
      post: {
        tags: ["Streaming"],
        summary: "Resolve streaming URL (POST)",
        description:
          "Resolves the streaming player URL from the base64 encoded data-content found in streamingServers. Use this endpoint to get the actual video player iframe URL.",
        operationId: "resolveStreamingPost",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["dataContent"],
                properties: {
                  dataContent: {
                    type: "string",
                    description:
                      "Base64 encoded data-content from streamingServers response",
                    example: "eyJpZCI6MTkwNDQzLCJpIjowLCJxIjoiNDgwcCJ9",
                  },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Successfully resolved streaming URL",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ResolveStreamingResponse",
                },
                example: {
                  success: true,
                  statusCode: 200,
                  message: "OK",
                  data: {
                    url: "https://player.streamwish.com/embed/xxxxx",
                    html: '<iframe src="https://player.streamwish.com/embed/xxxxx" frameborder="0" allowfullscreen></iframe>',
                  },
                  timestamp: "2025-12-06T09:00:00.000Z",
                  path: "/api/resolve-streaming",
                  responseTime: "650ms",
                },
              },
            },
          },
          "400": {
            $ref: "#/components/responses/BadRequest",
          },
          "502": {
            $ref: "#/components/responses/StreamingError",
          },
        },
      },
    },
    "/api/resolve-streaming/{dataContent}": {
      get: {
        tags: ["Streaming"],
        summary: "Resolve streaming URL (GET)",
        description:
          "Alternative GET endpoint for resolving streaming player URL. Useful for simple requests without a JSON body.",
        operationId: "resolveStreamingGet",
        parameters: [
          {
            name: "dataContent",
            in: "path",
            required: true,
            description:
              "Base64 encoded data-content from streamingServers response",
            schema: {
              type: "string",
            },
            example: "eyJpZCI6MTkwNDQzLCJpIjowLCJxIjoiNDgwcCJ9",
          },
        ],
        responses: {
          "200": {
            description: "Successfully resolved streaming URL",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ResolveStreamingResponse",
                },
                example: {
                  success: true,
                  statusCode: 200,
                  message: "OK",
                  data: {
                    url: "https://player.streamwish.com/embed/xxxxx",
                    html: '<iframe src="https://player.streamwish.com/embed/xxxxx" frameborder="0" allowfullscreen></iframe>',
                  },
                  timestamp: "2025-12-06T09:00:00.000Z",
                  path: "/api/resolve-streaming/eyJpZCI6MTkwNDQzLCJpIjowLCJxIjoiNDgwcCJ9",
                  responseTime: "620ms",
                },
              },
            },
          },
          "502": {
            $ref: "#/components/responses/StreamingError",
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
            example: "One Punch Man Season 3",
          },
          slug: {
            type: "string",
            description: "URL-friendly identifier",
            example: "punch-man-s3-sub-indo",
          },
          poster: {
            type: "string",
            format: "uri",
            description: "Poster image URL",
            example:
              "https://otakudesu.best/wp-content/uploads/2025/10/One-Punch-Man-Season-3.jpg",
          },
          episode: {
            type: "string",
            description: "Latest episode number (for ongoing)",
            example: "8",
          },
          rating: {
            type: "string",
            description: "Anime rating score",
            example: "7.14",
          },
          releaseDay: {
            type: "string",
            description: "Day of release",
            example: "Thursday",
          },
          releaseDate: {
            type: "string",
            description: "Latest release date",
            example: "05 Dec",
          },
          totalEpisode: {
            type: "string",
            description: "Total episodes (for completed)",
            example: "12 Episode",
          },
        },
        required: ["title", "slug", "poster"],
      },
      AnimeDetail: {
        type: "object",
        description: "Detailed anime information",
        properties: {
          title: { type: "string", example: "One Punch Man Season 3" },
          japanese: { type: "string", example: "ワンパンマン Season 3" },
          score: { type: "string", example: "7.14" },
          producer: { type: "string", example: "Bandai Namco Pictures" },
          type: { type: "string", example: "TV" },
          status: { type: "string", example: "Ongoing" },
          totalEpisode: { type: "string", example: "Unknown" },
          duration: { type: "string", example: "24 min per ep" },
          releaseDate: { type: "string", example: "Oct 2025" },
          studio: { type: "string", example: "J.C.Staff" },
          genres: {
            type: "array",
            items: { type: "string" },
            example: ["Action", "Comedy", "Parody"],
          },
          synopsis: { type: "string", example: "The seemingly ordinary..." },
          poster: { type: "string", format: "uri" },
          episodes: {
            type: "array",
            items: { $ref: "#/components/schemas/EpisodeListItem" },
          },
        },
      },
      EpisodeListItem: {
        type: "object",
        properties: {
          episode: { type: "string", example: "8" },
          slug: { type: "string", example: "onpm-s3-episode-8-sub-indo" },
          date: { type: "string", example: "05 Dec 2025" },
        },
        required: ["episode", "slug", "date"],
      },
      EpisodeDetail: {
        type: "object",
        description:
          "Detailed episode information with streaming and download links",
        properties: {
          title: { type: "string" },
          anime: {
            type: "object",
            properties: {
              title: { type: "string" },
              slug: { type: "string" },
            },
          },
          prevEpisode: { type: "string", nullable: true },
          nextEpisode: { type: "string", nullable: true },
          streamingUrl: { type: "string", format: "uri" },
          streamingServers: {
            type: "array",
            items: { $ref: "#/components/schemas/StreamingServer" },
          },
          downloadLinks: {
            type: "array",
            items: { $ref: "#/components/schemas/DownloadSection" },
          },
        },
      },
      StreamingServer: {
        type: "object",
        properties: {
          quality: { type: "string", example: "480p" },
          servers: {
            type: "array",
            items: {
              type: "object",
              properties: {
                provider: { type: "string", example: "Streamwish" },
                dataContent: {
                  type: "string",
                  example: "eyJpZCI6MTkwNDQzLCJpIjowLCJxIjoiNDgwcCJ9",
                },
                isDefault: { type: "boolean" },
              },
            },
          },
        },
      },
      DownloadSection: {
        type: "object",
        properties: {
          resolution: { type: "string", example: "MP4 480p" },
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
      Pagination: {
        type: "object",
        description: "Pagination metadata",
        properties: {
          currentPage: { type: "integer", example: 1 },
          totalPages: { type: "integer", example: 50 },
          itemsPerPage: { type: "integer", example: 50 },
          totalItems: { type: "integer", nullable: true, example: 2500 },
          hasPrevPage: { type: "boolean", example: false },
          hasNextPage: { type: "boolean", example: true },
          prevPage: { type: "integer", nullable: true, example: null },
          nextPage: { type: "integer", nullable: true, example: 2 },
        },
      },
      ScheduleDay: {
        type: "object",
        properties: {
          day: { type: "string", example: "Senin" },
          anime: {
            type: "array",
            items: {
              type: "object",
              properties: {
                title: { type: "string" },
                slug: { type: "string" },
              },
            },
          },
        },
      },
      AnimeListItem: {
        type: "object",
        properties: {
          title: { type: "string", example: "Attack on Titan" },
          slug: { type: "string", example: "attack-on-titan-sub-indo" },
        },
        required: ["title", "slug"],
      },
      // Response wrappers
      HomeResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: true },
          statusCode: { type: "integer", example: 200 },
          message: { type: "string", example: "OK" },
          data: {
            type: "object",
            properties: {
              ongoing: {
                type: "array",
                items: { $ref: "#/components/schemas/AnimeCard" },
              },
              complete: {
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
      OngoingResponse: {
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
      CompleteResponse: {
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
      EpisodeDetailResponse: {
        type: "object",
        properties: {
          success: { type: "boolean" },
          statusCode: { type: "integer" },
          message: { type: "string" },
          data: { $ref: "#/components/schemas/EpisodeDetail" },
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
      ScheduleResponse: {
        type: "object",
        properties: {
          success: { type: "boolean" },
          statusCode: { type: "integer" },
          message: { type: "string" },
          data: {
            type: "object",
            properties: {
              schedule: {
                type: "array",
                items: { $ref: "#/components/schemas/ScheduleDay" },
              },
            },
          },
          timestamp: { type: "string", format: "date-time" },
          path: { type: "string" },
          responseTime: { type: "string" },
        },
      },
      SearchResponse: {
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
            },
          },
          timestamp: { type: "string", format: "date-time" },
          path: { type: "string" },
          responseTime: { type: "string" },
        },
      },
      ResolveStreamingResponse: {
        type: "object",
        properties: {
          success: { type: "boolean" },
          statusCode: { type: "integer" },
          message: { type: "string" },
          data: {
            type: "object",
            properties: {
              url: {
                type: "string",
                format: "uri",
                description: "Direct streaming player URL",
              },
              html: {
                type: "string",
                description: "HTML iframe embed code",
              },
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
              timestamp: "2025-12-06T09:00:00.000Z",
              path: "/api/anime/xxx",
            },
          },
        },
      },
      EpisodeNotFound: {
        description: "Episode not found",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/ErrorResponse" },
            example: {
              success: false,
              statusCode: 404,
              message: "Episode dengan slug 'xxx' tidak ditemukan",
              error: { code: "EPISODE_NOT_FOUND" },
              timestamp: "2025-12-06T09:00:00.000Z",
              path: "/api/episode/xxx",
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
              message: "Failed to fetch data from https://otakudesu.best",
              error: { code: "UPSTREAM_ERROR" },
              timestamp: "2025-12-06T09:00:00.000Z",
              path: "/api/home",
            },
          },
        },
      },
      StreamingError: {
        description: "Failed to resolve streaming URL",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/ErrorResponse" },
            example: {
              success: false,
              statusCode: 502,
              message: "Failed to resolve streaming URL",
              error: { code: "UPSTREAM_ERROR" },
              timestamp: "2025-12-06T09:00:00.000Z",
              path: "/api/resolve-streaming",
            },
          },
        },
      },
      BadRequest: {
        description: "Invalid request parameters",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/ErrorResponse" },
            example: {
              success: false,
              statusCode: 400,
              message: "dataContent is required",
              error: { code: "BAD_REQUEST" },
              timestamp: "2025-12-06T09:00:00.000Z",
              path: "/api/resolve-streaming",
            },
          },
        },
      },
    },
  },
};
