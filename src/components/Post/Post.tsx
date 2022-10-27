import {
  faComments,
  faShareFromSquare,
} from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import millify from 'millify';
import Head from 'next/head';
import Link from 'next/link';
import { processTextBodyHtml } from 'processTextBodyHtml';
import { FC } from 'react';
import ReactPlayer from 'react-player';
import { useMediaQuery } from 'react-responsive';
import { Reddit } from 'reddit.types';
import styles from './Post.module.scss';

const IMAGE_EXTENSIONS = ['.jpg', '.png', '.gif', '.jpeg', '.webp', '.svg'];

export const Gallery: FC<{ images: Array<string> }> = ({ images }) => {
  return <div></div>;
};

export const RedditVideo: FC<{ dashUrl: string }> = ({ dashUrl }) => {
  const isSmall = useMediaQuery({ maxWidth: '768px' });

  return (
    <ReactPlayer
      className={styles.video}
      url={dashUrl}
      controls
      width="auto"
      height={isSmall ? '300px' : '400px'}
      config={{
        file: {
          hlsOptions: {
            abrEwmaDefaultEstimate: 10000000,
          },
        },
      }}
    />
  );
};

export const Post: FC<{
  subreddit: string;
  post: Reddit.Link;
  listing?: boolean;
}> = ({ subreddit, post, listing }) => {
  const href = `/r/${subreddit}/comments/${post.id}`;

  const renderLink = () => {
    const media = post.media_metadata;

    if (post.is_gallery && media) {
      return (
        <div className={styles.gallery}>
          {Object.keys(media).map((imageId, idx) => {
            let extension: string | null = null;

            switch (media[imageId].m) {
              case 'image/jpg':
                extension = 'jpg';
                break;
              case 'image/png':
                extension = 'png';
                break;
              default:
                return null;
            }

            const url = `https://i.redd.it/${imageId}.${extension}`;

            return (
              <div className={styles.image} key={idx}>
                <a href={url} target="_blank">
                  <img src={url}></img>
                </a>
              </div>
            );
          })}
        </div>
      );
    } else if (post.is_video) {
      return (
        <RedditVideo dashUrl={post.media!.reddit_video.dash_url}></RedditVideo>
      );
    } else if (IMAGE_EXTENSIONS.some(ext => post.url.endsWith(ext))) {
      return listing ? (
        <Link href={href} passHref scroll={true}>
          <div className={styles.image}>
            <img src={post.url}></img>
          </div>
        </Link>
      ) : (
        <a href={post.url} target="_blank">
          <div className={styles.image}>
            <img src={post.url}></img>
          </div>
        </a>
      );
    }

    return (
      <div className={styles.url}>
        <a href={post.url} target="_blank">
          {/* {post.url} */}
        </a>
      </div>
    );
  };

  const postDate = new Date(post.created_utc * 1000);

  console.log(post.url);

  return (
    <>
      {!listing ? (
        <Head>
          <title>{`${post.title} | Nextit`}</title>
        </Head>
      ) : null}
      <div className={styles.post} onClick={() => console.log(post)}>
        {subreddit != post.subreddit ? (
          <Link href={`/r/${post.subreddit}`} title={post.sr_detail?.title}>
            <div className={styles.subreddit}>
              {post.sr_detail?.icon_img ? (
                <img src={post.sr_detail?.icon_img} className={styles.icon} />
              ) : null}
              r/{post.subreddit}
            </div>
          </Link>
        ) : null}
        <div className={styles.header}>
          <div className={styles.updoots}>
            {/* <div className={styles.updoot}>
            <img src="/assets/images/doot.png"></img>
          </div> */}
            <div className={styles.count}>
              {millify(post.score, { lowercase: true })}
            </div>
            {/* <div className={styles.downdoot}>
            <img src="/assets/images/doot.png"></img>
          </div> */}
          </div>
          <div className={styles.authorAndDate}>
            <div className={styles.author}>{`/u/${post.author}`}</div>
            <div className={styles.date} title={postDate.toLocaleString()}>
              {/* {timeAgo.format(postDate)} */}
            </div>
          </div>
        </div>
        <Link href={href} passHref scroll={true}>
          <div className={styles.title}>{post.title}</div>
        </Link>
        {post.link_flair_text && (
          <div className={styles.flair}>{post.link_flair_text}</div>
        )}
        {!['www.reddit.com', 'i.redd.it', 'v.redd.it'].includes(
          // HACK: The replace here gets rid of invalid characters that can't be parsed
          new URL(post.url.replace(/[^\x00-\x7F]/g, '')).hostname
        ) && (
          <div className={styles.postUrl}>
            <a href={post.url} target="_blank">
              {post.url}
            </a>
          </div>
        )}
        <div
          className={classNames(styles.content, {
            [styles.contentCentered]:
              post.is_video ||
              post.is_gallery ||
              ['png', 'jpg', 'webp'].includes(post.url.split('.').pop()!),
          })}
        >
          {post.selftext !== '' &&
            (listing ? (
              <Link
                href={`/r/${subreddit}/comments/${post.id}`}
                passHref
                scroll={true}
              >
                <div
                  className={classNames(
                    styles.selftext,
                    styles.selftextClipped
                  )}
                  dangerouslySetInnerHTML={{
                    __html: processTextBodyHtml(post.selftext_html, true),
                  }}
                />
              </Link>
            ) : (
              <div
                className={styles.selftext}
                dangerouslySetInnerHTML={{
                  __html: processTextBodyHtml(post.selftext_html),
                }}
              />
            ))}
          <>{renderLink()}</>
        </div>
        <div className={styles.actions}>
          <Link href={href} passHref scroll={true} className={styles.action}>
            <FontAwesomeIcon icon={faComments} style={{ padding: '0 8px' }} />{' '}
            {post.num_comments} comments
          </Link>
          <Link href={'#'} passHref scroll={true} className={styles.action}>
            <FontAwesomeIcon icon={faShareFromSquare} />
          </Link>
        </div>
      </div>
    </>
  );
};
