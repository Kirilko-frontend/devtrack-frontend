import type { Company } from '@/types/company';
import { formatDate } from '@/shared/utils';
import { Pencil, Trash2 } from 'lucide-react';

import styles from './styles.module.scss';

interface IProps {
  company: Company;
  onClick?: () => void;
  onDelete?: () => void;
}

function CompanyCard({ company, onClick, onDelete }: IProps) {
  return (
    <div className={styles['company-card']}>
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
      <div className={styles['company-card__actions']}>
        <button
          className={styles['company-card__action']}
          type="button"
          aria-label={`Edit ${company.name}`}
          title="Edit company"
          onClick={(event) => {
            event.stopPropagation();
            onClick?.();
          }}
        >
          <Pencil size={16} />
        </button>
        <button
          className={`${styles['company-card__action']} ${styles['company-card__action--delete']}`}
          type="button"
          aria-label={`Delete ${company.name}`}
          title="Delete company"
          onClick={(event) => {
            event.stopPropagation();
            onDelete?.();
          }}
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}

export default CompanyCard;
