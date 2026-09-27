import { api } from '../api';

import type { Company, CreateCompanyData, UpdateCompanyData } from '@/types/company';

export const companiesService = {
  getCompanies() {
    return api<Company[]>('/companies');
  },

  createCompany(data: CreateCompanyData) {
    return api<Company>('/companies', {
      method: 'POST',
      body: data,
    });
  },

  updateCompany(id: number, data: Partial<UpdateCompanyData>) {
    return api<Company>(`/companies/${id}`, {
      method: 'PATCH',
      body: data,
    });
  },

  deleteCompany(id: number) {
    return api<void>(`/companies/${id}`, {
      method: 'DELETE',
    });
  },
};
