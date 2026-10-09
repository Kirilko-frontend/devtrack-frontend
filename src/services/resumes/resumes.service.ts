import { api, apiFile } from '../api';

import type { CreateResumeData, Resume, UpdateResumeData } from '@/types/resume';

export const resumesService = {
  getResumes() {
    return api<Resume[]>('/resumes');
  },

  uploadResume(data: CreateResumeData) {
    const formData = new FormData();

    formData.append('file', data.file);
    formData.append('name', data.name);

    if (data.vacancyId !== undefined) {
      formData.append('vacancyId', String(data.vacancyId));
    }

    return api<Resume>('/resumes/upload', {
      method: 'POST',
      body: formData,
    });
  },

  updateResume(id: number, data: UpdateResumeData) {
    return api<Resume>(`/resumes/${id}`, {
      method: 'PATCH',
      body: data,
    });
  },

  deleteResume(id: number) {
    return api<Resume>(`/resumes/${id}`, {
      method: 'DELETE',
    });
  },

  downloadResume(id: number) {
    return apiFile(`/resumes/${id}/file`);
  },
};
