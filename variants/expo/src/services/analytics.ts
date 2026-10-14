import PostHog from "posthog-react-native";
import { Platform } from "react-native";

const SUPER_PROPERTIES = {
  product: "starter",
  app: "starter-app",
} as const;
const DEFAULT_HOST = "https://us.i.posthog.com";

function createAnalyticsClient(): PostHog | null {
  // Web pages are statically rendered in Node first; only the browser captures.
  if (Platform.OS === "web" && typeof window === "undefined") return null;

  const token = process.env.EXPO_PUBLIC_POSTHOG_PROJECT_TOKEN?.trim();
  if (!token) {
    if (__DEV__) {
      // RATIONALE: PostHog's integration rules require a missing token to be loud in dev.
      console.error(
        "EXPO_PUBLIC_POSTHOG_PROJECT_TOKEN is not configured, so PostHog events are being dropped.",
      );
    }
    return null;
  }
  const client = new PostHog(token, {
    host: process.env.EXPO_PUBLIC_POSTHOG_HOST?.trim() || DEFAULT_HOST,
    errorTracking: {
      autocapture: { uncaughtExceptions: true, unhandledRejections: true },
    },
  });
  client.register(SUPER_PROPERTIES);
  return client;
}

/** Null when no project token is configured — every call site uses `?.`. */
export const analytics = createAnalyticsClient();

type EventProperties = Record<string, string | number | boolean | null>;

/**
 * Wraps a mutation so `event` is captured only after it succeeds, with
 * properties derived from its input. Keeps capture calls out of the UI.
 */
export function withEvent<TInput, TResult>(
  event: string,
  mutate: (input: TInput) => Promise<TResult>,
  properties?: (input: TInput) => EventProperties,
): (input: TInput) => Promise<TResult> {
  return async (input) => {
    const result = await mutate(input);
    analytics?.capture(event, properties?.(input));
    return result;
  };
}
