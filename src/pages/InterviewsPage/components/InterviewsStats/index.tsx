import type { Interview } from '@/types/interviews';

import { getInterviewStats } from '@/shared/utils/interviews';
import { interviewStats } from './config';

import styles from './styles.module.scss';

interface IProps {
  interviews: Interview[];
}

function InterviewsStats({ interviews }: IProps) {
  const stats = getInterviewStats(interviews);

  return (
    <div className={styles['interviews-stats']}>
      {interviewStats.map(({ key, label }) => (
        <div key={key} className={styles['interviews-stats__item']}>
          <span className={styles['interviews-stats__label']}>{label}</span>

          <strong className={styles['interviews-stats__value']}>{stats[key]}</strong>
        </div>
      ))}
    </div>
  );
}

export default InterviewsStats;
