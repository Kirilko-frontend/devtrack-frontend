import type { InterviewType } from './interview';

type VacancyStatus =
  | 'SAVED'
  | 'APPLIED'
  | 'INTERVIEWING'
  | 'OFFERED'
  | 'REJECTED';

export interface DashboardStats {
  totalVacancies: number;
  totalCompanies: number;
  totalInterviews: number;
  totalResumes: number;
}

export interface DashboardStatsChanges {
  vacancies: number;
  companies: number;
  interviews: number;
  resumes: number;
}

export interface DashboardVacancyStatuses {
  saved: number;
  applied: number;
  interviewing: number;
  offered: number;
  rejected: number;
}

export interface DashboardInterviewCompany {
  id: number;
  name: string;
}

export interface DashboardInterviewVacancy {
  id: number;
  title: string;
  company: DashboardInterviewCompany;
}

export interface DashboardInterview {
  id: number;
  date: string;
  types: InterviewType;
  vacancy: DashboardInterviewVacancy;
}

export interface DashboardApplicationActivity {
  date: string;
  count: number;
}

export interface DashboardRecentVacancy {
  id: number;
  title: string;
  description?: string;
  url?: string;
  salary?: string;
  status: VacancyStatus;
  company: {
    id: number;
    name: string;
  };
  createdAt: string;
}

export interface DashboardResponse {
  stats: DashboardStats;
  statsChanges: DashboardStatsChanges;
  vacancyStatuses: DashboardVacancyStatuses;
  upcomingInterviews: DashboardInterview[];
  applicationActivity: DashboardApplicationActivity[];
  recentVacancies: DashboardRecentVacancy[]
}

