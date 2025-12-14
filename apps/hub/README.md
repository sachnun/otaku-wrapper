# Otaku Hub API

Unified API gateway that combines all otaku-wrapper APIs into a single Cloudflare Worker endpoint.

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

### Deploy via CLI

From root project:

```bash
pnpm --filter @otaku-wrapper/hub run deploy
```

Or from `apps/hub` folder:

```bash
pnpm run deploy
```

### Deploy via Dashboard (Git Integration)

1. Open [Cloudflare Dashboard](https://dash.cloudflare.com/) > Workers & Pages
2. Click **Create** > **Import a repository**
3. Connect your GitHub/GitLab and select the repository
4. Configure build settings:
   - **Root directory**: (leave empty)
   - **Build command**: (leave empty)
   - **Deploy command**: `pnpm --filter @otaku-wrapper/hub run deploy`
5. Set **Build watch paths** to trigger rebuild on changes:
   ```
   apps/hub/**
   apps/api/**
   packages/core/**
   pnpm-lock.yaml
   ```
6. Click **Save and Deploy**

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
