export const LOCALES = ["en", "es-CO"] as const
export type Locale = (typeof LOCALES)[number]

export const DEFAULT_LOCALE: Locale = "en"
export const LOCALE_COOKIE = "NEXT_LOCALE"

export function resolveLocale(candidate: string | null | undefined): Locale {
  if (!candidate) return DEFAULT_LOCALE
  const language = candidate.split(",")[0].trim().toLowerCase()
  if (language === "es" || language.startsWith("es-")) return "es-CO"
  return LOCALES.find((locale) => locale.toLowerCase() === language) ?? DEFAULT_LOCALE
}
