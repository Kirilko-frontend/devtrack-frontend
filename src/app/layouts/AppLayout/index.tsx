import { Outlet } from 'react-router-dom';

import { Sidebar, TopBar } from '@/widgets';

import styles from './styles.module.scss';

function AppLayout() {
  return (
    <div className={styles['layout']}>
      <Sidebar />

      <div className={styles['content-area']}>
        <TopBar />

        <main className={styles['main']}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AppLayout;
