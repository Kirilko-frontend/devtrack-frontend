export interface Resume {
  id: number;
  name: string;
  filePath: string;
  vacancyId: number | null;
  userId: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateResumeData {
  name: string;
  file: File;
  vacancyId?: number;
}

export interface UpdateResumeData {
  name?: string;
  vacancyId?: number | null;
}