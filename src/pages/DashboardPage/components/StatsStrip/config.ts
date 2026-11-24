import {
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  FileText,
  type LucideIcon,
} from 'lucide-react';

import type {
  DashboardStats,
  DashboardStatsChanges,
  DashboardVacancyStatuses,
} from '@/types/dashboard';

// Segments of the stats strip, left to right.
const dashboardStats: {
  key: keyof DashboardStats;
  changeKey: keyof DashboardStatsChanges;
  label: string;
  icon: LucideIcon;
}[] = [
  { key: 'totalVacancies', changeKey: 'vacancies', label: 'Vacancies', icon: BriefcaseBusiness },
  { key: 'totalCompanies', changeKey: 'companies', label: 'Companies', icon: Building2 },
  { key: 'totalInterviews', changeKey: 'interviews', label: 'Interviews', icon: CalendarDays },
  { key: 'totalResumes', changeKey: 'resumes', label: 'Resumes', icon: FileText },
];

// Order and labels of the parts in the vacancies status bar (colors match StatusBadge).
const vacancyStatusParts: { key: keyof DashboardVacancyStatuses; label: string }[] = [
  { key: 'saved', label: 'Saved' },
  { key: 'applied', label: 'Applied' },
  { key: 'interviewing', label: 'Interviewing' },
  { key: 'offered', label: 'Offered' },
  { key: 'rejected', label: 'Rejected' },
];

// Segments appear one after another.
const SEGMENT_STAGGER_MS = 70;

export { dashboardStats, vacancyStatusParts, SEGMENT_STAGGER_MS };
