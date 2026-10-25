import type { DashboardStats, DashboardStatsChanges } from '@/types/dashboard';

import {
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  FileText,
  type LucideIcon,
} from 'lucide-react';

const dashboardStats: {
  key: keyof DashboardStats;
  changeKey: keyof DashboardStatsChanges;
  label: string;
  ariaLabel: string;
  icon: LucideIcon;
}[] = [
  {
    key: 'totalVacancies',
    changeKey: 'vacancies',
    label: 'Vacancies',
    ariaLabel: 'Total number of vacancies you are tracking.',
    icon: BriefcaseBusiness,
  },
  {
    key: 'totalCompanies',
    changeKey: 'companies',
    label: 'Companies',
    ariaLabel: 'Total number of companies in your job search.',
    icon: Building2,
  },
  {
    key: 'totalInterviews',
    changeKey: 'interviews',
    label: 'Interviews',
    ariaLabel: 'Total number of interviews scheduled.',
    icon: CalendarDays,
  },
  {
    key: 'totalResumes',
    changeKey: 'resumes',
    label: 'Resumes',
    ariaLabel: 'Total number of resumes saved in your library.',
    icon: FileText,
  },
];

export { dashboardStats };
