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
import { Table } from '@/widgets';

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

      <Table
        data={vacancies}
        getRowKey={(vacancy) => vacancy.id}
        columns={[
          {
            key: 'title',
            label: 'Title',
          },
          {
            key: 'salary',
            label: 'Salary',
          },
          {
            key: 'status',
            label: 'Status',
          },
          {
            key: 'url',
            label: 'Link',
            render: (vacancy) =>
              vacancy.url ? (
                <a href={vacancy.url} target="_blank" rel="noreferrer">
                  View vacancy
                </a>
              ) : (
                '—'
              ),
          },
        ]}
      />
    </div>
  );
}

export default RecentVacancies;
