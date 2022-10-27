import { MainLayout } from 'components/MainLayout/MainLayout';
import { PostComments } from 'components/PostComments/PostComments';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';

const CommentsPage: NextPage = () => {
  const { query } = useRouter();

  if (typeof query.subreddit !== 'string' || !query.subreddit) return null;
  if (typeof query.postId !== 'string' || !query.postId) return null;

  return (
    <MainLayout subredditName={`r/${query.subreddit}`}>
      <PostComments
        subreddit={query.subreddit}
        postId={query.postId}
      ></PostComments>
    </MainLayout>
  );
};

export default CommentsPage;
