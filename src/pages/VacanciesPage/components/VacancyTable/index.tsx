import type { Vacancy } from '@/types/vacancy';
import { Pencil } from 'lucide-react';

import { Table } from '@/widgets';

import styles from './styles.module.scss';

interface IProps {
  vacancies: Vacancy[];
  onEditVacancy: (vacancy: Vacancy) => void;
}

function VacancyTable({ vacancies, onEditVacancy }: IProps) {
  return (
    <div className={styles['vacancy-table']}>
      <Table
        data={vacancies}
        getRowKey={(vacancy) => vacancy.id}
        columns={[
          {
            key: 'title',
            label: 'Title',
            width: '25%',
          },
          {
            key: 'company',
            label: 'Company',
            render: (vacancy) => vacancy.company.name,
            width: '17%',
          },
          {
            key: 'salary',
            label: 'Salary',
            width: '12%',
          },
          {
            key: 'status',
            label: 'Status',
            width: '13%',
          },
          {
            key: 'url',
            label: 'Link',
            width: '15%',
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
            width: '12%',
            render: (vacancy) =>
              vacancy.appliedAt ? new Date(vacancy.appliedAt).toLocaleDateString() : '—',
          },
          {
            key: 'id',
            label: '',
            width: '6%',
            render: (vacancy) => (
              <button
                className={styles['vacancy-table__edit-button']}
                type="button"
                aria-label={`Edit ${vacancy.title}`}
                title="Edit vacancy"
                onClick={() => onEditVacancy(vacancy)}
              >
                <Pencil size={16} />
              </button>
            ),
          },
        ]}
      />
    </div>
  );
}

export default VacancyTable;
