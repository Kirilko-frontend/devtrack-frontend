import type { DashboardRecentVacancy } from '@/types/dashboard';

import type { VacancySort, VacancyStatusFilter } from '../config';

const filterVacancies = (
  vacancies: DashboardRecentVacancy[],
  statusFilter: VacancyStatusFilter
) => {
  if (statusFilter === 'ALL') {
    return vacancies;
  }

  return vacancies.filter((vacancy) => vacancy.status === statusFilter);
};

const searchVacancies = (
  vacancies: DashboardRecentVacancy[],
  search: string
) => {
  const normalizedSearch = search.trim().toLowerCase();

  if (!normalizedSearch) {
    return vacancies;
  }

  return vacancies.filter((vacancy) =>
    vacancy.title.toLowerCase().includes(normalizedSearch)
  );
};

const sortVacancies = (
  vacancies: DashboardRecentVacancy[],
  sort: VacancySort
) => {
  return [...vacancies].sort((a, b) => {
    if (sort === 'NEWEST') {
      return (
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime()
      );
    }

    if (sort === 'OLDEST') {
      return (
        new Date(a.createdAt).getTime() -
        new Date(b.createdAt).getTime()
      );
    }

    return a.title.localeCompare(b.title);
  });
};

export {
  filterVacancies,
  searchVacancies,
  sortVacancies,
};