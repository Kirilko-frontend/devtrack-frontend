import type { ApiError } from '@/types/api';

export function getErrorMessage(error: unknown): string {
  if (typeof error === 'object' && error !== null && 'data' in error) {
    const apiError = error as ApiError;

    if (Array.isArray(apiError.data?.message)) {
      return apiError.data.message.join(', ');
    }

    if (apiError.data?.message) {
      return apiError.data.message;
    }
  }

  return 'Something went wrong. Please try again.';
}
