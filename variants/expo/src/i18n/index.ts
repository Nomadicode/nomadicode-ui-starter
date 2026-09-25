import { getLocales } from "expo-localization";
import { createInstance } from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./locales/en";
import esCO from "./locales/es-CO";

export const SUPPORTED_LANGUAGES = ["en", "es-CO"] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

const FALLBACK_LANGUAGE: SupportedLanguage = "en";

export function resolveDeviceLanguage(): SupportedLanguage {
  return getLocales()[0]?.languageCode === "es" ? "es-CO" : FALLBACK_LANGUAGE;
}

export const resources = {
  en: { translation: en },
  "es-CO": { translation: esCO },
} as const;

const i18n = createInstance();

i18n.use(initReactI18next).init({
  resources,
  lng: resolveDeviceLanguage(),
  fallbackLng: FALLBACK_LANGUAGE,
  supportedLngs: SUPPORTED_LANGUAGES,
  interpolation: { escapeValue: false },
});

export default i18n;
