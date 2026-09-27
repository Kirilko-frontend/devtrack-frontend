import { FormEvent, useState } from 'react';

import type { Company, UpdateCompanyData } from '@/types/company';
import { Button, Input } from '@/shared/ui';

import styles from './styles.module.scss';

interface IProps {
  company: Company;
  onSubmit: (data: UpdateCompanyData) => Promise<void>;
  onCancel: () => void;
}

function CompanyEdit({ company, onSubmit, onCancel }: IProps) {
  const [name, setName] = useState(company.name);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!name.trim() || isSubmitting) {
      return;
    }

    try {
      setIsSubmitting(true);

      await onSubmit({
        name: name.trim(),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className={styles['company-edit']} onSubmit={handleSubmit}>
      <Input
        className={styles['company-edit__input']}
        value={name}
        onChange={(event) => setName(event.target.value)}
        placeholder="Enter new company name"
        disabled={isSubmitting}
      />

      <div className={styles['company-edit__actions']}>
        <Button type="button" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>

        <Button
          type="submit"
          disabled={!name.trim() || isSubmitting || name.trim() === company.name}
        >
          {isSubmitting ? 'Saving...' : 'Save'}
        </Button>
      </div>
    </form>
  );
}

export default CompanyEdit;
