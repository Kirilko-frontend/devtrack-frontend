import type { VacancyStatus } from '@/types/vacancy';
import type {
  VacancySort,
  VacancyStatusFilter,
} from '@/shared/constants/vacancies';

interface VacancyListItem {
  status: VacancyStatus;
  title: string;
  createdAt: string;
}

const filterVacancies = <T extends VacancyListItem>(
  vacancies: T[],
  statusFilter: VacancyStatusFilter,
): T[] => {
  if (statusFilter === 'ALL') {
    return vacancies;
  }

  return vacancies.filter(
    (vacancy) => vacancy.status === statusFilter,
  );
};

const searchVacancies = <T extends VacancyListItem>(
  vacancies: T[],
  search: string,
): T[] => {
  const normalizedSearch = search.trim().toLowerCase();

  if (!normalizedSearch) {
    return vacancies;
  }

  return vacancies.filter((vacancy) =>
    vacancy.title.toLowerCase().includes(normalizedSearch),
  );
};

const sortVacancies = <T extends VacancyListItem>(
  vacancies: T[],
  sort: VacancySort,
): T[] => {
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