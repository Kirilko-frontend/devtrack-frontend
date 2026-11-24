import { Skeleton } from '@/shared/ui';

import styles from './styles.module.scss';

/** Repeats the bento dashboard layout (stats, funnel, chart, interviews, table) while data loads. */
function DashboardSkeleton() {
  return (
    <div className={styles['dashboard-skeleton']} role="status" aria-label="Loading dashboard">
      <div className={styles['dashboard-skeleton__stats']}>
        {Array.from({ length: 4 }, (_, index) => (
          <div key={index} className={styles['dashboard-skeleton__segment']}>
            <div className={styles['dashboard-skeleton__row']}>
              <Skeleton width="1.75rem" height="1.75rem" radius="var(--radius-sm)" />
              <Skeleton width="40%" height="0.875rem" />
            </div>
            <Skeleton width="3rem" height="2rem" />
            <Skeleton width="75%" height="0.375rem" radius="var(--radius-full)" />
          </div>
        ))}
      </div>

      <div
        className={`${styles['dashboard-skeleton__panel']} ${styles['dashboard-skeleton__panel--narrow']}`}
      >
        <Skeleton width="45%" height="1.25rem" />
        <Skeleton width="35%" height="0.875rem" />
        {Array.from({ length: 4 }, (_, index) => (
          <Skeleton key={index} height="0.5rem" width={`${90 - index * 20}%`} />
        ))}
      </div>

      <div
        className={`${styles['dashboard-skeleton__panel']} ${styles['dashboard-skeleton__panel--wide']}`}
      >
        <Skeleton width="30%" height="1.25rem" />
        <Skeleton width="45%" height="0.875rem" />
        <Skeleton
          height="auto"
          radius="var(--radius-md)"
          className={styles['dashboard-skeleton__fill']}
        />
      </div>

      <div
        className={`${styles['dashboard-skeleton__panel']} ${styles['dashboard-skeleton__panel--narrow']}`}
      >
        <Skeleton width="55%" height="1.25rem" />
        <Skeleton width="40%" height="0.875rem" />
        <Skeleton height="3.5rem" radius="var(--radius-md)" />
      </div>

      <div
        className={`${styles['dashboard-skeleton__panel']} ${styles['dashboard-skeleton__panel--wide']}`}
      >
        <Skeleton width="30%" height="1.25rem" />
        {Array.from({ length: 3 }, (_, index) => (
          <Skeleton key={index} height="2.5rem" radius="var(--radius-md)" />
        ))}
      </div>
    </div>
  );
}

export default DashboardSkeleton;
