import { useQuery } from 'react-query';
import { Reddit } from 'reddit.types';

export const useComment = (commentId: string) =>
  useQuery<Reddit.Comment>(['comment', commentId]);
