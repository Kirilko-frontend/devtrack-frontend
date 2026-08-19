import { useState } from 'react';

import type { DashboardRecentVacancy } from '@/types/dashboard';

import { Input, Select } from '@/shared/ui';

import styles from './styles.module.scss';
import {
  vacancySortOptions,
  vacancyStatusOptions,
  type VacancySort,
  type VacancyStatusFilter,
} from './config';

interface IProps {
  vacancies: DashboardRecentVacancy[];
}

function RecentVacancies({ vacancies }: IProps) {
  const [statusFilter, setStatusFilter] = useState<VacancyStatusFilter>('ALL');
  const [sort, setSort] = useState<VacancySort>('NEWEST');

  return (
    <div className={styles['recent-vacancies']}>
      <div className={styles['recent-vacancies__header']}>
        <div className={styles['recent-vacancies__header-content']}>
          <h1 className={styles['recent-vacancies__title']}>Recent vacancies</h1>

          <Input
            type="search"
            placeholder="Search vacancies"
            className={styles['recent-vacancies__search']}
          />
        </div>

        <div className={styles['recent-vacancies__actions']}>
          <Select
            value={statusFilter}
            options={vacancyStatusOptions}
            onChange={setStatusFilter}
            placeholder="Status"
          />

          <Select
            value={sort}
            options={vacancySortOptions}
            onChange={setSort}
            placeholder="Sort by"
          />
        </div>
      </div>

      <div className={styles['recent-vacancies__table-wrapper']}>
        <table className={styles['recent-vacancies__table']}>
          <thead className={styles['recent-vacancies__table-head']}>
            <tr className={styles['recent-vacancies__table-row']}>
              <th className={styles['recent-vacancies__table-header']}>Title</th>
              <th className={styles['recent-vacancies__table-header']}>Company</th>
              <th className={styles['recent-vacancies__table-header']}>Salary</th>
              <th className={styles['recent-vacancies__table-header']}>Status</th>
              <th className={styles['recent-vacancies__table-header']}>Link</th>
            </tr>
          </thead>

          <tbody className={styles['recent-vacancies__table-body']}>
            {vacancies.map((vacancy) => (
              <tr className={styles['recent-vacancies__table-row']} key={vacancy.id}>
                <td className={styles['recent-vacancies__table-cell']}>{vacancy.title}</td>

                <td className={styles['recent-vacancies__table-cell']}>{vacancy.company.name}</td>

                <td className={styles['recent-vacancies__table-cell']}>{vacancy.salary ?? '—'}</td>

                <td className={styles['recent-vacancies__table-cell']}>{vacancy.status}</td>

                <td className={styles['recent-vacancies__table-cell']}>
                  {vacancy.url ? (
                    <a
                      className={styles['recent-vacancies__link']}
                      href={vacancy.url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      View vacancy
                    </a>
                  ) : (
                    '—'
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default RecentVacancies;
