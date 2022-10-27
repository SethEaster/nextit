import { Navbar, NavigationProps } from 'components/Navbar/Navbar';
import { FC } from 'react';
import styles from './MainLayout.module.scss';

const variants = {
  hidden: { opacity: 0 },
  enter: { opacity: 1 },
  exit: { opacity: 0 },
};

export const MainLayout: FC<NavigationProps> = ({ children, ...props }) => {
  return (
    <>
      <Navbar {...props}></Navbar>
      <div className={styles.mainWrapper}>{children}</div>
    </>
  );
};
