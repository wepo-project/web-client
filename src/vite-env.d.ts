/// <reference types="vite/client" />

interface ImportMetaEnv {
	VITE_HOST: string
}
declare module '*.vue' {
  import Vue from 'vue';
  export default Vue;
  export type Props = Record<string, unknown>
}