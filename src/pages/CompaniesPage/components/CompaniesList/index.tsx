import type { Company } from '@/types/company';

import CompanyCard from '../CompanyCard';

import styles from './styles.module.scss';

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
    </div>
  );
}

export default CompaniesList;
