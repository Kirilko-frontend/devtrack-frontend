import { BriefcaseBusiness, User } from 'lucide-react';
import { useLocation } from 'react-router-dom';

import { useAuth } from '@/app/providers/AuthProvider';
import { navigation } from '../Sidebar/config';

import styles from './styles.module.scss';

function TopBar() {
  const { pathname } = useLocation();
  const { user } = useAuth();

  const currentPage =
    navigation.find((item) => item.path === pathname)?.label ?? 'Dashboard';

  return (
    <header className={styles['topbar']}>
      <div className={styles['topbar__brand']}>
        <span className={styles['topbar__brand-icon']}>
          <BriefcaseBusiness size={18} />
        </span>

        <p className={styles['topbar__brand-name']}>DevTrack</p>
      </div>

      <div className={styles['topbar__page']}>
        <span className={styles['topbar__page-dot']} />

        <p className={styles['topbar__page-name']}>{currentPage}</p>
      </div>

      <div className={styles['topbar__user']}>
        <User className={styles['topbar__user-icon']} size={18} />

        <p className={styles['topbar__user-name']}>{user?.email ?? 'Guest'}</p>
      </div>
    </header>
  );
}

export default TopBar;