/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

interface ImportMetaEnv {
  readonly VITE_THESPORTSDB_API_KEY: string;
  readonly VITE_THESPORTSDB_V1_BASE_URL: string;
  readonly VITE_THESPORTSDB_V2_BASE_URL: string;
  readonly VITE_ENABLE_QUERY_DEVTOOLS: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
