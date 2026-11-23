import type { ReactNode } from 'react';
import { BriefcaseBusiness } from 'lucide-react';

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
            <span className={styles['auth-layout__brand-icon']}>
              <BriefcaseBusiness size={20} aria-hidden="true" />
            </span>

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
