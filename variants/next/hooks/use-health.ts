"use client"

import { useCallback, useEffect, useState } from "react"

import { getHealth } from "@/services/health.service"
import type { HealthResponse } from "@/types/api.types"

export type HealthStatus = "loading" | "online" | "error"

export function useHealth() {
  const [status, setStatus] = useState<HealthStatus>("loading")
  const [health, setHealth] = useState<HealthResponse | null>(null)
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    let isCancelled = false

    getHealth()
      .then((data) => {
        if (isCancelled) return
        setHealth(data)
        setStatus("online")
      })
      .catch(() => {
        if (!isCancelled) setStatus("error")
      })

    return () => {
      isCancelled = true
    }
  }, [attempt])

  const refresh = useCallback(() => {
    setStatus("loading")
    setAttempt((current) => current + 1)
  }, [])

  return { status, health, refresh }
}
