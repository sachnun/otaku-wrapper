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

## Deploy to Cloudflare Workers

### Prerequisites

1. [Cloudflare](https://dash.cloudflare.com/sign-up) account
2. [Node.js](https://nodejs.org/) v18+
3. [pnpm](https://pnpm.io/)

### Login to Cloudflare

```bash
npx wrangler login
```

This will open a browser for authentication.

### Deploy

From root project:

```bash
pnpm --filter @otaku-wrapper/hub deploy
```

Or from `apps/hub` folder:

```bash
pnpm deploy
```

After successful deployment, the worker URL will be displayed:

```
Published otaku-hub (x.xx sec)
  https://otaku-hub.<your-subdomain>.workers.dev
```

### Custom Domain (Optional)

1. Open [Cloudflare Dashboard](https://dash.cloudflare.com/) > Workers & Pages
2. Select `otaku-hub` worker
3. Go to **Settings** > **Domains & Routes**
4. Add custom domain
