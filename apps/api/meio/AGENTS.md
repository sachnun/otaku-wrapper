# AGENTS.md

## Build/Test Commands
- `pnpm dev` - Start development server (Cloudflare Workers via Wrangler)
- `pnpm deploy` - Deploy to Cloudflare Workers
- `pnpm test` - Run all tests with Vitest
- `pnpm test src/index.test.ts` - Run specific test file
- `pnpm cf-typegen` - Generate Cloudflare bindings types

## Code Style
- **Formatting**: Tabs for indentation, no semicolons, single quotes, no trailing commas
- **Types**: TypeScript strict mode, ESNext target
- **Imports**: ES modules only (`import`/`export`), no CommonJS
- **Naming**: camelCase for variables/functions, PascalCase for types/interfaces
- **Comments**: Avoid comments - keep code self-documenting

## Framework & Libraries
- **Runtime**: Cloudflare Workers
- **Framework**: Hono with OpenAPI (`@hono/zod-openapi`)
- **Validation**: Zod v4 for request/response schemas
- **Scraping**: node-html-parser
- **Testing**: Vitest

## Error Handling
- Return appropriate HTTP status codes via Hono context (`c.json({ error }, 404)`)
- Use Zod schemas for request/response validation
- Scraper functions return `null` for not found, caller handles 404

## Project Structure
- `src/index.ts` - API routes, OpenAPI schemas, and handlers
- `src/scraper.ts` - Web scraping functions with in-memory caching
- `src/scraper.mock.ts` - Mock data for unit tests
- `src/index.test.ts` - Unit tests

## API Endpoints
- `GET /novels` - List novels with pagination
- `GET /novels/latest` - Get latest updated novels
- `GET /novels/search` - Search novels
- `GET /novels/{slug}` - Get novel detail
- `GET /novels/{slug}/chapters` - Get chapter list
- `GET /novels/{slug}/{chapter}` - Read chapter content
- `GET /genres` - List all genres
- `GET /genres/{genre}` - Get novels by genre
- `GET /docs` - Swagger UI documentation
