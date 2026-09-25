import type { AxiosInstance } from 'axios'
import type { HealthResponse } from '~/types/api.types'

export async function getHealth(api: AxiosInstance): Promise<HealthResponse> {
  const response = await api.get<HealthResponse>('/api/health/')
  return response.data
}
