import { BriefcaseBusiness } from 'lucide-react';
import { NavLink } from 'react-router-dom';

import { navigation } from './config';

import styles from './styles.module.scss';

export function Sidebar() {
  return (
    <aside className={styles['sidebar']}>
      <div className={styles['sidebar__brand']}>
        <span className={styles['sidebar__brand-icon']}>
          <BriefcaseBusiness size={20} />
        </span>

        <p className={styles['sidebar__brand-name']}>DevTrack</p>
      </div>

      <nav className={styles['sidebar__nav']}>
        {navigation.map(({ label, path, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              isActive ? styles['sidebar__link--active'] : styles['sidebar__link']
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
  );
}
