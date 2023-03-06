declare global {
  namespace NodeJS {
    interface ProcessEnv {
      SESSION_SECRET: string;
    }
  }
}

// eslint-disable-next-line prettier/prettier
export { };
