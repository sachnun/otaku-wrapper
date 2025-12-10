# AGENTS.md

## Build/Test Commands
- `pnpm dev` - Start development server (Cloudflare Workers via Wrangler)
- `pnpm deploy` - Deploy to Cloudflare Workers
- `pnpm cf-typegen` - Generate Cloudflare bindings types

## Code Style
- **Formatting**: 2 spaces for indentation, semicolons, double quotes
- **Types**: TypeScript strict mode, ESNext target
- **Imports**: ES modules only (`import`/`export`), no CommonJS
- **Naming**: camelCase for variables/functions, PascalCase for types/interfaces
- **Comments**: Avoid comments - keep code self-documenting

## Framework & Libraries
- **Runtime**: Cloudflare Workers
- **Framework**: Hono with Swagger UI (`@hono/swagger-ui`)
- **Scraping**: Cheerio for HTML parsing
- **OpenAPI**: Manual spec definition in `src/openapi.ts`

## Error Handling
- Custom error handler with structured ApiErrorResponse
- Error codes mapped by HTTP status (400, 404, 502, 504, 429, 401, 403)
- Success responses wrapped in ApiResponse with metadata (timestamp, responseTime, path)

## Project Structure
- `src/index.ts` - API routes and handlers
- `src/openapi.ts` - OpenAPI specification
- `src/services/kusonime.service.ts` - Scraping service
- `src/types/index.ts` - TypeScript types and interfaces

## API Endpoints
- `GET /api/home` - Get homepage data (latest + recommendations)
- `GET /api/latest` - Get latest anime (paginated)
- `GET /api/anime-list` - Get full anime list (A-Z)
- `GET /api/anime/{slug}` - Get anime detail with download links
- `GET /api/genres` - List all genres
- `GET /api/genres/{genre}` - Get anime by genre (paginated)
- `GET /api/seasons` - List all seasons
- `GET /api/seasons/{season}` - Get anime by season (paginated)
- `GET /api/search` - Search anime (paginated)
- `GET /docs` - Swagger UI documentation
