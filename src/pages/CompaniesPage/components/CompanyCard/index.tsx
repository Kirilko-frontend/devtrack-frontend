import type { Company } from '@/types/company';
import { formatDate } from '@/shared/utils';

import styles from './styles.module.scss';
import { Trash } from 'lucide-react';

interface IProps {
  company: Company;
  onClick?: () => void;
  onDelete?: () => void;
}

function CompanyCard({ company, onClick, onDelete }: IProps) {
  return (
    <div className={styles['company-card']} onClick={onClick}>
      <h1 className={styles['company-card__title']}>{company.name}</h1>
      {company.website ? (
        <a
          href={company.website}
          target="_blank"
          rel="noopener noreferrer"
          className={styles['company-card__website']}
        >
          Company social media profiles
        </a>
      ) : (
        <p className={styles['company-card__website']}>No social media profiles available</p>
      )}
      <p
        className={styles['company-card__created-at']}
      >{`You added this company on ${formatDate(company.createdAt)}`}</p>
      <button
        className={styles['company-card__delete-button']}
        onClick={(event) => {
          event.stopPropagation();
          onDelete?.();
        }}
      >
        <Trash className={styles['company-card__delete-icon']} size={20} />
      </button>
    </div>
  );
}

export default CompanyCard;
