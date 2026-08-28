export type VacancyStatus =
  | 'SAVED'
  | 'APPLIED'
  | 'INTERVIEWING'
  | 'OFFERED'
  | 'REJECTED';

export interface Vacancy {
  id: number;

  title: string;
  description: string | null;
  url: string | null;
  salary: string | null;

  status: VacancyStatus;

  appliedAt: string | null;

  userId: number;
  companyId: number;

  createdAt: string;
  updatedAt: string;

  company: {
    id: number;
    name: string;
    website: string | null;
  };
}

export interface VacanciesResponse {
  data: Vacancy[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface VacancyFormValues {
  title: string;
  description: string;
  url: string;
  salary: string;
  companyId: number | null;
}
