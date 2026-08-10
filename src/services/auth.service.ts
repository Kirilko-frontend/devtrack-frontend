import { api } from './api';

import type { AuthUser, LoginRequest, RegisterRequest } from '@/types/auth';

export const authService = {
  me() {
    return api<AuthUser>('/auth/me');
  },

  login(data: LoginRequest) {
    return api<{ message: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  register(data: RegisterRequest) {
    return api<{ message: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  logout() {
    return api<{ message: string }>('/auth/logout', {
      method: 'POST',
    });
  },
};
