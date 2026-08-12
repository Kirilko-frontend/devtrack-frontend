import type { DashboardStats } from '@/types/dashboard';
import {
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  FileText,
  type LucideIcon,
} from 'lucide-react';

const dashboardStats: {
  key: keyof DashboardStats;
  label: string;
  icon: LucideIcon;
}[] = [
  {
    key: 'totalVacancies',
    label: 'Vacancies',
    icon: BriefcaseBusiness,
  },
  {
    key: 'totalCompanies',
    label: 'Companies',
    icon: Building2,
  },
  {
    key: 'totalInterviews',
    label: 'Interviews',
    icon: CalendarDays,
  },
  {
    key: 'totalResumes',
    label: 'Resumes',
    icon: FileText,
  },
];

export { dashboardStats };
