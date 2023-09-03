declare namespace NodeJS {
  interface ProcessEnv {
    CLIENT_API_URI: string;
    CLIENT_API_PROTOCOL: string;
    PORT: number;
    NEXTJS_DIR: string;
    NODE_ENV: "development" | "production" | "test";
    APP_VERSION: string;
    BRANCH: string;
    INTERNAL_CLIENTAPI_URI: string;
    LAYER0: string;
  }
}
