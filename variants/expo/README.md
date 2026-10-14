# starter

Expo SDK 57 (Router, TypeScript) + NativeWind v4 (Tailwind v3) + react-native-reusables-style UI
components + lucide icons + i18next (en, es-CO).

## Setup

```bash
cp .env.example .env
pnpm install
pnpm start        # press w for web, i / a for simulators
```

Needs the backend running at `EXPO_PUBLIC_API_URL` (default `http://localhost:8000`).

## Theming

All colors live in **`src/global.css`** as HSL channels (`--primary: 208 86% 53%`), with dark values in
the `prefers-color-scheme` block. `tailwind.config.js` maps them to classes: `bg-background`,
`text-muted-foreground`, `border-border`, `bg-primary`, `text-success`, and so on. The token names
match shadcn/ui and the other UI variants.

## UI components and icons

`src/components/ui/` holds shadcn-style building blocks (`Button`, `Card*`, `Text`, `Icon`) built on
`cva` + `tailwind-merge`. Use icons from `lucide-react-native` through `<Icon as={Activity} />`.

## i18n

Translations are typed TypeScript objects in `src/i18n/locales/` (`en.ts`, `es-CO.ts`); the Spanish
file must match the English shape. Use `const { t } = useTranslation()`. The language follows the
device (any Spanish resolves to `es-CO`, otherwise English).

## Commands

```bash
pnpm typecheck
pnpm lint
pnpm test
pnpm export:web
```

## Notes

- NativeWind v4 pins Tailwind to v3. The upgrade path is NativeWind v5 + Tailwind v4.
- Adding a native module needs a development build; Expo Go only ships its bundled modules.
- The API client (`src/services/api.ts`) converts snake_case responses to camelCase and requests back
  to snake_case; components never convert casing.

## Analytics

`src/services/analytics.ts` creates the PostHog client (screens via `useScreenTracking`, uncaught
errors and rejections autocaptured). Wrap a mutation with `withEvent("event_name", mutate, toProps)`
so the event fires only after it succeeds. `EXPO_PUBLIC_POSTHOG_PROJECT_TOKEN` unset = analytics off.

## Deployment

- **Web:** after CI passes on `main`, **Deploy production web** exports the static site with the
  Infisical Prod › `/app` values and publishes it to Cloudflare Pages.
- **Android / iOS:** run **Release native production app** and pick the store. It mirrors the
  `EXPO_PUBLIC_*` Infisical values into the EAS `production` environment, builds with EAS and submits
  (Android: internal track, draft). Android targets API 36 via `expo-build-properties` in `app.json`.

First-time setup (Infisical, EAS project, Play Console): [Production setup](#production-setup).
