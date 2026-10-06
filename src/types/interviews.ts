export type InterviewType = 'PHONE' | 'HR' | 'TECHNICAL' | 'FINAL';

export interface Interview {
  id: number;
  date: string;
  notes?: string;
  types: InterviewType;
  vacancyId: number;

  vacancy: {
    id: number;
    title: string;

    company: {
      id: number;
      name: string;
    };
  };
}

export interface CreateInterviewData {
  date: string;
  notes?: string;
  types: InterviewType;
  vacancyId: number;
}
