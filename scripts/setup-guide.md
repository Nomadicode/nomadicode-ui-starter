## Production setup

Everything this frontend needs outside the code, in order. Tick each box as you go. Every secret
and setting lives in Infisical; GitHub holds only the Infisical project slug, and `.env` is for
local development. Values never go in this file, the repository or Notion — only key names.

<!-- variant:expo -->

| Thing                           | Name                                                                        |
| ------------------------------- | --------------------------------------------------------------------------- |
| GitHub repository               | `__GITHUB_REPO__`                                                           |
| Cloudflare Pages project        | `starter-web`                                                               |
| Infisical folders               | `<project>` › Prod › `/app` (build settings) and `/ci` (deploy credentials) |
| Android package / iOS bundle ID | `__APP_ID__`                                                                |
| PostHog `product` property      | `starter`                                                                   |

<!-- /variant -->
<!-- variant:nuxt -->

| Thing                      | Name                                                                        |
| -------------------------- | --------------------------------------------------------------------------- |
| GitHub repository          | `__GITHUB_REPO__`                                                           |
| Cloudflare Pages project   | `starter-web`                                                               |
| Infisical folders          | `<project>` › Prod › `/web` (build settings) and `/ci` (deploy credentials) |
| PostHog `product` property | `starter`                                                                   |

<!-- /variant -->
<!-- variant:next -->

| Thing                      | Name                                                                        |
| -------------------------- | --------------------------------------------------------------------------- |
| GitHub repository          | `__GITHUB_REPO__`                                                           |
| Cloudflare Worker          | `starter-web` (created by the first deploy)                                 |
| Infisical folders          | `<project>` › Prod › `/web` (build settings) and `/ci` (deploy credentials) |
| PostHog `product` property | `starter`                                                                   |

<!-- /variant -->

### Infrastructure (nomadicode-infra)

<!-- variant:expo nuxt -->

`scripts/init.sh` registered the Pages project in nomadicode-infra (or printed the command to run
there).

- [ ] In nomadicode-infra, review `projects/starter/production/project.tfvars` and the new line in
      `.github/workflows/terraform.yml`, then commit them.
- [ ] Create the resources:

      ```bash
      ./scripts/add-project.sh --name "__PROJECT_NAME__" --web-repo __GITHUB_REPO__ --apply
      ```

- [ ] Custom domain: add it to `websites.web.domains` in `project.tfvars` (needs
      `CLOUDFLARE_ZONE_ID` in `config/platform.env`), plan and apply.

<!-- /variant -->
<!-- variant:next -->

Next.js renders on a Cloudflare Worker (OpenNext), which Wrangler creates on the first deploy, so
nomadicode-infra has nothing to create for it. The product's API registration creates the shared
R2 buckets.

- [ ] Custom domain: uncomment `routes` in `wrangler.jsonc` with the hostname (its zone must be in
      the Cloudflare account) and deploy.

<!-- /variant -->

### Infisical

- [ ] Use the product's Infisical project (the API's), or create one.
- [ ] Project › Access control: the `github-actions-deploy` identity is a **Viewer**.
- [ ] Prod › `/ci`, loaded by the workflows only after the build:

<!-- variant:expo -->

| Key                     | Value                                       |
| ----------------------- | ------------------------------------------- |
| `CLOUDFLARE_API_TOKEN`  | Cloudflare › API tokens, Pages: Edit        |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare dashboard › Account ID           |
| `EXPO_TOKEN`            | expo.dev › Account settings › Access tokens |

<!-- /variant -->
<!-- variant:nuxt -->

| Key                     | Value                                |
| ----------------------- | ------------------------------------ |
| `CLOUDFLARE_API_TOKEN`  | Cloudflare › API tokens, Pages: Edit |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare dashboard › Account ID    |

<!-- /variant -->
<!-- variant:next -->

| Key                     | Value                                                                                          |
| ----------------------- | ---------------------------------------------------------------------------------------------- |
| `CLOUDFLARE_API_TOKEN`  | Cloudflare › API tokens, Workers Scripts: Edit (plus Workers Routes: Edit for a custom domain) |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare dashboard › Account ID                                                              |

<!-- /variant -->

- [ ] Prod › <!-- variant:expo -->`/app`<!-- /variant --><!-- variant:nuxt next -->`/web`<!-- /variant -->, the build settings:

<!-- variant:expo -->

| Key                                 | Value                                                |
| ----------------------------------- | ---------------------------------------------------- |
| `EXPO_PUBLIC_API_URL`               | The API's public URL, e.g. `https://api.example.com` |
| `EXPO_PUBLIC_POSTHOG_PROJECT_TOKEN` | `${prod.shared.POSTHOG_PROJECT_TOKEN}`               |
| `EXPO_PUBLIC_POSTHOG_HOST`          | `https://us.i.posthog.com`                           |

<!-- /variant -->
<!-- variant:nuxt -->

| Key                                 | Value                                                |
| ----------------------------------- | ---------------------------------------------------- |
| `NUXT_PUBLIC_API_URL`               | The API's public URL, e.g. `https://api.example.com` |
| `NUXT_PUBLIC_POSTHOG_PROJECT_TOKEN` | `${prod.shared.POSTHOG_PROJECT_TOKEN}`               |
| `NUXT_PUBLIC_POSTHOG_HOST`          | `https://us.i.posthog.com`                           |

<!-- /variant -->
<!-- variant:next -->

| Key                                 | Value                                                |
| ----------------------------------- | ---------------------------------------------------- |
| `NEXT_PUBLIC_API_URL`               | The API's public URL, e.g. `https://api.example.com` |
| `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` | `${prod.shared.POSTHOG_PROJECT_TOKEN}`               |
| `NEXT_PUBLIC_POSTHOG_HOST`          | `https://us.i.posthog.com`                           |

<!-- /variant -->

Every key in that folder reaches the build, so add new public settings there. They end up in the
browser bundle: never put a secret in it.

- [ ] In the API's Prod › `/api` folder, add this site's origin to `CORS_ORIGINS` (and
      `FRONTEND_URL` if the API sends links to it), then re-run the API deploy with _sync
      configuration_.

### GitHub

- [ ] Settings › Environments › **production** (restrict to `main`). The Infisical identity only
      trusts jobs in this environment.
- [ ] Environment variable `INFISICAL_PROJECT_SLUG` (Infisical › Project settings › Slug). No
      GitHub secrets are needed.
- [ ] Branch protection on `main` requiring the **CI** check.

### PostHog

Analytics and error tracking go to the shared Nomadicode project (US cloud), tagged
`product = starter`. Nothing is sent while the project token is empty.

- [ ] Project settings › Toolbar authorized URLs / Web analytics domains: add the production domain.
- [ ] Error tracking › Alerts: new issue where `product = starter`.
- [ ] Dashboard named `__PROJECT_NAME__` with the product's key events, filtered on `product = starter`.
- [ ] Capture product events next to the code that completes them
      <!-- variant:expo -->(`withEvent` in `src/services/analytics.ts`; screens are tracked automatically)<!-- /variant --><!-- variant:nuxt -->(`useNuxtApp().$posthog?.capture(...)`; pageviews are automatic)<!-- /variant --><!-- variant:next -->(`posthog.capture(...)` from `posthog-js` in client components; pageviews are automatic)<!-- /variant -->.

<!-- variant:expo -->

### EAS and the stores

The app targets Android API 36, which meets Google Play's current target-SDK requirement; raise
`expo-build-properties` in `app.json` together with the next Expo SDK upgrade.

- [ ] `npx eas-cli@latest init` (owner `nomadicode`) and commit the `extra.eas.projectId` it writes
      to `app.json`. The ID isn't a secret.
- [ ] Google Play Console: create the app with package `__APP_ID__`; complete App content (privacy
      policy URL, Data safety, content rating, target audience, ads) and the store listing.
- [ ] Upload the first AAB by hand (Play needs one before API submissions):
      `npx eas-cli build -p android --profile production`, then download it from expo.dev.
- [ ] Play Console › Setup › API access: create a service account with release permissions and add
      its JSON key with `npx eas-cli credentials` (Android › Google Service Account). EAS stores it.
- [ ] New personal developer accounts: run a closed test with 12+ testers for 14 days before
      production access.
- [ ] iOS (when needed): App Store Connect app with bundle ID `__APP_ID__`, and an App Store Connect
      API key in `eas credentials`.
- [ ] Actions › **Release native production app** › `android`: mirrors the `EXPO_PUBLIC_*` keys into
      the EAS `production` environment, builds, then submits to the internal track as a draft
      (`eas.json` › `submit.production`). Promote it in Play Console.

<!-- /variant -->

### First deploy

- [ ] Push to `main`. After CI passes, **Deploy production web** builds with the Infisical values
      and publishes<!-- variant:expo nuxt --> to Pages<!-- /variant --><!-- variant:next --> the Worker<!-- /variant -->.
- [ ] Open the site, check the API status card says online, and see a pageview in PostHog
      › Activity.

### Notion

- [ ] Add (or update) the product's page in the projects database: status, repositories, links to
      the live site, <!-- variant:expo -->the Play listing, <!-- /variant -->the Infisical project,
      the PostHog dashboard and this README.
- [ ] List the Infisical keys by name (never values) and the third-party accounts the app uses.
- [ ] <!-- variant:expo -->Track release notes there; link the GitHub release for each store build.<!-- /variant --><!-- variant:nuxt next -->Link the deploy history (GitHub Actions) from the page.<!-- /variant -->

### Local settings from Infisical

`.env` (from `.env.example`) is enough to start. With access to the Infisical project, use its Local
environment instead:
`infisical run --env=local --path=<!-- variant:expo -->/app<!-- /variant --><!-- variant:nuxt next -->/web<!-- /variant --> -- pnpm <!-- variant:expo -->start<!-- /variant --><!-- variant:nuxt next -->dev<!-- /variant -->`.
