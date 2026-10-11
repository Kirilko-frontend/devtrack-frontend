import { api } from '../api';

import type { CreateInterviewData, Interview } from '@/types/interviews';

export const interviewsService = {
  getInterviews() {
    return api<Interview[]>('/interviews');
  },

  createInterview(data: CreateInterviewData) {
    return api<Interview>('/interviews', {
      method: 'POST',
      body: data,
    });
  },

  deleteInterview(id: number) {
    return api<Interview>(`/interviews/${id}`, {
      method: 'DELETE',
    });
  },
};
