import classNames from 'classnames';
import { Post } from 'components/Post/Post';
import { SortBar } from 'components/SortBar/SortBar';
import millify from 'millify';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { queryClient } from 'pages/_app';
import { processTextBodyHtml } from 'processTextBodyHtml';
import { useListing } from 'queries/useListing';
import { useSubreddit } from 'queries/useSubreddit';
import { FC, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import Skeleton from 'react-loading-skeleton';
import MediaQuery from 'react-responsive';
import { Reddit } from 'reddit.types';
import styles from './Subreddit.module.scss';

// Reddit has some pseudo-subreddits that don't actually have metadata,
// so we need to hide the sidebar on these.
const PSEUDO_SUBREDDITS = ['all', 'popular'];

export const Subreddit: FC<{
  subredditName: string;
  sort?: Reddit.ListingSort;
}> = ({ subredditName, sort = 'hot' }) => {
  const router = useRouter();

  const subreddit = useSubreddit(subredditName);
  const listing = useListing(subredditName, sort);

  const [ref, inView] = useInView();

  useEffect(() => {
    listing
      .refetch({ refetchPage: (page, index) => index === 0 })
      .then(query => {
        if (query.isSuccess) {
          queryClient.setQueryData(['posts', subredditName], {
            pages: query.data.pages.slice(0, 1),
            pageParams: query.data.pageParams.slice(0, 1),
          });
        }
      });
  }, []);

  useEffect(() => {
    if (inView) {
      listing.fetchNextPage();
    }
  }, [inView]);

  const isPseudoSubreddit = PSEUDO_SUBREDDITS.includes(subredditName);

  useEffect(() => {
    if (!isPseudoSubreddit && subreddit.isError) {
      router.replace('/');
    }
  }, [subreddit]);

  return (
    <>
      <Head>
        <title>{`${
          subreddit.data?.title ?? `r/${subredditName}`
        } | Nextit`}</title>
      </Head>

      <div className={styles.subreddit}>
        {subreddit.data?.banner_background_image && (
          <div
            className={styles.header}
            style={{
              backgroundImage: `url('${subreddit.data?.banner_background_image}')`,
            }}
          />
        )}
        <div className={styles.columns}>
          <div className={styles.main}>
            <SortBar></SortBar>
            <div className={styles.posts}>
              {listing.isSuccess ? (
                <>
                  {listing.data.pages.map(page =>
                    page.data.children.map((post, idx) => (
                      <Post
                        key={idx}
                        subreddit={subredditName}
                        post={post.data}
                        listing={true}
                      />
                    ))
                  )}
                  <div
                    className={styles.loadMore}
                    onClick={() => listing.fetchNextPage()}
                    ref={ref}
                  >
                    Load More
                  </div>
                </>
              ) : (
                <>Loading...</>
              )}
            </div>
          </div>
          {!isPseudoSubreddit ? (
            <MediaQuery minWidth={1250}>
              <div className={styles.sidebar}>
                <div
                  className={classNames(styles.sidebarContainer, styles.about)}
                >
                  {subreddit.isSuccess ? (
                    <div
                      className={styles.description}
                      dangerouslySetInnerHTML={{
                        __html: processTextBodyHtml(
                          subreddit.data!.public_description_html
                        ),
                      }}
                    />
                  ) : (
                    <>
                      <Skeleton count={3}></Skeleton>
                    </>
                  )}
                  <div className={styles.counts}>
                    <div className={styles.members}>
                      {subreddit.isSuccess ? (
                        <>
                          <div className={styles.count}>
                            {millify(subreddit.data!.subscribers, {
                              lowercase: true,
                            })}
                          </div>
                          Members
                        </>
                      ) : (
                        <>
                          <Skeleton></Skeleton>
                        </>
                      )}
                    </div>
                    <div className={styles.online}>
                      {subreddit.isSuccess ? (
                        <>
                          <div className={styles.count}>
                            {millify(subreddit.data!.active_user_count, {
                              lowercase: true,
                            })}
                          </div>
                          Online
                        </>
                      ) : (
                        <>
                          <Skeleton></Skeleton>
                        </>
                      )}
                    </div>
                  </div>
                  <div className={styles.sidebarDivider}></div>
                  {subreddit.isSuccess ? (
                    <div className={styles.cakeDay}>
                      Created{' '}
                      <span className={styles.date}>
                        {new Date(
                          subreddit.data!.created_utc * 1000
                        ).toLocaleDateString()}
                      </span>
                    </div>
                  ) : (
                    <>
                      <Skeleton></Skeleton>
                    </>
                  )}
                </div>
              </div>
            </MediaQuery>
          ) : null}
        </div>
      </div>
    </>
  );
};
