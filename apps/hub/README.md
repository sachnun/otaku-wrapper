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
pnpm --filter @otaku-wrapper/hub deploy
```

Or from `apps/hub` folder:

```bash
pnpm deploy
```

### Deploy via Dashboard (Manual)

1. Build the worker locally:
   ```bash
   pnpm build
   ```
2. Open [Cloudflare Dashboard](https://dash.cloudflare.com/) > Workers & Pages
3. Click **Create** > **Create Worker**
4. Name your worker (e.g., `otaku-hub`) and click **Deploy**
5. Go to worker **Settings** > **Build** > **Edit Build Configuration**
6. Set **Build command** to `pnpm install && pnpm build`
7. Alternatively, use **Quick Edit** to paste the bundled code from `dist/` folder

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
