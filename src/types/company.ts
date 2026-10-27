export interface Company {
  id: number;
  name: string;
  website?: string;
  createdAt: string;
}

export interface CreateCompanyData {
  name: string;
  website?: string;
}

export interface UpdateCompanyData {
  name: string;
  website?: string | null;
}
