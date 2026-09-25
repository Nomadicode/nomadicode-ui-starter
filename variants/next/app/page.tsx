import { useTranslations } from "next-intl"

import { HealthStatusCard } from "@/components/health-status-card"

export default function Page() {
  const t = useTranslations("home")

  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-6 px-6">
      <h1 className="text-3xl font-bold">{t("title")}</h1>
      <p className="text-center text-base text-muted-foreground">
        {t("tagline")}
      </p>
      <HealthStatusCard />
    </main>
  )
}
