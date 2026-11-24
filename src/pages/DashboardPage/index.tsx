import { useEffect, useState } from 'react';
import type { CSSProperties } from 'react';

import type { DashboardResponse } from '@/types/dashboard';

import { dashboardStats } from './config';

import { dashboardService } from '@/services';
import {
  ApplicationFunnel,
  ApplicationsChart,
  DashboardSkeleton,
  RecentVacancies,
  StatCard,
  UpcomingInterviews,
} from './components';

import styles from './styles.module.scss';

function DashboardPage() {
  const [dashboard, setDashboard] = useState<DashboardResponse | null>(null);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const data = await dashboardService.getDashboard();
        setDashboard(data);
      } catch (error) {
        console.error('Dashboard error:', error);
      }
    };

    void loadDashboard();
  }, []);

  if (!dashboard) {
    return <DashboardSkeleton />;
  }

  return (
    <div className={styles['dashboard-page']}>
      <div className={styles['dashboard-page__stats']}>
        {dashboardStats.map(({ key, changeKey, label, ariaLabel, icon: Icon }, index) => (
          <StatCard
            key={key}
            style={{ '--i': index } as CSSProperties}
            label={label}
            ariaLabel={ariaLabel}
            value={dashboard.stats[key]}
            change={dashboard.statsChanges[changeKey]}
            icon={<Icon size={20} color="rgb(var(--color-accent))" />}
          />
        ))}
      </div>

      {/* Bento tiles: funnel + chart on the first row, interviews + vacancies on the second. */}
      <div
        className={`${styles['dashboard-page__tile']} ${styles['dashboard-page__tile--funnel']}`}
      >
        <ApplicationFunnel funnel={dashboard.funnel} />
      </div>
      <div className={`${styles['dashboard-page__tile']} ${styles['dashboard-page__tile--chart']}`}>
        <ApplicationsChart data={dashboard.applicationActivity} />
      </div>
      <div
        className={`${styles['dashboard-page__tile']} ${styles['dashboard-page__tile--interviews']}`}
      >
        <UpcomingInterviews interviews={dashboard.upcomingInterviews} />
      </div>
      <div
        className={`${styles['dashboard-page__tile']} ${styles['dashboard-page__tile--vacancies']}`}
      >
        <RecentVacancies vacancies={dashboard.recentVacancies} />
      </div>
    </div>
  );
}

export default DashboardPage;
