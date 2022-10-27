import classNames from 'classnames';
import { useRouter } from 'next/router';
import { FC } from 'react';
import styles from './SortBar.module.scss';

const SortBarOption: FC<{ displayName: string; name: string }> = ({
  displayName,
  name,
}) => {
  const router = useRouter();

  const handleClick = () => {
    // router.query.sort = name;
    if (router.query.sort !== undefined) {
      router.push({ ...router, query: { ...router.query, sort: name } });
    } else {
      router.push({ ...router, pathname: `${router.pathname}/${name}` });
    }
  };

  const sort = router.query.sort ?? 'hot';

  return (
    <div
      className={classNames(styles.option, {
        [styles.active]: sort === name,
      })}
      onClick={handleClick}
    >
      {displayName}
    </div>
  );
};

export const SortBar: FC = () => {
  return (
    <div className={styles.sortBar}>
      <SortBarOption displayName="Hot" name="hot" />
      <SortBarOption displayName="New" name="new" />
      <SortBarOption displayName="Top" name="top" />
    </div>
  );
};
