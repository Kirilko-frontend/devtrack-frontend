import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';

import type { Company } from '@/types/company';

import { Button, Input } from '@/shared/ui';

import styles from './styles.module.scss';
import { companiesService } from '@/services';
import { CompaniesList } from './components';

function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [searchValue, setSearchValue] = useState('');

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

  return (
    <div className={styles['companies-page']}>
      <div className={styles['companies-page__header']}>
        <h1 className={styles['companies-page__title']}>Your Companies</h1>
        <Button className={styles['companies-page__create-button']}>
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
      <CompaniesList companies={filteredCompanies} />
    </div>
  );
}

export default CompaniesPage;
