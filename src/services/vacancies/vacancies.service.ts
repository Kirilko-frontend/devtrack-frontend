import { api } from '../api';

import type { CreateVacancyData, UpdateVacancyData, VacanciesResponse, Vacancy } from '@/types/vacancy';
import type {
  VacancySort,
  VacancyStatusFilter,
} from '@/shared/constants/vacancies';

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

    return api<VacanciesResponse>(
      `/vacancies${query ? `?${query}` : ''}`,
    );
  },

  createVacancy(data: CreateVacancyData) {
    return api<Vacancy>('/vacancies', {
      method: 'POST',
      body: data,
    });
  },

  getVacancy(id: number) {
    return api<Vacancy>(`/vacancies/${id}`, {
      method: 'GET',
    })
  },

  updateVacancy(id:number, data:UpdateVacancyData){
    return api<Vacancy>(`/vacancies/${id}`, {
      method: 'PATCH',
      body: data
    })
  },

deleteVacancy(id: number) {
  return api<Vacancy>(`/vacancies/${id}`, {
    method: 'DELETE',
  });
},
};