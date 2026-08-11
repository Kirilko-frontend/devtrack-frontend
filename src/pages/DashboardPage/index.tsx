import { useEffect } from 'react';

import { dashboardService } from '@/services';

function DashboardPage() {
  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const data = await dashboardService.getDashboard();

        console.log('Dashboard:', data);
      } catch (error) {
        console.error('Dashboard error:', error);
      }
    };

    void loadDashboard();
  }, []);

  return <div>Dashboard</div>;
}

export default DashboardPage;
