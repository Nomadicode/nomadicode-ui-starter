import { cookies, headers } from "next/headers"
import { getRequestConfig } from "next-intl/server"

import { LOCALE_COOKIE, resolveLocale } from "./config"

export default getRequestConfig(async () => {
  const cookieLocale = (await cookies()).get(LOCALE_COOKIE)?.value
  const headerLocale = (await headers()).get("accept-language")
  const locale = resolveLocale(cookieLocale ?? headerLocale)

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  }
})
