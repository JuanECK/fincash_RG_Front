interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_HMAC_SECRET: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}