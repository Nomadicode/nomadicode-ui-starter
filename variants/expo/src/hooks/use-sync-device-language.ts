import { useLocales } from "expo-localization";
import { useEffect } from "react";

import i18n, { resolveDeviceLanguage } from "@/i18n";

export function useSyncDeviceLanguage() {
  const locales = useLocales();

  useEffect(() => {
    const language = resolveDeviceLanguage();
    if (i18n.language !== language) {
      i18n.changeLanguage(language);
    }
  }, [locales]);
}
