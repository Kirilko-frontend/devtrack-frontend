import { useMemo, useState } from 'react';
import type { CSSProperties } from 'react';

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import { applicationPeriods, type ApplicationPeriod } from './config';

import type { DashboardApplicationActivity } from '@/types/dashboard';
import { formatDate } from '@/shared/utils';

import ApplicationsTooltip from './components/ApplicationsTooltip';

import styles from './styles.module.scss';

interface IProps {
  data: DashboardApplicationActivity[];
}

function ApplicationsChart({ data }: IProps) {
  const [period, setPeriod] = useState<ApplicationPeriod>('30D');

  const filteredData = useMemo(() => {
    const now = new Date();
    const from = new Date(now);

    switch (period) {
      case '7D':
        from.setDate(now.getDate() - 7);
        break;

      case '30D':
        from.setDate(now.getDate() - 30);
        break;

      case '3M':
        from.setMonth(now.getMonth() - 3);
        break;

      case '1Y':
        from.setFullYear(now.getFullYear() - 1);
        break;
    }

    return data.filter(({ date }) => {
      const applicationDate = new Date(date);

      return applicationDate >= from && applicationDate <= now;
    });
  }, [data, period]);

  return (
    <div className={styles['applications-chart']}>
      <div className={styles['applications-chart__header']}>
        <div>
          <h2 className={styles['applications-chart__title']}>Applications</h2>

          <p className={styles['applications-chart__description']}>Your applications over time</p>
        </div>

        <div
          className={styles['applications-chart__filters']}
          style={
            {
              '--count': applicationPeriods.length,
              '--active': applicationPeriods.findIndex(({ value }) => value === period),
            } as CSSProperties
          }
        >
          {applicationPeriods.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              className={`${styles['applications-chart__filter']} ${
                period === value ? styles['applications-chart__filter--active'] : ''
              }`}
              onClick={() => setPeriod(value)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className={styles['applications-chart__chart']}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={filteredData}>
            <defs>
              <linearGradient id="applications-bar" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgb(255, 178, 92)" />
                <stop offset="100%" stopColor="rgb(var(--color-accent))" stopOpacity={0.7} />
              </linearGradient>
            </defs>

            <CartesianGrid stroke="rgb(var(--color-white))" strokeOpacity={0.06} vertical={false} />

            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickFormatter={formatDate}
              tick={{
                fontSize: 12,
                fill: 'rgb(var(--color-white))',
                opacity: 0.5,
              }}
            />

            <YAxis
              allowDecimals={false}
              tickLine={false}
              axisLine={false}
              width={30}
              tick={{
                fontSize: 12,
                fill: 'rgb(var(--color-white))',
                opacity: 0.5,
              }}
            />

            <Tooltip
              content={(props) => <ApplicationsTooltip {...props} />}
              cursor={{
                fill: 'rgb(var(--color-accent))',
                fillOpacity: 0.06,
                radius: 6,
              }}
            />

            <Bar
              dataKey="count"
              fill="url(#applications-bar)"
              radius={[6, 6, 0, 0]}
              maxBarSize={32}
              animationDuration={900}
              animationEasing="ease-out"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default ApplicationsChart;
