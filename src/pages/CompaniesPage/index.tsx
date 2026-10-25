import { useEffect, useState } from 'react';

import type { Company, CreateCompanyData, UpdateCompanyData } from '@/types/company';
import { companiesService } from '@/services';

import { Input, Modal } from '@/shared/ui';
import { CompaniesHeader, CompaniesList, CompanyCreateForm, CompanyEdit } from './components';

import styles from './styles.module.scss';

function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [searchValue, setSearchValue] = useState('');
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createError, setCreateError] = useState('');

  const filteredCompanies = companies.filter((company) =>
    company.name.toLowerCase().includes(searchValue.toLowerCase())
  );

  useEffect(() => {
    const loadCompanies = async () => {
      try {
        const data = await companiesService.getCompanies();
        setCompanies(data);
      } catch (error) {
        console.error('Error fetching companies:', error);
      }
    };

    loadCompanies();
  }, []);

  if (!companies) {
    return <div>Loading...</div>;
  }

  const handleSelectCompany = (company: Company) => {
    setSelectedCompany(company);
  };

  const handleUpdateCompany = async (data: UpdateCompanyData) => {
    if (!selectedCompany) {
      return;
    }

    try {
      const updatedCompany = await companiesService.updateCompany(selectedCompany.id, data);

      setCompanies((current) =>
        current.map((company) => (company.id === updatedCompany.id ? updatedCompany : company))
      );

      setSelectedCompany(null);
    } catch (error) {
      console.error('Error updating company:', error);
    }
  };

  const handleCreateCompany = async (data: CreateCompanyData) => {
    setCreateError('');

    try {
      const createdCompany = await companiesService.createCompany(data);
      setCompanies((current) => [createdCompany, ...current]);
      setSearchValue('');
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error('Error creating company:', error);
      setCreateError('Could not create the company. Please try again.');
    }
  };

  const handleDeleteCompany = async (companyId: number) => {
    try {
      await companiesService.deleteCompany(companyId);
      setCompanies((current) => current.filter((company) => company.id !== companyId));
    } catch (error) {
      console.error('Error deleting company:', error);
    }
  };

  return (
    <div className={styles['companies-page']}>
      <CompaniesHeader
        onCreate={() => {
          setCreateError('');
          setIsCreateModalOpen(true);
        }}
      />
      <Input
        className={styles['companies-page__search-input']}
        placeholder="Search companies..."
        type="search"
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
      />
      <CompaniesList
        companies={filteredCompanies}
        onSelectCompany={handleSelectCompany}
        onDeleteCompany={handleDeleteCompany}
      />
      {isCreateModalOpen && (
        <Modal title="Create Company" onClose={() => setIsCreateModalOpen(false)}>
          <CompanyCreateForm
            error={createError}
            onCancel={() => setIsCreateModalOpen(false)}
            onSubmit={handleCreateCompany}
          />
        </Modal>
      )}
      {selectedCompany && (
        <Modal title="Edit Company" onClose={() => setSelectedCompany(null)}>
          <CompanyEdit
            company={selectedCompany}
            onSubmit={handleUpdateCompany}
            onCancel={() => setSelectedCompany(null)}
          />
        </Modal>
      )}
    </div>
  );
}

export default CompaniesPage;
