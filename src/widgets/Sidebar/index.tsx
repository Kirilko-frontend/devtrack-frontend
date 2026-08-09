import { NavLink } from 'react-router-dom';

import { navigation } from './config';

import styles from './styles.module.scss';

export function Sidebar() {
  return (
    <aside className={styles['sidebar']}>
      <nav>
        {navigation.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => (isActive ? styles['active'] : styles['link'])}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
