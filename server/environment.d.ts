declare global {
  namespace NodeJS {
    interface ProcessEnv {
      SESSION_SECRET: string;
      MONGO_URL: string;
      MONGODB_USERNAME: string;
      MONGODB_PASSWORD: string;
    }
  }
}

// eslint-disable-next-line prettier/prettier
export { };
