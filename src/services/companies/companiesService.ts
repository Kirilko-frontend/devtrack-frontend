import { api } from '../api';

import type { Company } from '@/types/company';

export const companiesService = {
  getCompanies() {
    return api<Company[]>('/companies');
  },
};