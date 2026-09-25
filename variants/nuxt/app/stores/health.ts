import { defineStore } from 'pinia'
import { getHealth } from '~/services/health.service'
import type { HealthResponse } from '~/types/api.types'

export type HealthStatus = 'loading' | 'online' | 'error'

export const useHealthStore = defineStore('health', () => {
  const api = useApi()
  const status = ref<HealthStatus>('loading')
  const health = ref<HealthResponse | null>(null)

  async function refresh() {
    status.value = 'loading'
    try {
      health.value = await getHealth(api)
      status.value = 'online'
    }
    catch {
      status.value = 'error'
    }
  }

  return { status, health, refresh }
})
