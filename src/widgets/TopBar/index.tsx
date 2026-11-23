import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Building2,
  CalendarPlus,
  ChevronDown,
  FilePlus2,
  KeyRound,
  LogOut,
  Plus,
  Search,
} from 'lucide-react';

import useAuth from '@/app/providers/useAuth';
import { authService } from '@/services';
import { Dropdown, type DropdownItem } from '@/shared/ui';
import { getErrorMessage, notify, requestCreate } from '@/shared/utils';

import CommandPalette from '../CommandPalette';

import styles from './styles.module.scss';

const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.userAgent);

/** "john.doe@mail.com" -> "JD", "admin@gmail.com" -> "AD". */
const getInitials = (email: string) => {
  const [first = '', second = ''] = email.split('@')[0].split(/[._-]+/);

  return (second ? first[0] + second[0] : first.slice(0, 2)).toUpperCase();
};

function TopBar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);

  // Ctrl+K / Cmd+K opens the command palette from any page.
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setIsPaletteOpen((current) => !current);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      notify.info('Logged out', 'You have been signed out.');
      navigate('/login', { replace: true });
    } catch (error) {
      notify.error('Could not log out', getErrorMessage(error));
    }
  };

  const handleSendResetLink = async () => {
    if (!user) {
      return;
    }

    try {
      await authService.forgotPassword(user.email);
      notify.info('Check your inbox', `We sent a password reset link to ${user.email}.`);
    } catch (error) {
      notify.error('Could not send reset link', getErrorMessage(error));
    }
  };

  const createItems: DropdownItem[] = [
    {
      label: 'Vacancy',
      icon: <FilePlus2 size={16} />,
      onSelect: () => {
        requestCreate('vacancy');
        navigate('/vacancies');
      },
    },
    {
      label: 'Company',
      icon: <Building2 size={16} />,
      onSelect: () => {
        requestCreate('company');
        navigate('/companies');
      },
    },
    {
      label: 'Interview',
      icon: <CalendarPlus size={16} />,
      onSelect: () => {
        requestCreate('interview');
        navigate('/interviews');
      },
    },
  ];

  const accountItems: DropdownItem[] = [
    {
      label: 'Send password reset link',
      icon: <KeyRound size={16} />,
      onSelect: () => void handleSendResetLink(),
    },
    {
      label: 'Log out',
      icon: <LogOut size={16} />,
      tone: 'danger',
      onSelect: () => void handleLogout(),
    },
  ];

  const initials = user ? getInitials(user.email) : '?';

  return (
    <header className={styles['topbar']}>
      <button
        type="button"
        className={styles['topbar__search']}
        onClick={() => setIsPaletteOpen(true)}
      >
        <Search size={16} className={styles['topbar__search-icon']} aria-hidden="true" />
        <span className={styles['topbar__search-text']}>Search or jump to…</span>
        <span className={styles['topbar__search-keys']} aria-hidden="true">
          <kbd>{isMac ? '⌘' : 'Ctrl'}</kbd>
          <kbd>K</kbd>
        </span>
      </button>

      <div className={styles['topbar__actions']}>
        <Dropdown
          triggerLabel="Create new"
          triggerClassName={styles['topbar__new']}
          trigger={
            <>
              <Plus size={16} aria-hidden="true" />
              New
            </>
          }
          items={createItems}
        />

        {user && (
          <Dropdown
            triggerLabel="Account menu"
            triggerClassName={styles['topbar__account']}
            trigger={
              <>
                <span className={styles['topbar__avatar']}>{initials}</span>
                <ChevronDown
                  size={14}
                  className={styles['topbar__account-chevron']}
                  aria-hidden="true"
                />
              </>
            }
            header={
              <div className={styles['topbar__account-header']}>
                <span className={styles['topbar__avatar']}>{initials}</span>
                <span className={styles['topbar__account-info']}>
                  <span className={styles['topbar__account-caption']}>Signed in as</span>
                  <span className={styles['topbar__account-email']}>{user.email}</span>
                </span>
              </div>
            }
            items={accountItems}
          />
        )}
      </div>

      {isPaletteOpen && <CommandPalette onClose={() => setIsPaletteOpen(false)} />}
    </header>
  );
}

export default TopBar;
