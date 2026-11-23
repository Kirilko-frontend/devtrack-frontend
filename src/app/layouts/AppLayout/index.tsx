import { Outlet } from 'react-router-dom';

import { PageTransition } from '@/shared/ui';
import { Sidebar, TopBar } from '@/widgets';

import styles from './styles.module.scss';

function AppLayout() {
  return (
    <div className={styles['layout']}>
      <Sidebar />

      <div className={styles['content-area']}>
        <TopBar />

        <main className={styles['main']}>
          <PageTransition>
            <Outlet />
          </PageTransition>
        </main>
      </div>
    </div>
  );
}

export default AppLayout;
