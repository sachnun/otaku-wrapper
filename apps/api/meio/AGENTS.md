# AGENTS.md

## Build/Test Commands
- `npm run dev` - Start development server (Cloudflare Workers via Wrangler)
- `npm run deploy` - Deploy to Cloudflare Workers
- `npm test` - Run all tests
- `npm test -- src/index.test.ts -t "test name"` - Run a single test by name
- `npm run cf-typegen` - Generate Cloudflare bindings types

## Code Style
- **Formatting**: Tabs for indentation, no semicolons, single quotes, no trailing commas
- **Types**: TypeScript strict mode, ESNext target, `any` allowed
- **Imports**: ES modules only (`import`/`export`), no CommonJS
- **Naming**: camelCase for variables/functions, PascalCase for types/interfaces
- **Framework**: Hono on Cloudflare Workers with OpenAPI (zod-openapi)

## Error Handling
- Return appropriate HTTP status codes via Hono context (`c.json({ error }, 404)`)
- Use Zod schemas for request/response validation
- Scraper functions return `null` for not found, caller handles 404

## Project Structure
- `src/index.ts` - API routes and handlers
- `src/scraper.ts` - Web scraping functions with in-memory caching
- `src/scraper.mock.ts` - Mock data for unit tests
