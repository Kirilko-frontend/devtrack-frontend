import type { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';

import styles from './styles.module.scss';

interface IPageTransitionProps {
  children: ReactNode;
}

/**
 * Plays an enter animation on every route change.
 * key={pathname} remounts the wrapper, which restarts the CSS animation.
 */
function PageTransition({ children }: IPageTransitionProps) {
  const { pathname } = useLocation();

  return (
    <div key={pathname} className={styles['page-transition']}>
      {children}
    </div>
  );
}

export default PageTransition;
