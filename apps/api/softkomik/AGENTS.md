# AGENTS.md

## Build/Test Commands
- `pnpm dev` - Start development server (Cloudflare Workers via Wrangler)
- `pnpm deploy` - Deploy to Cloudflare Workers
- `pnpm cf-typegen` - Generate Cloudflare bindings types

## Code Style
- **Formatting**: Tabs for indentation, no semicolons, single quotes
- **Types**: TypeScript strict mode, ESNext target
- **Imports**: ES modules only (`import`/`export`), no CommonJS
- **Naming**: camelCase for variables/functions, PascalCase for types/interfaces
- **Comments**: Avoid comments - keep code self-documenting

## Framework & Libraries
- **Runtime**: Cloudflare Workers
- **Framework**: Hono with Swagger UI (`@hono/swagger-ui`)
- **OpenAPI**: Inline spec definition in `src/index.ts`

## Error Handling
- Custom error handler returning `{ success: false, error: string }`
- Return 404 for not found resources
- Return 400 for invalid parameters (e.g., invalid type)

## Project Structure
- `src/index.ts` - API routes, OpenAPI spec, and handlers
- `src/modules/index.ts` - Module exports
- `src/modules/browse.ts` - Browse by type/genre scrapers
- `src/modules/chapters.ts` - Chapter scraping functions
- `src/modules/comics.ts` - Comic list/detail scrapers
- `src/modules/home.ts` - Homepage scrapers
- `src/modules/http.ts` - HTTP fetch utilities
- `src/modules/constants.ts` - Constants (BASE_URL, etc.)
- `src/modules/types.ts` - TypeScript interfaces
- `src/modules/utils.ts` - Utility functions

## API Endpoints
- `GET /api/home/new` - Get new comics
- `GET /api/home/latest` - Get latest updates
- `GET /api/comics` - List comics with pagination and search
- `GET /api/comics/{slug}` - Get comic detail
- `GET /api/comics/{slug}/chapters` - Get chapter list
- `GET /api/comics/{slug}/chapter/{chapter}` - Get chapter images
- `GET /api/genres` - List all genres
- `GET /api/type/{type}` - Browse by type (manga, manhwa, manhua)
- `GET /api/genre/{genre}` - Browse by genre
- `GET /docs` - Swagger UI documentation
