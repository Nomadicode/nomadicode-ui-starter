import { usePathname } from "expo-router";
import { useEffect } from "react";

import { analytics } from "@/services/analytics";

/** Sends a PostHog screen event on every Expo Router navigation. */
export function useScreenTracking(): void {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname) analytics?.screen(pathname);
  }, [pathname]);
}
