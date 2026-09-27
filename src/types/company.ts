export interface Company {
  id: number;
  name: string;
  website?: string;
}

export interface CreateCompanyData {
  name: string;
}

export interface UpdateCompanyData {
  name: string;
}
