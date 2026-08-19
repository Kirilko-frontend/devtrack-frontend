const vacancyStatusOptions = [
  { value: 'ALL', label: 'All' },
  { value: 'SAVED', label: 'Saved' },
  { value: 'APPLIED', label: 'Applied' },
  { value: 'INTERVIEWING', label: 'Interviewing' },
  { value: 'OFFERED', label: 'Offered' },
  { value: 'REJECTED', label: 'Rejected' },
] as const;

const vacancySortOptions = [
  { value: 'NEWEST', label: 'Newest' },
  { value: 'OLDEST', label: 'Oldest' },
  { value: 'TITLE', label: 'Title' },
] as const;

type VacancyStatusFilter = (typeof vacancyStatusOptions)[number]['value'];
type VacancySort = (typeof vacancySortOptions)[number]['value'];

export {
  vacancyStatusOptions,
  vacancySortOptions,
  type VacancyStatusFilter,
  type VacancySort,
};