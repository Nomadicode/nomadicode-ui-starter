import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2025-01-01',
  css: ['~/assets/css/tailwind.css'],
  modules: ['shadcn-nuxt', '@nuxtjs/i18n', '@pinia/nuxt', '@nuxt/eslint'],
  vite: {
    plugins: [tailwindcss()],
  },
  shadcn: {
    prefix: 'Ui',
    componentDir: '@/components/ui',
  },
  runtimeConfig: {
    public: {
      apiUrl: 'http://localhost:8000',
    },
  },
  i18n: {
    defaultLocale: 'en',
    strategy: 'no_prefix',
    langDir: 'locales',
    locales: [
      { code: 'en', language: 'en-US', name: 'English', file: 'en.json' },
      { code: 'es-CO', language: 'es-CO', name: 'Español (Colombia)', file: 'es-CO.json' },
    ],
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_locale',
      fallbackLocale: 'en',
    },
  },
})
