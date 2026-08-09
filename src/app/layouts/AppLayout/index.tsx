import { Outlet } from 'react-router-dom';

import styles from './styles.module.scss';
import { Sidebar } from '@/widgets/Sidebar';

export function AppLayout() {
  return (
    <div className={styles['layout']}>
      <Sidebar />

      <main className={styles['main']}>
        <Outlet />
      </main>
    </div>
  );
}
