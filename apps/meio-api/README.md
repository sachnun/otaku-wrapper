# Meio Novels API

A web scraper API for [meionovels.com](https://meionovels.com) built with Hono on Cloudflare Workers.

## Features

- Novel listing with pagination
- Novel details and chapter list
- Chapter content scraping
- Search functionality
- Latest updates
- Genre filtering (40+ genres)
- In-memory caching with TTL
- OpenAPI/Swagger documentation

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Swagger UI documentation |
| GET | `/novels` | List all novels (paginated) |
| GET | `/novels/{slug}` | Get novel details |
| GET | `/novels/{slug}/chapters` | Get chapter list |
| GET | `/novels/{slug}/chapters/{chapter}` | Get chapter content |
| GET | `/search?q={query}` | Search novels |
| GET | `/latest` | Get latest updates |
| GET | `/genres` | List all genres |
| GET | `/genres/{genre}` | Get novels by genre (paginated) |

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Deploy to Cloudflare Workers
npm run deploy
```

## Tech Stack

- [Hono](https://hono.dev) - Web framework
- [@hono/zod-openapi](https://github.com/honojs/middleware/tree/main/packages/zod-openapi) - OpenAPI with Zod validation
- [Cloudflare Workers](https://workers.cloudflare.com) - Serverless runtime
- [Vitest](https://vitest.dev) - Testing framework

## License

MIT
