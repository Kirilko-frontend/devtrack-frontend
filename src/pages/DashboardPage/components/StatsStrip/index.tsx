import type { ReactNode } from 'react';

import type { DashboardResponse, DashboardStats } from '@/types/dashboard';
import { formatTime } from '@/shared/utils';

import StatSegment from './components/StatSegment';
import VacancyStatusBar from './components/VacancyStatusBar';
import { SEGMENT_STAGGER_MS, dashboardStats } from './config';

import styles from './styles.module.scss';

interface IProps {
  dashboard: DashboardResponse;
}

const formatAverage = (value: number) => String(Math.round(value * 10) / 10);

/** One panel with four key numbers; each one gets a context line built from dashboard data. */
function StatsStrip({ dashboard }: IProps) {
  const { stats, statsChanges, vacancyStatuses, upcomingInterviews } = dashboard;
  const nextInterview = upcomingInterviews[0];

  const contexts: Record<keyof DashboardStats, ReactNode> = {
    totalVacancies: <VacancyStatusBar statuses={vacancyStatuses} />,

    totalCompanies: (
      <span className={styles['stats-strip__text']}>
        {stats.totalCompanies
          ? `${formatAverage(stats.totalVacancies / stats.totalCompanies)} vacancies per company`
          : 'No companies yet'}
      </span>
    ),

    totalInterviews: (
      <span className={styles['stats-strip__text']}>
        {nextInterview ? (
          <>
            Next:{' '}
            <strong>
              {new Date(nextInterview.date).toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
              })}
              , {formatTime(nextInterview.date)}
            </strong>
          </>
        ) : (
          'Nothing scheduled'
        )}
      </span>
    ),

    totalResumes: <span className={styles['stats-strip__text']}>In your library</span>,
  };

  return (
    <section className={styles['stats-strip']} aria-label="Key numbers">
      {dashboardStats.map(({ key, changeKey, label, icon: Icon }, index) => (
        <StatSegment
          key={key}
          label={label}
          icon={<Icon size={15} />}
          value={stats[key]}
          change={statsChanges[changeKey]}
          style={{ animationDelay: `${index * SEGMENT_STAGGER_MS}ms` }}
        >
          {contexts[key]}
        </StatSegment>
      ))}
    </section>
  );
}

export default StatsStrip;
