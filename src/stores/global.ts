import { oauthApi } from 'reddit';
import create from 'zustand';

interface GlobalState {
  redditAccessToken: string;
  setRedditAccessToken: (accessToken: string) => void;
}

export const useGlobal = create<GlobalState>()(set => ({
  redditAccessToken: '',
  setRedditAccessToken: accessToken =>
    set(() => {
      oauthApi.defaults.headers.common[
        'Authorization'
      ] = `bearer ${accessToken}`;

      return { redditAccessToken: accessToken };
    }),
}));
