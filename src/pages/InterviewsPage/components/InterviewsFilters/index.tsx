import { Input, Select } from '@/shared/ui';

import {
  interviewDateFilters,
  interviewSortOptions,
  interviewTypeFilters,
  type InterviewDateFilter,
  type InterviewSort,
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

  sort: InterviewSort;
  onSortChange: (value: InterviewSort) => void;
}

function InterviewsFilters({
  search,
  onSearchChange,
  type,
  onTypeChange,
  date,
  onDateChange,
  sort,
  onSortChange,
}: IProps) {
  return (
    <div className={styles['interviews-filters']}>
      <Input
        type="search"
        value={search}
        placeholder="Search interviews..."
        onChange={(event) => onSearchChange(event.target.value)}
      />

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

      <Select
        value={sort}
        options={interviewSortOptions}
        onChange={(value) => onSortChange(value as InterviewSort)}
      />
    </div>
  );
}

export default InterviewsFilters;
