# nomadicode-ui-starter

Frontend template with swappable variants. Click **Use this template**, clone, then pick one:

```bash
./scripts/init.sh expo my-project    # Expo Router + NativeWind
./scripts/init.sh nuxt my-project    # Nuxt 4 + shadcn-vue
./scripts/init.sh next my-project    # Next.js 16 + shadcn/ui
```

The script keeps the chosen variant at the repo root, deletes the others and itself, and renames
`starter` to your project name. Every variant ships the same things:

- shadcn-style components and **lucide** icons
- **English and Colombian Spanish (`es-CO`)** i18n
- **One theme file** with light and dark tokens that use shadcn's names (`primary`, `muted-foreground`,
  `success`, ...), so restyling works the same everywhere
- A typed axios client that converts snake_case API responses to camelCase
- An API health card that talks to `GET /api/health/` from [`nomadicode-api-starter`](https://github.com/Nomadicode/nomadicode-api-starter)

| Variant | Stack                                                          | Theme file                    |
| ------- | -------------------------------------------------------------- | ----------------------------- |
| `expo`  | Expo Router, NativeWind v4 (Tailwind v3), react-native-reusables-style UI | `src/global.css`  |
| `nuxt`  | Nuxt 4, Tailwind v4, shadcn-vue, Pinia, `@nuxtjs/i18n`         | `app/assets/css/tailwind.css` |
| `next`  | Next.js 16, Tailwind v4, shadcn/ui, `next-intl`                | `app/globals.css`             |

Add a variant by creating `variants/<name>/` as a complete project root and adding it to the matrix in
`.github/workflows/template-ci.yml`.
