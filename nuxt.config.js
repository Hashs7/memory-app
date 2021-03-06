import path from 'path';
import fs from 'fs';

const serverConfig = {
  server: {
    host: '0.0.0.0',
    port: 8080,
  },
};

if (process.env.NODE_ENV === 'development') {
  serverConfig.server = {
    ...serverConfig.server,
    https: {
      key: fs.readFileSync(path.resolve(__dirname, 'cert/key.pem')),
      cert: fs.readFileSync(path.resolve(__dirname, 'cert/cert.pem')),
    },
  };
}

export default {
  // Target: https://go.nuxtjs.dev/config-target
  target: 'static',
  ssr: false,
  loading: false,

  cache: {
    max: 1000,
    maxAge: 900000,
  },
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'Memory Motel',
    meta: [
      { charset: 'utf-8' },
      {
        name: 'viewport',
        content:
          'width=device-width, initial-scale=1, maximum-scale=1.0, user-scalable=0, viewport-fit=cover',
      },
      {
        name: 'theme-color',
        content: '#FFF9E2',
      },
      { hid: 'description', name: 'description', content: '' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/icon.png' }],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: ['vue-wysiwyg/dist/vueWysiwyg.css', '@/assets/styles/style.scss'],

  styleResources: {
    scss: [
      '@/assets/styles/0-settings/_settings-mixins.scss',
      '@/assets/styles/0-settings/_settings-fonts.scss',
      '@/assets/styles/0-settings/_settings-variable.scss',
      '@/assets/styles/0-settings/_settings-typography.scss',
      '@/assets/styles/0-settings/_settings-media.scss',
      '@/assets/styles/0-settings/_settings-index.scss',
    ],
  },

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    { src: '~/plugins/ApiService.js' },
    { src: '~/plugins/vue-scroll.js' },
    { src: '~/plugins/carousel.js' /* mode: 'client' */ },
    { src: '~/plugins/vue-lazyload.js', mode: 'client' },
    { src: '~/plugins/vee-validate.js', mode: 'client' },
    { src: '~/plugins/vuex-persist.js', mode: 'client' },
    { src: '~/plugins/colors.js', mode: 'client' },
    { src: '~/plugins/hammer.js', mode: 'client' },
    { src: '~/plugins/wysiwyg.js', mode: 'client' },
    { src: '~/plugins/nuxt-client-init.js', mode: 'client' },
    { src: '~/plugins/vue-select.js' },
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module',
    '@nuxtjs/style-resources',
    '@nuxtjs/router-extras',
    '@nuxtjs/svg',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    'nuxt-buefy',
    '@nuxtjs/axios',
    '@nuxtjs/pwa',
    '@nuxtjs/auth-next',
    '@nuxtjs/component-cache',
  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    baseURL: process.env.VUE_APP_API_URL,
  },

  env: {
    apiUrl: process.env.VUE_APP_API_URL || 'http://localhost:3000',
  },

  /**
   * Add 404 page
   */
  /*
  router: {
    extendRoutes(routes, resolve) {
      routes.push({
        name: 'errors',
        path: '*',
        component: resolve(__dirname, 'pages/404.vue'),
      });
    },
  },
  */

  auth: {
    redirect: {
      login: '/connexion',
      logout: '/',
      callback: false,
      home: false,
    },
    strategies: {
      local: {
        token: {
          property: 'accessToken',
        },
        user: {
          property: 'user',
          autoFetch: false,
        },
        endpoints: {
          login: { url: '/auth/signin', method: 'post' },
          logout: { url: '/auth/logout', method: 'post' },
          refresh: { url: '/auth/refresh', method: 'post' },
          user: { url: '/user/me', method: 'get' },
        },
      },
    },
  },

  // PWA module configuration: https://go.nuxtjs.dev/pwa
  pwa: {
    manifest: {
      lang: 'fr',
      name: 'Memory Motel',
      short_name: 'Memory Motel',
      themeColor: '#FFF9E2',
    },
    meta: {
      name: 'Memory Motel',
      lang: 'fr',
      viewport: 'width=device-width, initial-scale=1, user-scalable=no',
      mobileAppIOS: 'dark-content',
      appleStatusBarStyle: 'black-translucent',
      orientation: 'portrait-primary',
      theme_color: '#FFF9E2',
    },
    themeColor: '#FFF9E2',
    msTileColor: '#373737',
    appleMobileWebAppStatusBarStyle: 'default',
    workbox: {
      exclude: ['.htaccess'],
      importScripts: ['/serviceWorkerSkipWaiting.js'],
      skipWaiting: false,
      navigateFallback: 'index.html',
      runtimeCaching: [
        // Cache the Google Fonts stylesheets with a stale while revalidate strategy.
        /*
        {
          urlPattern: /^https:\/\/fonts\.googleapis\.com/,
          handler: 'StaleWhileRevalidate',
          options: {
            cacheName: 'google-fonts-stylesheets',
            cacheableResponse: {
              statuses: [0, 200],
            },
          },
        },

        // Cache the Google Fonts webfont files with a cache first strategy for 1 year.
        {
          urlPattern: /^https:\/\/fonts\.gstatic\.com/,
          handler: 'CacheFirst',
          options: {
            cacheName: 'google-fonts-webfonts',
            cacheableResponse: {
              statuses: [0, 200],
            },
            expiration: {
              maxAgeSeconds: 31536000, // 1 year
            },
          },
        },
        */

        // Cache the Carto CDN map tiles
        {
          urlPattern: /^https:\/\/memoryapp\.blob\.core\.windows\.net/,
          handler: 'StaleWhileRevalidate',
          options: {
            cacheName: 'images-cdn',
            cacheableResponse: {
              statuses: [0, 200],
            },
            expiration: {
              maxAgeSeconds: 5184000, // 60 days
              maxEntries: 100, // Max 100 request (prevent taking to much space)
            },
          },
        },
      ],
    },
  },

  ...serverConfig,

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    transpile: ['vee-validate/dist/rules', 'gsap'],
  },

  generate: {
    exclude: [
      /^\/admin/, // path starts with /admin
    ],
    // fallback: true,
  },
};
