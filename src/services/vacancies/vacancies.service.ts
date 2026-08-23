import { api } from '../api';

import type { VacanciesResponse } from '@/types/vacancy';
import type { VacancySort, VacancyStatusFilter } from '@/shared/constants/vacancies';


export interface GetVacanciesParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: VacancyStatusFilter;
  sort?: VacancySort;
}

export const vacanciesService = {
  getVacancies(params: GetVacanciesParams = {}) {
    const searchParams = new URLSearchParams();

    if (params.page) {
      searchParams.set('page', String(params.page));
    }

    if (params.limit) {
      searchParams.set('limit', String(params.limit));
    }

    if (params.search) {
      searchParams.set('search', params.search);
    }

    if (params.status && params.status !== 'ALL') {
      searchParams.set('status', params.status);
    }

    if (params.sort) {
      searchParams.set('sort', params.sort);
    }

    const query = searchParams.toString();

    return api<VacanciesResponse>(`/vacancies${query ? `?${query}` : ''}`);
  },
};