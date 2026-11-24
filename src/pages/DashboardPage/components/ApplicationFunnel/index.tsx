import type { CSSProperties } from 'react';
import { Funnel } from 'lucide-react';
import clsx from 'clsx';

import type { DashboardFunnel } from '@/types/dashboard';

import { BAR_STAGGER_MS, MIN_BAR_PERCENT, funnelStages } from './config';

import styles from './styles.module.scss';

interface IProps {
  funnel?: DashboardFunnel;
}

const percent = (part: number, whole: number) => (whole ? Math.round((part / whole) * 100) : 0);

/**
 * Application funnel: how many vacancies reached each stage and the conversion
 * from the previous stage. Bar width is relative to all tracked vacancies.
 */
function ApplicationFunnel({ funnel }: IProps) {
  const isEmpty = !funnel || funnel.tracked === 0;

  return (
    <section className={styles['funnel']} aria-labelledby="application-funnel-title">
      <header className={styles['funnel__header']}>
        <div>
          <h2 id="application-funnel-title" className={styles['funnel__title']}>
            Application funnel
          </h2>
          <p className={styles['funnel__subtitle']}>How far your applications get</p>
        </div>

        <span className={styles['funnel__icon']} aria-hidden="true">
          <Funnel size={18} />
        </span>
      </header>

      {isEmpty ? (
        <p className={styles['funnel__empty']}>
          {funnel
            ? 'Add vacancies to see how far your applications get.'
            : 'The funnel will appear after the server update.'}
        </p>
      ) : (
        <div className={styles['funnel__body']}>
          <ol className={styles['funnel__stages']}>
            {funnelStages.map(({ key, label, tone }, index) => {
              const count = funnel[key];
              const previous = index > 0 ? funnel[funnelStages[index - 1].key] : null;
              const width = count ? Math.max(percent(count, funnel.tracked), MIN_BAR_PERCENT) : 0;

              return (
                <li
                  key={key}
                  className={clsx(styles['funnel__stage'], styles[`funnel__stage--${tone}`])}
                  style={{ '--delay': `${index * BAR_STAGGER_MS}ms` } as CSSProperties}
                >
                  <span className={styles['funnel__stage-label']}>{label}</span>

                  <div
                    className={styles['funnel__bar']}
                    role="img"
                    aria-label={`${label}: ${count} of ${funnel.tracked} vacancies`}
                  >
                    <span className={styles['funnel__bar-fill']} style={{ width: `${width}%` }} />
                  </div>

                  {/* Conversion from the previous stage; the first stage has none. */}
                  <span
                    className={styles['funnel__stage-conversion']}
                    title={
                      previous !== null
                        ? `${percent(count, previous)}% of the previous stage`
                        : undefined
                    }
                  >
                    {previous !== null && `${percent(count, previous)}%`}
                  </span>

                  <strong className={styles['funnel__stage-count']}>{count}</strong>
                </li>
              );
            })}
          </ol>

          <dl className={styles['funnel__summary']}>
            <div className={styles['funnel__summary-item']}>
              <dt>Response rate</dt>
              <dd>{percent(funnel.interviewing, funnel.applied)}%</dd>
            </div>
            <div className={styles['funnel__summary-item']}>
              <dt>Offer rate</dt>
              <dd>{percent(funnel.offered, funnel.applied)}%</dd>
            </div>
            <div
              className={clsx(
                styles['funnel__summary-item'],
                styles['funnel__summary-item--danger']
              )}
            >
              <dt>Rejected</dt>
              <dd>{funnel.rejected}</dd>
            </div>
          </dl>
        </div>
      )}
    </section>
  );
}

export default ApplicationFunnel;
