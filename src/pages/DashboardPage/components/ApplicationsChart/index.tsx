import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import type { DashboardApplicationActivity } from '@/types/dashboard';

import ApplicationsTooltip from './components/ApplicationsTooltip';

import styles from './styles.module.scss';

interface IProps {
  data: DashboardApplicationActivity[];
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
};

function ApplicationsChart({ data }: IProps) {
  return (
    <section className={styles['applications-chart']}>
      <div className={styles['applications-chart__header']}>
        <div>
          <h2 className={styles['applications-chart__title']}>Applications</h2>

          <p className={styles['applications-chart__description']}>Your applications over time</p>
        </div>
      </div>

      <div className={styles['applications-chart__chart']}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="applicationsGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgb(var(--color-accent))" stopOpacity={0.25} />

                <stop offset="100%" stopColor="rgb(var(--color-accent))" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid stroke="rgb(var(--color-black))" strokeOpacity={0.06} vertical={false} />

            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickFormatter={formatDate}
              tick={{
                fontSize: 12,
                fill: 'rgb(var(--color-black))',
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
                fill: 'rgb(var(--color-black))',
                opacity: 0.5,
              }}
            />

            <Tooltip
              content={<ApplicationsTooltip />}
              cursor={{
                stroke: 'rgb(var(--color-black))',
                strokeOpacity: 0.1,
              }}
            />

            <Area
              type="monotone"
              dataKey="count"
              stroke="rgb(var(--color-accent))"
              strokeWidth={2}
              fill="url(#applicationsGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

export default ApplicationsChart;
