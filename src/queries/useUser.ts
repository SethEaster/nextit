import { getReddit } from 'reddit';
import { useQuery } from 'react-query';
import { Reddit } from 'reddit.types';

export const useUser = (username: string) => {
  if (username === '[deleted]') {
    return useQuery(['user', username], () => null);
  }

  return useQuery(['user', username], () =>
    getReddit()
      .get<Reddit.Thing<Reddit.UserIdentity>>(`/user/${username}/about`)
      .then(res => res.data.data)
  );
};
