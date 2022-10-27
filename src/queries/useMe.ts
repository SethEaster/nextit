import { getReddit } from 'reddit';
import { useQuery } from 'react-query';
import { Reddit } from 'reddit.types';
import { useGlobal } from 'stores/global';

export const useMe = () =>
  useQuery(
    'me',
    () => {
      if (useGlobal.getState().redditAccessToken === '') {
        throw new Error();
      }

      return getReddit()
        .get<Reddit.UserIdentity>('/api/v1/me')
        .then(res => res.data);
    },
    { retry: false }
  );
