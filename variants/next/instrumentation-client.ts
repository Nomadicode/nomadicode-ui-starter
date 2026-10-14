import posthog from "posthog-js"

const SUPER_PROPERTIES = { product: "starter", app: "starter-web" } as const
const DEFAULT_HOST = "https://us.i.posthog.com"

const token = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN?.trim()

if (token) {
  // The dated defaults turn on SPA pageviews/pageleaves on every route change.
  posthog.init(token, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST?.trim() || DEFAULT_HOST,
    defaults: "2026-05-30",
    capture_exceptions: true,
  })
  posthog.register(SUPER_PROPERTIES)
} else if (process.env.NODE_ENV === "development") {
  // RATIONALE: PostHog's integration rules require a missing token to be loud in dev.
  console.error(
    "NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN is not configured, so PostHog events are being dropped."
  )
}
