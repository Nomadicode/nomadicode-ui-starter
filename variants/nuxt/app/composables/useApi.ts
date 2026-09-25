import type { AxiosInstance } from 'axios'
import { createApiClient } from '~/services/api'

let client: AxiosInstance | undefined

export function useApi(): AxiosInstance {
  client ??= createApiClient(useRuntimeConfig().public.apiUrl)
  return client
}
