import { api } from '../api';

import type {  Company, CreateCompanyData } from '@/types/company';

export const companiesService = {
  getCompanies() {
    return api<Company[]>('/companies');
  },

createCompany(data: CreateCompanyData) {
  console.log('SERVICE CREATE COMPANY:', data);

  return api<Company>('/companies', {
    method: 'POST',
    body: data,
  });
},
};