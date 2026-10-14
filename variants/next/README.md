# starter

Next.js 16 (App Router) + Tailwind v4 + shadcn/ui (Radix) + lucide icons + `next-intl` (en, es-CO).

## Setup

```bash
cp .env.example .env
pnpm install
pnpm dev
```

Needs the backend running at `NEXT_PUBLIC_API_URL` (default `http://localhost:8000`).

## Theming

All colors live in **`app/globals.css`**: light values in `:root`, dark values in the
`prefers-color-scheme` block, both as `oklch()`. The token names match shadcn/ui and the other UI variants (`--primary`, `--muted-foreground`, `--success`, ...). Add components with
`pnpm dlx shadcn@latest add <component>`; they land in `components/ui/`.

## i18n

Messages are in `messages/en.json` and `es-CO.json` (typed through `global.d.ts`). Server components
use `useTranslations` / `getTranslations`; client components use `useTranslations` too. The locale
comes from the `NEXT_LOCALE` cookie, then `Accept-Language` (any Spanish resolves to `es-CO`), with no
URL prefix.

## Structure

- `services/`: typed API functions; `api.ts` converts snake_case <-> camelCase.
- `hooks/`: client hooks. `components/`: app components; `components/ui/`: shadcn.

## Commands

```bash
pnpm typecheck
pnpm lint
pnpm build
pnpm preview   # Worker build on workerd
```

Read `AGENTS.md` before letting an AI agent edit this variant: Next 16 differs from older versions.

## Analytics

`instrumentation-client.ts` starts PostHog in the browser (pageviews on every route change,
exceptions autocaptured). Import `posthog` from `posthog-js` in client components to capture events.
`NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` unset = analytics off.

## Deployment

Pages render on a Cloudflare Worker through [OpenNext](https://opennext.js.org/cloudflare)
(`wrangler.jsonc`, `open-next.config.ts`). After CI passes on `main`, **Deploy production web** builds
with the Infisical Prod › `/web` values and runs `pnpm run deploy`; Wrangler creates the Worker on the
first run. `pnpm preview` runs the Worker build locally. Next is held at 16.3.x until OpenNext
supports 16.4. First-time setup: [Production setup](#production-setup).
