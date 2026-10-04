import type { Company } from '@/types/company';

import CompanyCard from '../CompanyCard';

import styles from './styles.module.scss';
import { Empty } from '@/shared/ui';

interface IProps {
  companies: Company[];
  onSelectCompany?: (company: Company) => void;
  onDeleteCompany?: (companyId: number) => void;
}

function CompaniesList({ companies, onSelectCompany, onDeleteCompany }: IProps) {
  return (
    <div className={styles['companies-list']}>
      <h1 className={styles['companies-list__title']}>Companies List</h1>

      <div className={styles['companies-list__grid']}>
        {companies.map((company) => (
          <CompanyCard
            key={company.id}
            company={company}
            onClick={() => onSelectCompany && onSelectCompany(company)}
            onDelete={() => onDeleteCompany && onDeleteCompany(company.id)}
          />
        ))}
      </div>

      {companies.length === 0 && (
        <Empty
          title="No companies found"
          description="Try adjusting your search to find what youre looking for."
        />
      )}
    </div>
  );
}

export default CompaniesList;
