type InterviewTypeFilter = 'ALL' | 'PHONE' | 'HR' | 'TECHNICAL' | 'FINAL';
type InterviewDateFilter = 'ALL' | 'UPCOMING' | 'PAST';
type InterviewSort = 'SOONEST' | 'LATEST';

const interviewTypeFilters: {
  value: InterviewTypeFilter;
  label: string;
}[] = [
  {
    value: 'ALL',
    label: 'All types',
  },
  {
    value: 'PHONE',
    label: 'Phone',
  },
  {
    value: 'HR',
    label: 'HR',
  },
  {
    value: 'TECHNICAL',
    label: 'Technical',
  },
  {
    value: 'FINAL',
    label: 'Final',
  },
];

const interviewDateFilters: {
  value: InterviewDateFilter;
  label: string;
}[] = [
  {
    value: 'ALL',
    label: 'All dates',
  },
  {
    value: 'UPCOMING',
    label: 'Upcoming',
  },
  {
    value: 'PAST',
    label: 'Past',
  },
];

const interviewSortOptions: {
  value: InterviewSort;
  label: string;
}[] = [
  {
    value: 'SOONEST',
    label: 'Soonest',
  },
  {
    value: 'LATEST',
    label: 'Latest',
  },
];

export { interviewTypeFilters, interviewDateFilters, interviewSortOptions };

export type { InterviewTypeFilter, InterviewDateFilter, InterviewSort };
