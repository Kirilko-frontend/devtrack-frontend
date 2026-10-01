import { NavLink } from 'react-router-dom';

import { navigation } from './config';

import styles from './styles.module.scss';

function Sidebar() {
  return (
    <div className={styles['sidebar__wrapper']}>
      <aside className={styles['sidebar']}>
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
    </div>
  );
}

export default Sidebar;
