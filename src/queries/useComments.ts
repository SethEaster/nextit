import { queryClient } from 'pages/_app';
import { useQuery } from 'react-query';
import { getReddit } from 'reddit';
import { Reddit } from 'reddit.types';

export const useComments = (subreddit: string, postId: string) =>
  useQuery(
    ['comments', postId],
    () =>
      getReddit()
        .get<Array<Reddit.Thing<Reddit.Listing>>>(
          `r/${subreddit}/comments/${postId}`,
          {
            params: {
              profile_img: true,
            },
          }
        )
        .then(
          res =>
            res.data[1].data.children.filter(
              entry => entry.kind === 't1'
            ) as Array<Reddit.Thing<Reddit.Comment>>
        ),
    {
      onSuccess: data => {
        const cacheComments = (
          comments: Array<Reddit.Thing<Reddit.Comment>>
        ) => {
          if (!comments) return;

          for (const comment of comments) {
            queryClient.setQueryData(
              ['comment', comment.data.id],
              comment.data
            );

            cacheComments(
              comment.data?.replies?.data?.children.filter(
                child => child.kind === 't1'
              )
            );
          }
        };

        cacheComments(data);
      },
    }
  );
