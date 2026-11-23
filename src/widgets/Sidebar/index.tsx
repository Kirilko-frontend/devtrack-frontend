import { useLayoutEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';

import { Logo } from '@/shared/ui';

import { navigation } from './config';

import styles from './styles.module.scss';

const COLLAPSED_STORAGE_KEY = 'devtrack:sidebar-collapsed';

// localStorage can be unavailable (private mode, blocked storage) — fall back to expanded.
const readCollapsed = () => {
  try {
    return localStorage.getItem(COLLAPSED_STORAGE_KEY) === '1';
  } catch {
    return false;
  }
};

const saveCollapsed = (isCollapsed: boolean) => {
  try {
    localStorage.setItem(COLLAPSED_STORAGE_KEY, isCollapsed ? '1' : '0');
  } catch {
    // Not critical: the sidebar just won't remember its state.
  }
};

function Sidebar() {
  const { pathname } = useLocation();
  const navRef = useRef<HTMLElement>(null);
  const [isCollapsed, setIsCollapsed] = useState(readCollapsed);

  // Moves the highlight pill under the active link. Writes CSS variables directly,
  // so the animation is handled by CSS and doesn't cause re-renders.
  useLayoutEffect(() => {
    const nav = navRef.current;

    if (!nav) {
      return;
    }

    const moveIndicator = () => {
      const activeLink = nav.querySelector<HTMLElement>('[aria-current="page"]');

      nav.style.setProperty('--indicator-y', `${activeLink?.offsetTop ?? 0}px`);
      nav.style.setProperty('--indicator-height', `${activeLink?.offsetHeight ?? 0}px`);
      nav.style.setProperty('--indicator-opacity', activeLink ? '1' : '0');
    };

    moveIndicator();

    const resizeObserver = new ResizeObserver(moveIndicator);
    resizeObserver.observe(nav);

    return () => resizeObserver.disconnect();
  }, [pathname]);

  const toggleCollapsed = () => {
    const next = !isCollapsed;

    setIsCollapsed(next);
    saveCollapsed(next);
  };

  return (
    <div
      className={`${styles['sidebar__wrapper']} ${
        isCollapsed ? styles['sidebar__wrapper--collapsed'] : ''
      }`}
    >
      <aside className={styles['sidebar']}>
        <div className={styles['sidebar__brand']}>
          <Logo size={34} variant="intro" className={styles['sidebar__logo']} />
          <span className={styles['sidebar__brand-name']}>DevTrack</span>
        </div>

        <nav ref={navRef} className={styles['sidebar__nav']}>
          <span className={styles['sidebar__indicator']} aria-hidden="true" />

          {navigation.map(({ label, path, icon: Icon }, index) => (
            <NavLink
              key={path}
              to={path}
              data-label={label}
              style={{ '--i': index } as CSSProperties}
              className={({ isActive }) =>
                `${styles['sidebar__link']} ${isActive ? styles['sidebar__link--active'] : ''}`
              }
            >
              <span className={styles['sidebar__link-icon']}>
                <Icon size={18} />
              </span>
              <p className={styles['sidebar__link-label']}>{label}</p>
            </NavLink>
          ))}
        </nav>

        <button
          type="button"
          className={styles['sidebar__toggle']}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-expanded={!isCollapsed}
          data-label={isCollapsed ? 'Expand' : 'Collapse'}
          onClick={toggleCollapsed}
        >
          <span className={styles['sidebar__link-icon']}>
            {isCollapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
          </span>
          <span className={styles['sidebar__link-label']}>Collapse</span>
        </button>
      </aside>
    </div>
  );
}

export default Sidebar;
