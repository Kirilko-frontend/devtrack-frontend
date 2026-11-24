import clsx from 'clsx';

import type { DashboardVacancyStatuses } from '@/types/dashboard';

import { vacancyStatusParts } from '../../config';

import styles from './styles.module.scss';

interface IProps {
  statuses: DashboardVacancyStatuses;
}

/** Stacked bar: how the vacancies split by current status. */
function VacancyStatusBar({ statuses }: IProps) {
  const total = vacancyStatusParts.reduce((sum, { key }) => sum + statuses[key], 0);

  if (!total) {
    return <span className={styles['status-bar__empty']}>No vacancies yet</span>;
  }

  const parts = vacancyStatusParts.filter(({ key }) => statuses[key] > 0);
  const summary = parts.map(({ key, label }) => `${label} ${statuses[key]}`).join(', ');

  return (
    <div className={styles['status-bar']} role="img" aria-label={`By status: ${summary}`}>
      {parts.map(({ key, label }, index) => (
        <span
          key={key}
          className={clsx(styles['status-bar__part'], styles[`status-bar__part--${key}`])}
          style={{ flexGrow: statuses[key], animationDelay: `${400 + index * 80}ms` }}
          title={`${label}: ${statuses[key]}`}
        />
      ))}
    </div>
  );
}

export default VacancyStatusBar;
