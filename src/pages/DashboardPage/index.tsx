import { useEffect, useState } from 'react';

import type { DashboardResponse } from '@/types/dashboard';

import { dashboardService } from '@/services';
import StatCard from '@/pages/DashboardPage/components/StatCard';
import ApplicationsChart from './components/ApplicationsChart';

import { dashboardStats } from './config';

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

  console.log(dashboard.applicationActivity);

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
      <ApplicationsChart data={dashboard.applicationActivity} />
    </div>
  );
}

export default DashboardPage;
