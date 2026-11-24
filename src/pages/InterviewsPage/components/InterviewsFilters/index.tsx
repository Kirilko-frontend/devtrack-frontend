import { Input, Select } from '@/shared/ui';

import {
  interviewDateFilters,
  interviewTypeFilters,
  type InterviewDateFilter,
  type InterviewTypeFilter,
} from './config';

import styles from './styles.module.scss';

interface IProps {
  search: string;
  onSearchChange: (value: string) => void;

  type: InterviewTypeFilter;
  onTypeChange: (value: InterviewTypeFilter) => void;

  date: InterviewDateFilter;
  onDateChange: (value: InterviewDateFilter) => void;
}

function InterviewsFilters({
  search,
  onSearchChange,
  type,
  onTypeChange,
  date,
  onDateChange,
}: IProps) {
  return (
    <div className={styles['interviews-filters']}>
      <Input
        className={styles['interviews-filters__search']}
        type="search"
        value={search}
        placeholder="Search interviews..."
        onChange={(event) => onSearchChange(event.target.value)}
      />

      <div className={styles['interviews-filters-actions']}>
        <Select
          value={type}
          options={interviewTypeFilters}
          onChange={(value) => onTypeChange(value as InterviewTypeFilter)}
        />
        <Select
          value={date}
          options={interviewDateFilters}
          onChange={(value) => onDateChange(value as InterviewDateFilter)}
        />
      </div>
    </div>
  );
}

export default InterviewsFilters;
