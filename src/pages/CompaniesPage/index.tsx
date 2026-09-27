import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';

import type { Company, UpdateCompanyData } from '@/types/company';
import { companiesService } from '@/services';

import { Button, Input, Modal } from '@/shared/ui';
import { CompaniesList, CompanyEdit } from './components';

import styles from './styles.module.scss';

function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [searchValue, setSearchValue] = useState('');
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);

  const navigate = useNavigate();

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

  return (
    <div className={styles['companies-page']}>
      <div className={styles['companies-page__header']}>
        <h1 className={styles['companies-page__title']}>Your Companies</h1>
        <Button
          className={styles['companies-page__create-button']}
          onClick={() => navigate('/companies-create')}
        >
          <Plus size={18} />
          Create Company
        </Button>
      </div>
      <Input
        className={styles['companies-page__search-input']}
        placeholder="Search companies..."
        type="search"
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
      />
      <CompaniesList companies={filteredCompanies} onSelectCompany={handleSelectCompany} />
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
