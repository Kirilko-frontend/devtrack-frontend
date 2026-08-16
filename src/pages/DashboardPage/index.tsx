import { useEffect, useState } from 'react';

import type { DashboardResponse } from '@/types/dashboard';

import { dashboardStats } from './config';

import { dashboardService } from '@/services';
import { ApplicationsChart, StatCard, UpcomingInterviews } from './components';

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
    return <div>Loading...</div>;
  }

  return (
    <div className={`${styles['dashboard-page']} page`}>
      <div className={styles['dashboard-page__stats']}>
        {dashboardStats.map(({ key, changeKey, label, icon: Icon }) => (
          <StatCard
            key={key}
            label={label}
            value={dashboard.stats[key]}
            change={dashboard.statsChanges[changeKey]}
            icon={<Icon size={20} />}
          />
        ))}
      </div>
      <main className={styles['dashboard-page__main']}>
        <ApplicationsChart data={dashboard.applicationActivity} />
        <UpcomingInterviews interviews={dashboard.upcomingInterviews} />
      </main>
    </div>
  );
}

export default DashboardPage;
