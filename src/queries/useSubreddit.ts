import { useQuery } from 'react-query';
import { Reddit } from 'reddit.types';
import { getReddit } from 'reddit';

// Reddit has some pseudo-subreddits that don't actually have metadata,
// so we shouldn't even try to query them
export const PSEUDO_SUBREDDITS = ['all', 'popular'];

export const useSubreddit = (subreddit: string) =>
  useQuery(
    ['subreddit', subreddit],
    () => {
      if (PSEUDO_SUBREDDITS.includes(subreddit)) {
        return Promise.resolve(null);
      }

      return getReddit()
        .get<Reddit.Thing<Reddit.SubredditInfo>>(`/r/${subreddit}/about`)
        .then(res => res.data.data);
    },
    { retry: false }
  );
