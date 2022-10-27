import { MainLayout } from 'components/MainLayout/MainLayout';
import { Subreddit } from 'components/Subreddit/Subreddit';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { Reddit } from 'reddit.types';

const SubredditSortPage: NextPage = () => {
  const { query } = useRouter();

  if (typeof query.subreddit !== 'string' || !query.subreddit) return null;
  if (typeof query.sort !== 'string' || !query.sort) return null;

  return (
    <MainLayout subredditName={`r/${query.subreddit}`}>
      <Subreddit
        subredditName={query.subreddit}
        sort={query.sort! as Reddit.ListingSort}
      ></Subreddit>
    </MainLayout>
  );
};

export default SubredditSortPage;
