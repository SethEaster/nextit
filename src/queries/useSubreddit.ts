import { useQuery } from 'react-query';
import { Reddit } from 'reddit.types';
import { getReddit } from 'reddit';

export const useSubreddit = (subreddit: string) =>
  useQuery(
    ['subreddit', subreddit],
    () =>
      getReddit()
        .get<Reddit.Thing<Reddit.SubredditInfo>>(`/r/${subreddit}/about`)
        .then(res => res.data.data),
    { retry: false }
  );
