import { api } from "@/services/api"
import type { HealthResponse } from "@/types/api.types"

export async function getHealth(): Promise<HealthResponse> {
  const response = await api.get<HealthResponse>("/api/health/")
  return response.data
}
