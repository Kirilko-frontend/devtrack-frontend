import { CalendarDays, Clock } from 'lucide-react';

import type { DashboardInterview } from '@/types/dashboard';

import styles from './styles.module.scss';

interface IProps {
  interviews: DashboardInterview[];
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
};

const formatTime = (date: string) => {
  return new Date(date).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });
};

function UpcomingInterviews({ interviews }: IProps) {
  return (
    <div className={styles['upcoming-interviews']}>
      <div className={styles['upcoming-interviews__header']}>
        <div>
          <h2 className={styles['upcoming-interviews__title']}>Upcoming interviews</h2>

          <p className={styles['upcoming-interviews__description']}>Your next interviews</p>
        </div>

        <CalendarDays className={styles['upcoming-interviews__header-icon']} size={20} />
      </div>

      {interviews.length === 0 ? (
        <div className={styles['upcoming-interviews__empty']}>
          <CalendarDays size={24} />

          <p>No upcoming interviews</p>
        </div>
      ) : (
        <ul className={styles['upcoming-interviews__list']}>
          {interviews.map((interview) => (
            <li className={styles['upcoming-interviews__item']} key={interview.id}>
              <div className={styles['upcoming-interviews__item-date']}>
                <p className={styles['upcoming-interviews__item-date-day']}>
                  {formatDate(interview.date)}
                </p>

                <p className={styles['upcoming-interviews__item-date-time']}>
                  <Clock className={styles['upcoming-interviews__item-date-icon']} size={13} />

                  {formatTime(interview.date)}
                </p>
              </div>

              <div className={styles['upcoming-interviews__item-content']}>
                <p className={styles['upcoming-interviews__item-title']}>
                  {interview.vacancy.title}
                </p>

                <p className={styles['upcoming-interviews__item-company']}>
                  {interview.vacancy.company.name}
                </p>
              </div>

              <p className={styles['upcoming-interviews__type']}>{interview.types}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default UpcomingInterviews;
