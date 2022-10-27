import { getReddit } from 'reddit';
import { useQuery } from 'react-query';
import { Reddit } from 'reddit.types';
import { useGlobal } from 'stores/global';

export const useMe = () =>
  useQuery(
    'me',
    () => {
      if (useGlobal.getState().redditAccessToken === '') {
        return Promise.resolve(null);
      }

      return getReddit()
        .get<Reddit.UserIdentity>('/api/v1/me')
        .then(res => res.data)
        .catch(error => null);
    },
    { retry: false }
  );
