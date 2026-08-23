import { useState } from 'react';

import type { DashboardRecentVacancy } from '@/types/dashboard';

import {
  vacancySortOptions,
  vacancyStatusOptions,
  type VacancySort,
  type VacancyStatusFilter,
} from '@/shared/constants/vacancies';
import { filterVacancies, searchVacancies, sortVacancies } from '@/shared/utils/vacancies';

import { Input, Select } from '@/shared/ui';
import { Table } from '@/widgets';

import styles from './styles.module.scss';

interface IProps {
  vacancies: DashboardRecentVacancy[];
}

function RecentVacancies({ vacancies }: IProps) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<VacancyStatusFilter>('ALL');
  const [sort, setSort] = useState<VacancySort>('NEWEST');

  const filteredVacancies = filterVacancies(vacancies, statusFilter);

  const searchedVacancies = searchVacancies(filteredVacancies, search);

  const sortedVacancies = sortVacancies(searchedVacancies, sort);

  return (
    <div className={styles['recent-vacancies']}>
      <div className={styles['recent-vacancies__header']}>
        <div className={styles['recent-vacancies__header-content']}>
          <h1 className={styles['recent-vacancies__title']}>Recent vacancies</h1>

          <Input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
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
        data={sortedVacancies}
        getRowKey={(vacancy) => vacancy.id}
        columns={[
          {
            key: 'title',
            label: 'Title',
            render: (vacancy) => vacancy.title,
            width: '35%',
          },
          {
            key: 'salary',
            label: 'Salary',
            render: (vacancy) => vacancy.salary ?? '—',
            width: '20%',
          },
          {
            key: 'status',
            label: 'Status',
            render: (vacancy) => vacancy.status,
            width: '20%',
          },
          {
            key: 'url',
            label: 'Link',
            width: '25%',
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
