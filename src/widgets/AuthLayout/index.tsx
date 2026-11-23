import type { ReactNode } from 'react';

import { Logo } from '@/shared/ui';

import { formImg } from './config';

import styles from './styles.module.scss';

interface IAuthLayoutProps {
  children: ReactNode;
}

function AuthLayout({ children }: IAuthLayoutProps) {
  return (
    <div className={`${styles['auth-layout']} auth`}>
      <div className={styles['auth-layout__wrapper']}>
        <div className={styles['auth-layout__image']}>
          <img src={formImg} alt="" />

          <div className={styles['auth-layout__brand']}>
            <Logo size={48} variant="intro" className={styles['auth-layout__logo']} />

            <p className={styles['auth-layout__brand-name']}>DevTrack</p>
            <p className={styles['auth-layout__brand-tagline']}>
              Every application, interview and offer in one place.
            </p>
          </div>
        </div>
        <div className={styles['auth-layout__content']}>{children}</div>
      </div>
    </div>
  );
}

export default AuthLayout;
