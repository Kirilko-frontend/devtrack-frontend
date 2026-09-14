import type { Company } from '@/types/company';

import CompanyCard from '../CompanyCard';

import styles from './styles.module.scss';
import Empty from '@/shared/ui/Empty';

interface IProps {
  companies: Company[];
}

function CompaniesList({ companies }: IProps) {
  return (
    <div className={styles['companies-list']}>
      <h1 className={styles['companies-list__title']}>Companies List</h1>

      <div className={styles['companies-list__grid']}>
        {companies.map((company) => (
          <CompanyCard key={company.id} company={company} />
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
