import { Info, TrendingDown, TrendingUp } from 'lucide-react';

import styles from './styles.module.scss';

interface IProps {
  label: string;
  value: number;
  change: number;
  icon: React.ReactNode;
  className?: string;
}

function StatCard({ label, value, change, icon, className }: IProps) {
  const isPositive = change > 0;
  const isNegative = change < 0;

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

      <div className={styles['stat-card__change']}>
        {isPositive && (
          <TrendingUp
            className={`${styles['stat-card__change-icon']} ${styles['stat-card__change-icon--positive']}`}
          />
        )}
        {isNegative && (
          <TrendingDown
            className={`${styles['stat-card__change-icon']} ${styles['stat-card__change-icon--negative']}`}
          />
        )}

        <span className={styles['stat-card__change-text']}>
          {change > 0 ? '+' : ''}
          {change}% from last week
        </span>
      </div>
    </div>
  );
}

export default StatCard;
