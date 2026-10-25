import { useState, type FormEvent } from 'react';

import type { CreateCompanyData } from '@/types/company';

import { ActionButtons, Input } from '@/shared/ui';

import styles from './styles.module.scss';

interface IProps {
  error: string;
  onCancel: () => void;
  onSubmit: (data: CreateCompanyData) => Promise<void>;
}

function CompanyCreateForm({ error, onCancel, onSubmit }: IProps) {
  const [name, setName] = useState('');
  const [website, setWebsite] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isSubmitDisabled = !name.trim();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isSubmitDisabled || isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    try {
      await onSubmit({
        name: name.trim(),
        website: website.trim() || undefined,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className={styles['company-create-form']} onSubmit={handleSubmit}>
      <div className={styles['company-create-form__field']}>
        <label htmlFor="company-name">Company Name</label>
        <Input
          id="company-name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Enter company name"
          disabled={isSubmitting}
        />
      </div>

      <div className={styles['company-create-form__field']}>
        <label htmlFor="company-website">Company Website</label>
        <Input
          id="company-website"
          type="url"
          value={website}
          onChange={(event) => setWebsite(event.target.value)}
          placeholder="https://example.com"
          disabled={isSubmitting}
        />
      </div>

      {error && (
        <p className={styles['company-create-form__error']} role="alert">
          {error}
        </p>
      )}

      <ActionButtons
        onCancel={onCancel}
        isSubmitting={isSubmitting}
        isSubmitDisabled={isSubmitDisabled}
        submitText="Create Company"
        submittingText="Creating Company..."
      />
    </form>
  );
}

export default CompanyCreateForm;
