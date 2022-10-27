import classNames from 'classnames';
import { ProfileDropdown } from 'components/ProfileDropdown/ProfileDropdown';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FC, useEffect, useState } from 'react';
import styles from './Navbar.module.scss';

export type NavigationProps = {
  subredditName?: string;
};

export const Navbar: FC<NavigationProps> = ({ subredditName }) => {
  const router = useRouter();

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY != 0);
    };

    document.addEventListener('scroll', onScroll);

    return () => document.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav
      className={classNames(styles.navbar, {
        [styles.scrolled]: scrolled,
      })}
    >
      <div className={styles.navLinks}>
        <Link href={'/'} scroll={true} passHref className={styles.navLink}>
          Home
        </Link>
        <Link
          href={`/${subredditName}`}
          scroll={true}
          passHref
          className={styles.navLink}
        >
          {subredditName}
        </Link>
      </div>
      <ProfileDropdown />
      {/* <div className={styles.me}>
        {me.isSuccess ? (
          <>
            <img className={styles.avatar} src={me.data?.subreddit.icon_img} />
            <div className={styles.username}>
              {me.data?.subreddit.display_name_prefixed}
            </div>
          </>
        ) : (
          <div className={styles.login} onClick={login}>
            Login
          </div>
        )}
      </div> */}
    </nav>
  );
};
