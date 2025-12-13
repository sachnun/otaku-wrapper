# Otaku Hub API

Unified API gateway that combines all otaku-wrapper APIs into a single Cloudflare Worker endpoint.

## Endpoints

| Prefix | Source | Description |
|--------|--------|-------------|
| `/api/kusonime/*` | [kusonime.com](https://kusonime.com) | Anime batch downloads |
| `/api/meio/*` | [meionovels.com](https://meionovels.com) | Light novels |
| `/api/otakudesu/*` | [otakudesu.cloud](https://otakudesu.cloud) | Anime streaming |
| `/api/softkomik/*` | [softkomik.com](https://softkomik.com) | Manga/manhwa/manhua |

## Documentation

- **Swagger UI**: `/docs`
- **OpenAPI Spec**: `/openapi.json`

## Development

```bash
pnpm dev
```

Runs locally on `http://localhost:8780`

## Deployment

```bash
pnpm deploy
```
