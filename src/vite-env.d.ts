/// <reference types="vite/client" />

import { RouteLocationNormalizedLoaded, Router } from 'vue-router';
import Vue from 'vue';

interface ImportMetaEnv {
	VITE_HOST: string
}

declare module '*.vue' {
  export default Vue;
  export type Props = Record<string, unknown>
}

declare module '@vue' {
  export interface ComponentCustomProperties {
    /**
     * Normalized current location. See {@link RouteLocationNormalizedLoaded}.
     */
    $route: RouteLocationNormalizedLoaded
    /**
     * {@link Router} instance used by the application.
     */
    $router: Router
  }
}