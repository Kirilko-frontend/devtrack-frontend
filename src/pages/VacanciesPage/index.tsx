import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';

import type { Vacancy } from '@/types/vacancy';

import { Button, Input, Pagination, Select } from '@/shared/ui';
import { Table } from '@/widgets';
import { vacanciesService } from '@/services';

import {
  vacancySortOptions,
  vacancyStatusOptions,
  type VacancySort,
  type VacancyStatusFilter,
} from '@/shared/constants/vacancies';

import styles from './styles.module.scss';

function VacanciesPage() {
  const [vacancies, setVacancies] = useState<Vacancy[]>([]);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<VacancyStatusFilter>('ALL');
  const [sort, setSort] = useState<VacancySort>('NEWEST');

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const loadVacancies = async () => {
      try {
        const response = await vacanciesService.getVacancies({
          page,
          limit: 10,
          search,
          status: statusFilter,
          sort,
        });

        setVacancies(response.data);
        setTotalPages(response.meta.totalPages);
      } catch (error) {
        console.error('Vacancies error:', error);
      }
    };

    void loadVacancies();
  }, [page, search, statusFilter, sort]);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleStatusChange = (value: VacancyStatusFilter) => {
    setStatusFilter(value);
    setPage(1);
  };

  const handleSortChange = (value: VacancySort) => {
    setSort(value);
    setPage(1);
  };

  return (
    <div className={styles['vacancies-page']}>
      <div className={styles['vacancies-page__header']}>
        <h1 className={styles['vacancies-page__title']}>Manage and track your job opportunities</h1>

        <Button className={styles['vacancies-page__create-button']}>
          <Plus className={styles['vacancies-page__create-button-icon']} size={18} />
          Add vacancy
        </Button>
      </div>

      <main className={styles['vacancies-page__main']}>
        <Input
          type="search"
          value={search}
          onChange={(event) => handleSearchChange(event.target.value)}
          placeholder="Search vacancies"
          className={styles['vacancies-page__search']}
        />

        <div className={styles['vacancies-page__actions']}>
          <Select
            value={statusFilter}
            options={vacancyStatusOptions}
            onChange={handleStatusChange}
            placeholder="Status"
          />

          <Select
            value={sort}
            options={vacancySortOptions}
            onChange={handleSortChange}
            placeholder="Sort by"
          />
        </div>
      </main>

      <Table
        data={vacancies}
        getRowKey={(vacancy) => vacancy.id}
        columns={[
          {
            key: 'title',
            label: 'Title',
            width: '30%',
          },
          {
            key: 'company',
            label: 'Company',
            render: (vacancy) => vacancy.company.name,
            width: '20%',
          },
          {
            key: 'salary',
            label: 'Salary',
            width: '15%',
          },
          {
            key: 'status',
            label: 'Status',
            width: '15%',
          },
          {
            key: 'url',
            label: 'Link',
            width: '20%',
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

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}

export default VacanciesPage;
