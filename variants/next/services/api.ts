import { create } from "axios"

function toCamelCase(key: string): string {
  return key.replace(/_([a-z0-9])/g, (_match, char: string) =>
    char.toUpperCase()
  )
}

function toSnakeCase(key: string): string {
  return key.replace(/[A-Z]/g, (char) => `_${char.toLowerCase()}`)
}

function transformKeys(
  data: unknown,
  transform: (key: string) => string
): unknown {
  if (typeof FormData !== "undefined" && data instanceof FormData) {
    return data
  }
  if (Array.isArray(data)) {
    return data.map((item) => transformKeys(item, transform))
  }
  if (data !== null && typeof data === "object" && !(data instanceof Date)) {
    return Object.fromEntries(
      Object.entries(data as Record<string, unknown>).map(([key, value]) => [
        transform(key),
        transformKeys(value, transform),
      ])
    )
  }
  return data
}

export const api = create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
})

api.interceptors.request.use((config) => {
  if (config.data) {
    config.data = transformKeys(config.data, toSnakeCase)
  }
  return config
})

api.interceptors.response.use((response) => {
  response.data = transformKeys(response.data, toCamelCase)
  return response
})
