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
  icon: LucideIcon;
}[] = [
  {
    key: 'totalVacancies',
    changeKey: 'vacancies',
    label: 'Vacancies',
    icon: BriefcaseBusiness,
  },
  {
    key: 'totalCompanies',
    changeKey: 'companies',
    label: 'Companies',
    icon: Building2,
  },
  {
    key: 'totalInterviews',
    changeKey: 'interviews',
    label: 'Interviews',
    icon: CalendarDays,
  },
  {
    key: 'totalResumes',
    changeKey: 'resumes',
    label: 'Resumes',
    icon: FileText,
  },
];

export { dashboardStats };
