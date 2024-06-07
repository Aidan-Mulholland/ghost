declare global {
  namespace NodeJS {
    interface ProcessEnv {
      AUTH_SERVER: string;
      NODE_ENV: "development" | "production";
    }
  }
}

export {};
