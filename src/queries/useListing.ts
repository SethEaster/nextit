import { useInfiniteQuery } from 'react-query';
import { queryClient } from 'pages/_app';
import { getReddit } from 'reddit';
import { Reddit } from 'reddit.types';

export const useListing = (subreddit: string, sort: Reddit.ListingSort) => {
  const fetchSubreddit = ({ pageParam }: { pageParam?: string }) =>
    getReddit()
      .get<Reddit.Thing<Reddit.Listing<Reddit.Link>>>(
        `r/${subreddit}/${sort}`,
        {
          params: {
            raw_json: 1,
            after: pageParam,
            sr_detail: 1,
          },
        }
      )
      .then(res => res.data);

  return useInfiniteQuery(['posts', subreddit, sort], fetchSubreddit, {
    onSuccess: data =>
      data.pages.forEach(page =>
        page.data.children.forEach(entry =>
          queryClient.setQueryData(['post', entry.data.id], entry.data)
        )
      ),
    getNextPageParam: lastPage => lastPage?.data.after,
  });
};
