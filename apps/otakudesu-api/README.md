# Otakudesu API

[![Deploy to Cloudflare Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/YOUR_USERNAME/otakudesu-api)

REST API for scraping anime data from Otakudesu. Built with [Hono](https://hono.dev/) and deployed to Cloudflare Workers.

## Features

- Ongoing and completed anime listings
- Detailed anime and episode information
- Streaming video player URL resolution
- Multi-resolution download links
- Anime search functionality
- Genre-based filtering
- Weekly release schedule

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

The server will start at `http://localhost:8787`. API documentation is available at `/docs`.

## Deployment

### Option 1: Deploy Button

Click the "Deploy to Cloudflare Workers" button above.

### Option 2: Manual Deploy

```bash
# Login to Cloudflare (first time only)
npx wrangler login

# Deploy to Cloudflare Workers
npm run deploy
```

## Documentation

Interactive API documentation (Swagger UI) is available at `/docs` endpoint.

## Tech Stack

- **Runtime**: Cloudflare Workers
- **Framework**: Hono
- **Parser**: Cheerio

## License

MIT
