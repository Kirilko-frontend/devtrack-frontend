import type { Company } from '@/types/company';
import { formatDate } from '@/shared/utils';

import styles from './styles.module.scss';

interface IProps {
  company: Company;
}

function CompanyCard({ company }: IProps) {
  return (
    <div className={styles['company-card']}>
      <h1 className={styles['company-card__title']}>{company.name}</h1>
      <a
        href={company.website}
        target="_blank"
        rel="noopener noreferrer"
        className={styles['company-card__website']}
      >
        Company Website
      </a>
      <p
        className={styles['company-card__created-at']}
      >{`You added this company on ${formatDate(company.createdAt)}`}</p>
    </div>
  );
}

export default CompanyCard;
