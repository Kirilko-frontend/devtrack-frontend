import { Outlet } from 'react-router-dom';

import { Sidebar } from '@/widgets/Sidebar';

import styles from './styles.module.scss';

function AppLayout() {
  return (
    <div className={styles['layout']}>
      <Sidebar />

      <main className={styles['main']}>
        <Outlet />
      </main>
    </div>
  );
}

export default AppLayout;
