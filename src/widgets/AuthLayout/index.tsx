import type { ReactNode } from 'react';

import { formImg } from './config';

import styles from './styles.module.scss';

interface IAuthLayoutProps {
  children: ReactNode;
}

function AuthLayout({ children }: IAuthLayoutProps) {
  return (
    <div className={`${styles['auth-layout']} page`}>
      <div className={styles['auth-layout__wrapper']}>
        <div className={styles['auth-layout__image']}>
          <img src={formImg} alt="form-image" />
        </div>
        <div className={styles['auth-layout__content']}>{children}</div>
      </div>
    </div>
  );
}

export default AuthLayout;
