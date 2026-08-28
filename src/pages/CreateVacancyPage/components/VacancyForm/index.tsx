import { useState } from 'react';

import { Button, Input, Select } from '@/shared/ui';

import type { Company } from '@/types/company';
import type { VacancyFormValues } from '@/types/vacancy';

import styles from './styles.module.scss';

interface IProps {
  companies: Company[];
  initialValues?: VacancyFormValues;
  onSubmit: (values: VacancyFormValues) => void;
  onCancel: () => void;
}

const defaultValues: VacancyFormValues = {
  title: '',
  description: '',
  url: '',
  salary: '',
  companyId: null,
};

function VacancyForm({ companies, initialValues = defaultValues, onSubmit, onCancel }: IProps) {
  const [values, setValues] = useState<VacancyFormValues>(initialValues);

  const companyOptions = companies.map((company) => ({
    value: String(company.id),
    label: company.name,
  }));

  const handleChange = <K extends keyof VacancyFormValues>(
    field: K,
    value: VacancyFormValues[K]
  ) => {
    setValues((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    onSubmit(values);
  };

  return (
    <form className={styles['vacancy-form']} onSubmit={handleSubmit}>
      <div className={styles['vacancy-form__field']}>
        <label htmlFor="title">Title</label>

        <Input
          id="title"
          value={values.title}
          onChange={(event) => handleChange('title', event.target.value)}
          placeholder="Frontend Developer"
        />
      </div>

      <div className={styles['vacancy-form__field']}>
        <label htmlFor="company">Company</label>

        <Select
          value={values.companyId ? String(values.companyId) : ''}
          options={companyOptions}
          onChange={(value) => handleChange('companyId', Number(value))}
          placeholder="Select company"
        />
      </div>

      <div className={styles['vacancy-form__field']}>
        <label htmlFor="salary">Salary</label>

        <Input
          id="salary"
          value={values.salary}
          onChange={(event) => handleChange('salary', event.target.value)}
          placeholder="2000-3000 USD"
        />
      </div>

      <div className={styles['vacancy-form__field']}>
        <label htmlFor="url">Vacancy URL</label>

        <Input
          id="url"
          value={values.url}
          onChange={(event) => handleChange('url', event.target.value)}
          placeholder="https://linkedin.com/jobs/123"
        />
      </div>

      <div className={styles['vacancy-form__field']}>
        <label htmlFor="description">Description</label>

        <textarea
          id="description"
          value={values.description}
          onChange={(event) => handleChange('description', event.target.value)}
          placeholder="React + TypeScript position"
        />
      </div>

      <div className={styles['vacancy-form__actions']}>
        <Button className={styles['vacancy-from__actions-button']} type="button" onClick={onCancel}>
          Cancel
        </Button>

        <Button className={styles['vacancy-from__actions-button']} type="submit">
          Create Vacancy
        </Button>
      </div>
    </form>
  );
}

export default VacancyForm;
