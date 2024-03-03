// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  ssr: false,

  future: {
    compatibilityVersion: 4,
  },

  modules: [
    '@nuxt/ui',
    '@nuxt/eslint',
    'nuxt-auth-sanctum',
    'dayjs-nuxt',
  ],

  eslint: {
    config: {
      stylistic: true,
    },
  },

  typescript: {
    strict: true,
    typeCheck: 'build',
  },

  nitro: {
    compressPublicAssets: true,
  },

  ui: {
    icons: ['heroicons'],
  },

  sanctum: {
    baseUrl: 'https://dummyjson.com',
    mode: 'token',
    redirect: {
      onGuestOnly: '/dashboard',
      onLogin: '/dashboard',
    },
    endpoints: {
      // login: 'api/login',
      // user: 'auth/me',
    },
  },

  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      htmlAttrs: {
        lang: 'en',
        class: 'scroll-smooth',
      },
      bodyAttrs: {
        class: 'antialiased',
      },
      link: [
        {
          rel: 'icon',
          href: '/favicon.ico',
        },
        {
          rel: 'shortcut icon',
          href: '/favicon.ico',
        },
        {
          rel: 'apple-touch-icon',
          href: '/favicon.ico',
        },
      ],
    },
  },

  runtimeConfig: {
    public: {
      serverBaseUrl: '/',
      app_url: process.env.APP_URL || '',
      assets_url: process.env.ASSETS_URL || ''
    },
  },

  compatibilityDate: '2024-07-24',
});
