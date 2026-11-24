import type { CSSProperties, ReactNode } from 'react';
import { Minus, TrendingDown, TrendingUp } from 'lucide-react';
import clsx from 'clsx';

import useCountUp from '@/shared/hooks/useCountUp';

import styles from './styles.module.scss';

interface IProps {
  label: string;
  icon: ReactNode;
  value: number;
  /** Percent change compared to the previous 7 days. */
  change: number;
  /** Context line under the number (status bar, next interview…). */
  children?: ReactNode;
  style?: CSSProperties;
}

/** One segment of the stats strip: label, animated number, weekly change and a context line. */
function StatSegment({ label, icon, value, change, children, style }: IProps) {
  const displayedValue = useCountUp(value);
  const trend = change > 0 ? 'up' : change < 0 ? 'down' : 'flat';
  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;

  return (
    <div className={styles['stat-segment']} style={style}>
      <div className={styles['stat-segment__header']}>
        <span className={styles['stat-segment__icon']} aria-hidden="true">
          {icon}
        </span>
        <span className={styles['stat-segment__label']}>{label}</span>

        <span
          className={clsx(styles['stat-segment__change'], styles[`stat-segment__change--${trend}`])}
          title="Compared to the previous 7 days"
        >
          <TrendIcon size={12} aria-hidden="true" />
          {change > 0 ? '+' : ''}
          {change}%<span className={styles['stat-segment__change-period']}> 7d</span>
        </span>
      </div>

      <p className={styles['stat-segment__value']} aria-label={`${label}: ${value}`}>
        {displayedValue}
      </p>

      <div className={styles['stat-segment__context']}>{children}</div>
    </div>
  );
}

export default StatSegment;
