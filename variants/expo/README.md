# starter

Expo (Router, TypeScript) + NativeWind v4 (Tailwind v3) + react-native-reusables-style UI
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
pnpm exec tsc --noEmit
pnpm exec expo lint
pnpm exec expo export --platform web
```

## Notes

- NativeWind v4 pins Tailwind to v3. The upgrade path is NativeWind v5 + Tailwind v4.
- Adding a native module needs a development build; Expo Go only ships its bundled modules.
- The API client (`src/services/api.ts`) converts snake_case responses to camelCase and requests back
  to snake_case; components never convert casing.
