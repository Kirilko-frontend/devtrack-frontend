import {
  vacancySortOptions,
  vacancyStatusOptions,
  type VacancySort,
  type VacancyStatusFilter,
} from '@/shared/constants/vacancies';

import { Input, Select } from '@/shared/ui';

import styles from './styles.module.scss';

interface IProps {
  search: string;
  onSearchChange: (value: string) => void;
  status: VacancyStatusFilter;
  onStatusChange: (value: VacancyStatusFilter) => void;
  sort: VacancySort;
  onSortChange: (value: VacancySort) => void;
}

function VacancyFilters({
  search,
  onSearchChange,
  status,
  onStatusChange,
  sort,
  onSortChange,
}: IProps) {
  return (
    <div className={styles['vacancy-fiters']}>
      <Input
        type="search"
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
        placeholder="Search vacancies"
        className={styles['vacancy-fiters__search']}
      />
      <div className={styles['vacancy-fiters__actions']}>
        <Select
          value={status}
          options={vacancyStatusOptions}
          onChange={onStatusChange}
          placeholder="Status"
        />
        <Select
          value={sort}
          options={vacancySortOptions}
          onChange={onSortChange}
          placeholder="Sort by"
        />
      </div>
    </div>
  );
}

export default VacancyFilters;
