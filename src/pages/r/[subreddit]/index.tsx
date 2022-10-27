import { MainLayout } from 'components/MainLayout/MainLayout';
import { Subreddit } from 'components/Subreddit/Subreddit';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';

const SubredditPage: NextPage = () => {
  const { query } = useRouter();

  if (typeof query.subreddit !== 'string' || !query.subreddit) return null;

  return (
    <MainLayout subredditName={`r/${query.subreddit}`}>
      <Subreddit subredditName={query.subreddit}></Subreddit>
    </MainLayout>
  );
};

export default SubredditPage;
