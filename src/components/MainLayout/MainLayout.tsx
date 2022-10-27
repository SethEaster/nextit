import { Navbar, NavigationProps } from 'components/Navbar/Navbar';
import { FC } from 'react';
import styles from './MainLayout.module.scss';

import { Nunito } from '@next/font/google';

const nunito = Nunito();

export const MainLayout: FC<NavigationProps> = ({ children, ...props }) => {
  return (
    <main className={nunito.className}>
      <Navbar {...props}></Navbar>
      <div className={styles.mainWrapper}>{children}</div>
    </main>
  );
};
