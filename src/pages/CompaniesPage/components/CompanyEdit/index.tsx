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
  const [website, setWebsite] = useState(company.website ?? '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const normalizedName = name.trim();
  const normalizedWebsite = website.trim();

  const hasChanges =
    normalizedName !== company.name || normalizedWebsite !== (company.website ?? '');

  const isSubmitDisabled = !normalizedName || !hasChanges || isSubmitting;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isSubmitDisabled) {
      return;
    }

    try {
      setIsSubmitting(true);

      await onSubmit({
        name: normalizedName,
        website: normalizedWebsite || null,
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

      <Input
        className={styles['company-edit__input']}
        value={website}
        onChange={(event) => setWebsite(event.target.value)}
        placeholder="Enter company website"
        disabled={isSubmitting}
      />

      <div className={styles['company-edit__actions']}>
        <Button type="button" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>

        <Button type="submit" disabled={isSubmitDisabled}>
          {isSubmitting ? 'Saving...' : 'Save'}
        </Button>
      </div>
    </form>
  );
}

export default CompanyEdit;
