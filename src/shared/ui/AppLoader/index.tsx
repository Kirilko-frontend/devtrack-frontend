import { BriefcaseBusiness } from 'lucide-react';

import styles from './styles.module.scss';

interface IAppLoaderProps {
  label?: string;
}

/** Full-screen loader with the DevTrack logo, used while the session is being checked. */
function AppLoader({ label = 'Checking session' }: IAppLoaderProps) {
  return (
    <div className={styles['app-loader']} role="status" aria-label={label}>
      <div className={styles['app-loader__logo']}>
        <BriefcaseBusiness size={28} aria-hidden="true" />
      </div>

      <p className={styles['app-loader__name']}>DevTrack</p>

      <span className={styles['app-loader__bar']} aria-hidden="true" />
    </div>
  );
}

export default AppLoader;
