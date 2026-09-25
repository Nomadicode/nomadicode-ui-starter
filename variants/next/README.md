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
```

Read `AGENTS.md` before letting an AI agent edit this variant: Next 16 differs from older versions.
