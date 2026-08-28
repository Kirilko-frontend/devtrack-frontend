import { z } from 'zod';

import type { VacancyFormValues } from '@/types/vacancy';

export const vacancySchema = z.object({
  title: z
    .string()
    .trim()
    .min(2, 'Title must be at least 2 characters')
    .max(100, 'Title must be less than 100 characters'),

  description: z
    .string()
    .trim()
    .max(5000, 'Description must be less than 5000 characters'),

  url: z
    .string()
    .trim()
    .refine(
      (value) => !value || /^https?:\/\/.+/.test(value),
      'Enter a valid URL',
    ),

  salary: z
    .string()
    .trim()
    .max(100, 'Salary must be less than 100 characters'),

  appliedAt: z
  .string()
  .refine(
    (value) => !value || !Number.isNaN(Date.parse(value)),
    'Enter a valid date',
  ),

  companyId: z
    .number()
    .int()
    .positive('Company is required'),
});

export type VacancyFormErrors = Partial<
  Record<keyof VacancyFormValues, string>
>;