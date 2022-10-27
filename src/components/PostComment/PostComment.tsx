import {
  faArrowDown,
  faArrowUp,
  faUpRightAndDownLeftFromCenter,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import { useVote } from 'mutations/useUpvote';
import { processTextBodyHtml } from 'processTextBodyHtml';
import { useComment } from 'queries/useComment';
import { FC, useEffect, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import { Reddit } from 'reddit.types';
import styles from './PostComment.module.scss';

export const PostComment: FC<{
  commentId: string;
  isReply?: boolean;
  depth?: number;
  index?: number;
  last?: boolean;
}> = ({ commentId, isReply, depth = 0, index = 0, last }) => {
  const { data: comment } = useComment(commentId);

  if (!comment) return <></>;

  const vote = useVote('comment', comment.id);

  const [avatarLoaded, setAvatarLoaded] = useState(false);
  const [collapsed, setCollapsed] = useState(depth > 3);

  const handleVote = (dir: Reddit.Vote) => () => {
    if (dir == Reddit.Vote.Up && comment.likes === true) dir = 0;
    if (dir == Reddit.Vote.Down && comment.likes === false) dir = 0;

    vote.mutateAsync({ dir });
  };

  const replies = comment.replies?.data?.children?.filter(
    entry => entry.kind === 't1'
  );

  return (
    <div
      className={classNames(styles.comment, {
        [styles.reply]: isReply,
        [styles.collapsed]: collapsed,
      })}
      onClick={() => console.log(comment)}
      // style={{ paddingBottom: last ? 0 : undefined }}
    >
      <div className={styles.left}>
        <div className={styles.authorRow}>
          <img
            className={styles.authorAvatar}
            src={comment.profile_img}
            onLoad={() => setAvatarLoaded(true)}
            style={{ display: avatarLoaded ? 'flex' : 'none' }}
          ></img>
          {!avatarLoaded && (
            <Skeleton
              className={styles.authorAvatar}
              baseColor="#eee"
              highlightColor="#fff"
              duration={1}
            ></Skeleton>
          )}
        </div>
        {collapsed ? (
          <>
            <div className={styles.expand} onClick={() => setCollapsed(false)}>
              <FontAwesomeIcon
                icon={faUpRightAndDownLeftFromCenter}
              ></FontAwesomeIcon>
            </div>
          </>
        ) : (
          <div
            className={styles.threadlineWrapper}
            onClick={() => setCollapsed(true)}
          >
            <div className={styles.threadline}></div>
          </div>
        )}
      </div>
      <div className={styles.right}>
        <div className={styles.authorRow}>
          <div className={styles.author}>
            <div className={styles.authorNameAndFlair}>
              <div className={styles.authorName}>/u/{comment.author}</div>
              {comment.author_flair_text !== null && (
                <div className={styles.authorFlair}>
                  {comment.author_flair_text}
                </div>
              )}
            </div>
          </div>
        </div>
        {!collapsed && (
          <>
            <div className={styles.body}>
              <div
                dangerouslySetInnerHTML={{
                  __html: processTextBodyHtml(comment.body_html),
                }}
              ></div>
            </div>
            <div className={styles.actions}>
              <div
                className={classNames(styles.action, styles.updoot, {
                  [styles.activeVote]: comment.likes === true,
                })}
                onClick={handleVote(Reddit.Vote.Up)}
              >
                <FontAwesomeIcon icon={faArrowUp}></FontAwesomeIcon>
              </div>
              <div className={styles.score}>{comment.score}</div>
              <div
                className={classNames(styles.action, styles.downdoot, {
                  [styles.activeVote]: comment.likes === false,
                })}
                onClick={handleVote(Reddit.Vote.Down)}
              >
                <FontAwesomeIcon icon={faArrowDown}></FontAwesomeIcon>
              </div>
              {/* <div className={styles.action}>Reply</div>
              <div className={styles.action}>Share</div>
              <div className={styles.action}>Report</div>
              <div className={styles.action}>Save</div>
              <div className={styles.action}>Follow</div> */}
            </div>
            <div className={styles.replies}>
              {replies?.map((reply, idx) => (
                <PostComment
                  commentId={reply.data.id}
                  isReply={true}
                  depth={depth + 1}
                  index={idx}
                  last={idx == replies.length - 1}
                ></PostComment>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export const SkeletonComment: FC = () => {
  const [randomLines, setRandomLines] = useState(0);
  const [randomWidth, setRandomWidth] = useState(50);

  useEffect(() => {
    setRandomWidth(40 + Math.floor(Math.random() * 100));
    setRandomLines(1 + Math.floor(Math.random() * 2));
  }, []);

  return (
    <div className={styles.comment}>
      <div className={styles.left}>
        <div className={styles.authorRow}>
          <Skeleton className={styles.authorAvatar}></Skeleton>
        </div>
      </div>

      <div className={styles.right}>
        <div className={styles.authorRow}>
          <div className={styles.author}>
            <div className={styles.authorNameAndFlair}>
              <Skeleton style={{ width: randomWidth }}></Skeleton>
              <div className={styles.authorName}></div>
            </div>
          </div>
        </div>
        <div className={styles.body}>
          <Skeleton count={randomLines}></Skeleton>
        </div>
        <div className={styles.actions}>
          <Skeleton
            style={{ width: 200 }}
            containerClassName={styles.skeleton}
          ></Skeleton>
        </div>
      </div>
    </div>
  );
};
