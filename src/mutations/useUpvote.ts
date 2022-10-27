import { getReddit } from 'reddit';
import { queryClient } from 'pages/_app';
import { useMutation } from 'react-query';
import { Reddit } from 'reddit.types';

export const useVote = (key: 'comment', id: string) =>
  useMutation<unknown, unknown, { dir: Reddit.Vote }>(
    ({ dir }) => {
      let fullname = '';

      if (key === 'comment') {
        fullname = `t1_${id}`;
      } else if (key === 'link') {
        fullname = `t3_${id}`;
      }

      return getReddit().post('/api/vote', null, {
        params: {
          id: fullname,
          dir,
        },
      });
    },
    {
      onSuccess: (_, { dir }) => {
        queryClient.setQueryData<Reddit.Comment | Reddit.Link | undefined>(
          [key, id],
          thing => {
            if (thing) {
              let likes: boolean | null = null;

              switch (dir) {
                case Reddit.Vote.Up:
                  likes = true;
                  break;
                case Reddit.Vote.Down:
                  likes = false;
                  break;
                case Reddit.Vote.None:
                  likes = null;
                  break;
              }

              return { ...thing, likes };
            }
          }
        );
      },
    }
  );
