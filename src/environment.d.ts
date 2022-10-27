declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_REDDIT_CLIENT_ID: string;
      REDDIT_CLIENT_SECRET: string;
      NEXT_PUBLIC_REDDIT_REDIRECT_URL: string;
      NODE_ENV: 'development' | 'production';
    }
  }
}

export {};
