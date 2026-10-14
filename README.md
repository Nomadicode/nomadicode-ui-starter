# nomadicode-ui-starter

Frontend template with swappable variants. Click **Use this template**, clone, then pick one:

```bash
./scripts/init.sh expo "My Project"    # Expo SDK 57 (Router) + NativeWind — web, Android, iOS
./scripts/init.sh nuxt "My Project"    # Nuxt 4 + shadcn-vue, statically generated
./scripts/init.sh next "My Project"    # Next.js 16 + shadcn/ui, server-rendered on Workers
```

The script:

1. keeps the chosen variant at the repo root, deletes the rest and itself, and renames `starter` to
   the project slug;
2. appends a **Production setup** checklist to the README for everything outside the code
   (nomadicode-infra, Infisical, GitHub, PostHog, EAS and the stores, Notion), from
   `scripts/setup-guide.md`;
3. registers the site in [nomadicode-infra](https://github.com/Nomadicode/nomadicode-infra) with its
   `scripts/add-project.sh` (a Cloudflare Pages project; Next.js needs none).

| Option | Purpose |
| --- | --- |
| `--repo <org/repo>` | GitHub repository; defaults to the `origin` remote |
| `--infra-dir <path>` | nomadicode-infra checkout; defaults to `$NOMADICODE_INFRA_DIR`. Without it the command to run there is printed |
| `--domain <hostname>` | Custom domain for the Pages project |
| `--apply` | Also create the cloud resources (Terraform plan + apply; refuses changes to existing resources) |

Every variant ships:

- shadcn-style components and **lucide** icons
- **English and Colombian Spanish (`es-CO`)** i18n
- **One theme file** with light and dark tokens that use shadcn's names (`primary`, `muted-foreground`,
  `success`, ...), so restyling works the same everywhere
- A typed axios client that converts snake_case API responses to camelCase
- An API health card that talks to `GET /api/health/` from [`nomadicode-api-starter`](https://github.com/Nomadicode/nomadicode-api-starter)
- **PostHog** analytics, pageview/screen tracking and error autocapture, off until the project token is set
- CI, and a **Deploy production web** workflow that loads build settings from Infisical over OIDC and
  deploys to Cloudflare after green CI on `main`

All secrets live in Infisical: build settings in Prod › `/app` (Expo) or `/web`, deploy credentials
(`CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`, `EXPO_TOKEN`) in Prod › `/ci`. The repository needs
only the GitHub variable `INFISICAL_PROJECT_SLUG`; `.env` files are for local development.

| Variant | Stack | Deploys to | Theme file |
| ------- | ----- | ---------- | ---------- |
| `expo`  | Expo SDK 57 (React Native 0.86, Android API 36), Expo Router, NativeWind v4, Jest | Cloudflare Pages (web), EAS → Play / App Store | `src/global.css` |
| `nuxt`  | Nuxt 4, Tailwind v4, shadcn-vue, Pinia, `@nuxtjs/i18n` | Cloudflare Pages (`nuxt generate`) | `app/assets/css/tailwind.css` |
| `next`  | Next.js 16, Tailwind v4, shadcn/ui, `next-intl` | Cloudflare Workers (OpenNext) | `app/globals.css` |

Add a variant by creating `variants/<name>/` as a complete project root, adding its sections to
`scripts/setup-guide.md` (`<!-- variant:name -->` … `<!-- /variant -->`), and adding it to the matrix
in `.github/workflows/template-ci.yml`.
