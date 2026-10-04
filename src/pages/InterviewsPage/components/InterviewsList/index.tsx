import type { Interview } from '@/types/interviews';

import styles from './styles.module.scss';
import InterviewCard from '../InterviewCard';
import { Empty } from '@/shared/ui';

interface IProps {
  interviews: Interview[];
}

function InterviewsList({ interviews }: IProps) {
  if (!interviews.length) {
    return <Empty title="No interviews found" description="Try changing your search or filters." />;
  }

  return (
    <section className={styles['interviews-list']}>
      <div className={styles['interviews-list__header']}>
        <h2 className={styles['interviews-list__title']}>Interviews</h2>

        <span className={styles['interviews-list__count']}>{interviews.length}</span>
      </div>

      <div className={styles['interviews-list__items']}>
        {interviews.map((interview) => (
          <InterviewCard key={interview.id} interview={interview} />
        ))}
      </div>
    </section>
  );
}

export default InterviewsList;
