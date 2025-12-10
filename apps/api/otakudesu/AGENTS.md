# AGENTS.md

## Build/Lint/Test Commands

- `npm run build` - Build the project
- `npm run lint` - Lint and auto-fix TypeScript files
- `npm test` - Run all unit tests
- `npm test -- path/to/file.spec.ts` - Run a single test file
- `npm test -- --testNamePattern="test name"` - Run tests matching pattern
- `npm run test:e2e` - Run end-to-end tests
- `npm run start:dev` - Start in development mode with watch

## Code Style Guidelines

- **Formatting**: Prettier with single quotes, trailing commas. Run `npm run format`
- **Imports**: External packages first (`@nestjs/*`), then internal (relative paths)
- **Naming**: PascalCase for classes, camelCase for methods/variables, kebab-case for files
- **Files**: Use type suffix pattern: `*.controller.ts`, `*.service.ts`, `*.module.ts`, `*.spec.ts`
- **Types**: TypeScript strict null checks enabled. `any` is allowed but discouraged
- **NestJS**: Use dependency injection via constructor, decorators for metadata
- **Tests**: Unit tests as `*.spec.ts` in `src/`, E2E as `*.e2e-spec.ts` in `test/`
- **Error handling**: Use NestJS built-in exception filters and HTTP exceptions
