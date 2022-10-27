import { getReddit } from 'reddit';
import { queryClient } from 'pages/_app';
import { Reddit } from 'reddit.types';
import { useQuery } from 'react-query';

export const usePost = (postId: string) =>
  useQuery(['post', postId], () =>
    getReddit()
      .get<Reddit.Thing<Reddit.Listing<Reddit.Link>>>(`/by_id/t3_${postId}`)
      .then(res => res.data.data.children[0].data)
  );
