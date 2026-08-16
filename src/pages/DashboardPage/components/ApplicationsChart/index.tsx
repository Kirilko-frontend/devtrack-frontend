import { useState } from 'react';

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

  return (
    <div className={styles['applications-chart']}>
      <div className={styles['applications-chart__header']}>
        <div>
          <h2 className={styles['applications-chart__title']}>Applications</h2>

          <p className={styles['applications-chart__description']}>Your applications over time</p>
        </div>

        <div className={styles['applications-chart__filters']}>
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
          <BarChart data={data}>
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
              content={<ApplicationsTooltip />}
              cursor={{
                fill: 'rgb(var(--color-white))',
                fillOpacity: 0.03,
              }}
            />

            <Bar
              dataKey="count"
              fill="rgb(var(--color-accent))"
              radius={[6, 6, 0, 0]}
              maxBarSize={32}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default ApplicationsChart;
