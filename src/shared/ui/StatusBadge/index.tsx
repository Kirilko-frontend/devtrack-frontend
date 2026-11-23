import { vacancyStatusOptions } from '@/shared/constants/vacancies';
import type { VacancyStatus } from '@/types/vacancy';

import styles from './styles.module.scss';

interface IStatusBadgeProps {
  status: VacancyStatus;
}

const statusLabels = Object.fromEntries(
  vacancyStatusOptions.map(({ value, label }) => [value, label])
) as Record<VacancyStatus, string>;

/** Colored pill for a vacancy status (SAVED, APPLIED, INTERVIEWING, OFFERED, REJECTED). */
function StatusBadge({ status }: IStatusBadgeProps) {
  return (
    <span
      className={`${styles['status-badge']} ${styles[`status-badge--${status.toLowerCase()}`]}`}
    >
      <span className={styles['status-badge__dot']} aria-hidden="true" />
      {statusLabels[status]}
    </span>
  );
}

export default StatusBadge;
