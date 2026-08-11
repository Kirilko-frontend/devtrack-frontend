import type { InterviewType } from './interview';

export interface DashboardStats {
  totalVacancies: number;
  totalCompanies: number;
  totalInterviews: number;
  totalResumes: number;
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

export interface DashboardResponse {
  stats: DashboardStats;
  vacancyStatuses: DashboardVacancyStatuses;
  upcomingInterviews: DashboardInterview[];
}
