import posthog, { type PostHog } from 'posthog-js'

const SUPER_PROPERTIES = { product: 'starter', app: 'starter-web' } as const
const DEFAULT_HOST = 'https://us.i.posthog.com'

export default defineNuxtPlugin((): { provide: { posthog: PostHog | null } } => {
  const { posthogProjectToken, posthogHost } = useRuntimeConfig().public
  const token = String(posthogProjectToken ?? '').trim()

  if (!token) {
    if (import.meta.dev) {
      // RATIONALE: PostHog's integration rules require a missing token to be loud in dev.
      console.error('NUXT_PUBLIC_POSTHOG_PROJECT_TOKEN is not configured, so PostHog events are being dropped.')
    }
    return { provide: { posthog: null } }
  }

  // The dated defaults turn on SPA pageviews/pageleaves on every route change.
  posthog.init(token, {
    api_host: String(posthogHost ?? '').trim() || DEFAULT_HOST,
    defaults: '2026-05-30',
    capture_exceptions: true,
  })
  posthog.register(SUPER_PROPERTIES)
  return { provide: { posthog } }
})
