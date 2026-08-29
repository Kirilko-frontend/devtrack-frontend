import type { Vacancy } from '@/types/vacancy';

import { Table } from '@/widgets';

import styles from './styles.module.scss';

interface IProps {
  vacancies: Vacancy[];
  onSelectVacancy: (vacancy: Vacancy) => void;
}

function VacancyTable({ vacancies, onSelectVacancy }: IProps) {
  return (
    <div className={styles['vacancy-table']}>
      <Table
        data={vacancies}
        getRowKey={(vacancy) => vacancy.id}
        onRowClick={onSelectVacancy}
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
          {
            key: 'appliedAt',
            label: 'Applied at',
            width: '15%',
            render: (vacancy) =>
              vacancy.appliedAt ? new Date(vacancy.appliedAt).toLocaleDateString() : '—',
          },
        ]}
      />
    </div>
  );
}

export default VacancyTable;
