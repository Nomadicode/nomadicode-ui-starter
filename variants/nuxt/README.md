# starter

Nuxt 4 + Tailwind v4 + shadcn-vue (Reka UI) + lucide icons + `@nuxtjs/i18n` (en, es-CO) + Pinia.

## Setup

```bash
cp .env.example .env
pnpm install
pnpm dev
```

Needs the backend running at `NUXT_PUBLIC_API_URL` (default `http://localhost:8000`).

## Theming

All colors live in **`app/assets/css/tailwind.css`**: light values in `:root`, dark values in the
`prefers-color-scheme` block, both as `oklch()`. The token names match shadcn/ui and the other UI variants (`--primary`, `--muted-foreground`, `--success`, ...). Add components with
`pnpm dlx shadcn-vue@latest add <component>`; they land in `app/components/ui/`.

## i18n

Messages are in `i18n/locales/en.json` and `es-CO.json`. Use `const { t } = useI18n()`. The locale
comes from the `i18n_locale` cookie, then the browser language (any Spanish resolves to `es-CO`).

## Structure

- `app/services/`: typed API functions; `api.ts` converts snake_case <-> camelCase.
- `app/stores/`: Pinia stores. `app/composables/useApi.ts`: the shared axios client.

## Commands

```bash
pnpm typecheck
pnpm lint
pnpm build
```
