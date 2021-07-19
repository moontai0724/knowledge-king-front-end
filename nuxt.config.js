import path from 'path'
import fs from 'fs'
export default {
  // Target: https://go.nuxtjs.dev/config-target
  target: 'static',

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: null,
    titleTemplate: (titleChunk) => {
      return titleChunk ? `${titleChunk} | 知識王` : '知識王'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '知識王' },
      { name: 'format-detection', content: 'telephone=no' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },

  server: {
    port: 3000,
    host: '0.0.0.0',
    https:
      process.env.schema === 'https'
        ? {
            key: fs.readFileSync(path.resolve(__dirname, 'certs', 'cert.key')),
            cert: fs.readFileSync(path.resolve(__dirname, 'certs', 'cert.crt')),
          }
        : undefined,
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: ['@mdi/font/css/materialdesignicons.min.css'],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    '@nuxt/typescript-build',
    // https://go.nuxtjs.dev/stylelint
    '@nuxtjs/stylelint-module',
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify',
    // https://typed-vuex.roe.dev/
    'nuxt-typed-vuex',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    // https://auth.nuxtjs.org
    '@nuxtjs/auth-next',
    // https://go.nuxtjs.dev/pwa
    '@nuxtjs/pwa',
  ],

  auth: {
    strategies: {
      local: {
        token: {
          property: 'data.token.access_token',
          global: true,
          type: 'Bearer',
          maxAge: 60 * 60 * 24,
        },
        refreshToken: {
          property: 'data.token.refresh_token',
          maxAge: 60 * 60 * 24 * 30,
          data: 'refresh_token',
          required: true,
        },
        user: {
          property: 'data',
        },
        endpoints: {
          login: { url: '/auth/login', method: 'post' },
          refresh: { url: '/auth/refresh', method: 'post' },
          logout: false,
          user: { url: '/user', method: 'get' },
        },
      },
    },
  },

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {},

  router: {
    middleware: ['auth'],
  },

  // PWA module configuration: https://go.nuxtjs.dev/pwa
  pwa: {
    manifest: {
      lang: 'zh-Hant-TW',
    },
  },

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: false,
      themes: {
        light: {
          primary: '#4B6FB1',
          secondary: '#EBF1FD',
          error: '#EE9090',
          warning: '#FFF888',
          success: '#90EE90',
        },
      },
    },
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {},
}
