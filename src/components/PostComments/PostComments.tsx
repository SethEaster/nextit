import { Post } from 'components/Post/Post';
import {
  PostComment,
  SkeletonComment,
} from 'components/PostComment/PostComment';
import { motion } from 'framer-motion';
import { FC } from 'react';
import { useComments } from 'queries/useComments';
import { usePost } from 'queries/usePost';
import styles from './PostComments.module.scss';

export const PostComments: FC<{ subreddit: string; postId: string }> = ({
  subreddit,
  postId,
}) => {
  const post = usePost(postId);
  const comments = useComments(subreddit, postId);

  return (
    <div className={styles.postComments}>
      {post.isSuccess && (
        <>
          <motion.div initial={false} animate={{ opacity: 1 }}>
            <Post post={post.data!} subreddit={subreddit}></Post>
            {comments.isLoading && (
              <div className={styles.skeletonContainer}>
                {Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <SkeletonComment key={i}></SkeletonComment>
                  ))}
              </div>
            )}
            {comments.isSuccess &&
              comments.data
                ?.filter(comment => comment.data.author !== '[deleted]')
                .map(comment => (
                  <PostComment
                    commentId={comment.data.id}
                    key={comment.data.id}
                  ></PostComment>
                ))}
          </motion.div>
        </>
      )}
    </div>
  );
};
