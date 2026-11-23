import { useLayoutEffect, useRef } from 'react';
import type { CSSProperties } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

import { navigation } from './config';

import styles from './styles.module.scss';

function Sidebar() {
  const { pathname } = useLocation();
  const navRef = useRef<HTMLElement>(null);

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

  return (
    <div className={styles['sidebar__wrapper']}>
      <aside className={styles['sidebar']}>
        <nav ref={navRef} className={styles['sidebar__nav']}>
          <span className={styles['sidebar__indicator']} aria-hidden="true" />

          {navigation.map(({ label, path, icon: Icon }, index) => (
            <NavLink
              key={path}
              to={path}
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
      </aside>
    </div>
  );
}

export default Sidebar;
