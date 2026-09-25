"use client"

import { Activity, CircleAlert, CircleCheck, Loader2 } from "lucide-react"
import { useTranslations } from "next-intl"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useHealth } from "@/hooks/use-health"

export function HealthStatusCard() {
  const t = useTranslations()
  const { status, health, refresh } = useHealth()

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm font-medium tracking-wide text-muted-foreground uppercase">
          <Activity className="size-4" />
          {t("health.title")}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {status === "loading" && (
          <Loader2
            className="size-5 animate-spin text-muted-foreground"
            aria-label={t("health.title")}
          />
        )}
        {status === "online" && health && (
          <p className="flex items-center gap-2 text-success">
            <CircleCheck className="size-4 shrink-0" />
            {t("health.online", {
              service: health.service,
              version: health.version,
              database: health.database,
            })}
          </p>
        )}
        {status === "error" && (
          <>
            <p className="flex items-center gap-2 text-destructive">
              <CircleAlert className="size-4 shrink-0" />
              {t("health.error")}
            </p>
            <Button variant="outline" onClick={refresh}>
              {t("common.retry")}
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  )
}
