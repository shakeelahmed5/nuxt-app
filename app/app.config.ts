import type { FetchContext } from 'ofetch';
import type { ConsolaInstance } from 'consola';
import type { NuxtApp } from '#app';

export default defineAppConfig({
  ui: {
    primary: 'violet',
    gray: 'stone',
    notifications: {
      // Show toasts at the top right of the screen
      position: 'top-0 right-0 bottom-auto',
    },
  },

  // fix for the type check error
  nuxtIcon: {},

  siteTitle: 'Pacific All Stars',

  sanctum: {
    interceptors: {
      onRequest: async (
        app: NuxtApp,
        ctx: FetchContext,
        logger: ConsolaInstance
      ) => {
        logger.debug(`custom onRequest interceptor (${ctx.request})`);
      },

      onResponse: async (
        app: NuxtApp,
        ctx: FetchContext,
        logger: ConsolaInstance
      ) => {
        logger.debug(`custom onResponse interceptor (${ctx.request})`);
      },
    },
  },
});
