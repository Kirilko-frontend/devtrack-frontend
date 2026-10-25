import { api } from '../api';

import type { CreateInterviewData, Interview, UpdateInterviewData } from '@/types/interviews';

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

  updateInterview(id: number, data: UpdateInterviewData) {
    return api<Interview>(`/interviews/${id}`, {
      method: 'PATCH',
      body: data,
    });
  },

  deleteInterview(id: number) {
    return api<Interview>(`/interviews/${id}`, {
      method: 'DELETE',
    });
  },
};
