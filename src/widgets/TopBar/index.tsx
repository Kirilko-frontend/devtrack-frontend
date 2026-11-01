import { BriefcaseBusiness, LogOut, User } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

import useAuth from '@/app/providers/useAuth';
import { getErrorMessage, notify } from '@/shared/utils';

import { pageTitles } from './config';

import styles from './styles.module.scss';

function TopBar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const currentPage = pageTitles[pathname] ?? 'Dashboard';

  const handleLogout = async () => {
    try {
      await logout();
      notify.info('Logged out', 'You have been signed out.');
      navigate('/login', { replace: true });
    } catch (error) {
      notify.error('Could not log out', getErrorMessage(error));
    }
  };

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

      <div className={styles['topbar__account']}>
        <div className={styles['topbar__user']}>
          <User className={styles['topbar__user-icon']} size={18} />

          <p className={styles['topbar__user-name']}>{user?.email ?? 'Guest'}</p>
        </div>

        {user && (
          <button
            className={styles['topbar__logout']}
            type="button"
            onClick={() => void handleLogout()}
          >
            <LogOut size={16} aria-hidden="true" />
            <span>Logout</span>
          </button>
        )}
      </div>
    </header>
  );
}

export default TopBar;
