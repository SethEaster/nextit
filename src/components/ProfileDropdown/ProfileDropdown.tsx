import { faUser } from '@fortawesome/free-regular-svg-icons';
import { faPersonRunning } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import classNames from 'classnames';
import * as crypto from 'crypto';
import { motion } from 'framer-motion';
import router from 'next/router';
import { queryClient } from 'pages/_app';
import { FC, useRef, useState } from 'react';
import { useOutsideAlerter } from 'hooks/useOutsideAlerter';
import { useMe } from 'queries/useMe';
import { useGlobal } from 'stores/global';
import styles from './ProfileDropdown.module.scss';

export const ProfileDropdown: FC = () => {
  const me = useMe();
  const ref = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  useOutsideAlerter(ref, () => {
    setOpen(false);
  });

  const doLogin = () => {
    if (me.isLoading) return;

    const url = new URL('https://www.reddit.com/api/v1/authorize');
    url.searchParams.set('client_id', process.env.NEXT_PUBLIC_REDDIT_CLIENT_ID);
    url.searchParams.set('response_type', 'code');
    url.searchParams.set(
      'redirect_uri',
      process.env.NEXT_PUBLIC_REDDIT_REDIRECT_URL
    );
    url.searchParams.set('duration', 'permanent');
    url.searchParams.set('state', crypto.randomBytes(20).toString('hex'));

    const scope = encodeURIComponent(
      [
        'identity',
        'edit',
        'flair',
        'history',
        'mysubreddits',
        'read',
        'report',
        'save',
        'submit',
        'subscribe',
        'vote',
      ].join(' ')
    );

    // HACK: URLSearchParams.set will not encode the scope the way Reddit wants it
    const finalUrl = `${url.href}&scope=${scope}`;

    window.location.href = finalUrl;
  };

  const doLogout = async () => {
    await axios.post('/api/logout');
    useGlobal.getState().setRedditAccessToken('');
    queryClient.invalidateQueries(['me']);
    router.replace('/');
  };

  return (
    <div
      className={classNames(styles.dropdown, {
        [styles.open]: open,
        [styles.loggedIn]: me.data,
      })}
    >
      {me.data ? (
        <div className={styles.user} onClick={() => setOpen(!open)}>
          <img className={styles.avatar} src={me.data?.subreddit.icon_img} />
          <div className={styles.username}>
            {me.data?.subreddit.display_name_prefixed}
          </div>
        </div>
      ) : !me.isLoading ? (
        <div
          className={classNames(styles.login, {
            [styles.loading]: me.isLoading,
          })}
          onClick={doLogin}
        >
          <FontAwesomeIcon icon={faUser} style={{ padding: '0 4px' }} /> Login
        </div>
      ) : null}
      <motion.div
        className={styles.container}
        initial={{ opacity: 0, scaleY: 0 }}
        animate={{ opacity: open ? 1 : 0, scaleY: open ? 1 : 0 }}
        transition={{ duration: 0.1 }}
        onClick={() => setOpen(false)}
      >
        <div className={styles.option} onClick={doLogout}>
          <FontAwesomeIcon
            icon={faPersonRunning}
            style={{ padding: '0 4px' }}
          />
          Logout
        </div>
      </motion.div>
    </div>
  );
};
