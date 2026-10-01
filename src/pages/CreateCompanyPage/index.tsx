import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button, Input } from '@/shared/ui';
import { companiesService } from '@/services';

import styles from './styles.module.scss';

function CreateCompanyPage() {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [website, setWebsite] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!name.trim() || isSubmitting) {
      return;
    }

    try {
      setIsSubmitting(true);

      await companiesService.createCompany({
        name: name.trim(),
        website: website.trim() || undefined,
      });

      navigate('/companies');
    } catch (error) {
      console.error('Error creating company:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles['create-company-page']}>
      <div className={styles['create-company-page__card']}>
        <div className={styles['create-company-page__header']}>
          <h1 className={styles['create-company-page__title']}>Create Company</h1>

          <p className={styles['create-company-page__description']}>
            Add a company to start tracking its vacancies.
          </p>
        </div>

        <form className={styles['create-company-page__form']} onSubmit={handleSubmit}>
          <label htmlFor="name">Company Name</label>
          <Input
            id="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Enter company name"
            disabled={isSubmitting}
          />

          <label htmlFor="website">Company Website</label>
          <Input
            value={website}
            onChange={(event) => setWebsite(event.target.value)}
            placeholder="https://example.com"
            disabled={isSubmitting}
          />

          <div className={styles['create-company-page__actions']}>
            <Button type="button" onClick={() => navigate('/companies')} disabled={isSubmitting}>
              Cancel
            </Button>

            <Button type="submit" disabled={!name.trim() || isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create Company'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateCompanyPage;
