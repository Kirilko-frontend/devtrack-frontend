import { api } from '../api';

import type { Interview } from '@/types/interviews';

export const interviewsService = {
  getInterviews() {
    return api<Interview[]>('/interviews');
  },
};
