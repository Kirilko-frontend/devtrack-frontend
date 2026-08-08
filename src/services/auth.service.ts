import { api } from './api';
import type { AuthUser } from '@/types/auth';

export const authService = {
  me() {
    return api<AuthUser>('/auth/me');
  },

  logout() {
    return api<{ message: string }>('/auth/logout', {
      method: 'POST',
    });
  },
};
