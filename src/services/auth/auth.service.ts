import { api } from '../api';

import type { AuthUser, LoginRequest, RegisterRequest, ResetPasswordRequest } from '@/types/auth';

export const authService = {
  me() {
    return api<AuthUser>('/auth/me');
  },

  login(data: LoginRequest) {
    return api<{ message: string }>('/auth/login', {
      method: 'POST',
      body: data,
    });
  },

  register(data: RegisterRequest) {
    return api<{ message: string }>('/auth/register', {
      method: 'POST',
      body: data,
    });
  },

  forgotPassword(email: string) {
    return api<{ message: string }>('/auth/forgot-password', {
      method: 'POST',
      body: { email },
    });
  },

  resetPassword(data: ResetPasswordRequest) {
    return api<{ message: string }>('/auth/reset-password', {
      method: 'POST',
      body: data,
    });
  },

  logout() {
    return api<{ message: string }>('/auth/logout', {
      method: 'POST',
    });
  },
};
