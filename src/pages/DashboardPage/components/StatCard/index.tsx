import { Info } from 'lucide-react';

import styles from './styles.module.scss';

interface IProps {
  label: string;
  value: number;
  icon: React.ReactNode;
  className?: string;
}

function StatCard({ label, value, icon, className }: IProps) {
  return (
    <div className={`${styles['stat-card']} ${className ?? ''}`}>
      <div className={styles['stat-card__header']}>
        <div className={styles['stat-card__title']}>
          <div className={styles['stat-card__header-icon']}>{icon}</div>

          <p className={styles['stat-card__header-label']}>{label}</p>
        </div>

        <Info className={styles['stat-card__header-details-icon']} />
      </div>

      <p className={styles['stat-card__value']}>{value}</p>
    </div>
  );
}
export default StatCard;
