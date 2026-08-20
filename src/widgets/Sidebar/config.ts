import {
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  FileText,
  LayoutDashboard,
  type LucideIcon,
} from 'lucide-react';

interface NavigationItem {
  label: string;
  path: string;
  icon: LucideIcon;
}

const navigation: NavigationItem[] = [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { label: 'Companies', path: '/companies', icon: Building2 },
  { label: 'Vacancies', path: '/vacancies', icon: BriefcaseBusiness },
  { label: 'Interviews', path: '/interviews', icon: CalendarDays },
  { label: 'Resumes', path: '/resumes', icon: FileText },
];

export { navigation, type NavigationItem };
