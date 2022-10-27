import { useGlobal } from 'stores/global';
import axios from 'axios';

export const oauthApi = axios.create({
  baseURL: 'https://oauth.reddit.com/',
});

const redditApi = axios.create({
  baseURL: 'https://api.reddit.com/',
});

oauthApi.defaults.params = { raw_json: 1 };
redditApi.defaults.params = { raw_json: 1 };

export const getReddit = () => {
  if (useGlobal.getState().redditAccessToken !== '') {
    return oauthApi;
  }

  return redditApi;
};
