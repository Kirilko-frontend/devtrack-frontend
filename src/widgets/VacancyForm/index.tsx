import { useState } from 'react';

import type { Company } from '@/types/company';
import type { VacancyEditFormValues, VacancyFormValues } from '@/types/vacancy';

import { Button, Input, Select } from '@/shared/ui';
import { vacancyStatusOptions } from '@/shared/constants/vacancies';
import { vacancySchema } from '@/shared/validation/vacancy';

import styles from './styles.module.scss';

type VacancyFormField = keyof VacancyFormValues | keyof VacancyEditFormValues;

type CreateProps = {
  companies: Company[];
  initialValues?: VacancyFormValues;
  mode: 'create';
  onSubmit: (values: VacancyFormValues) => void;
  onCancel: () => void;
};

type EditProps = {
  companies: Company[];
  initialValues: VacancyEditFormValues;
  mode: 'edit';
  onSubmit: (values: VacancyEditFormValues) => void;
  onCancel: () => void;
};

type IProps = CreateProps | EditProps;

const defaultValues: VacancyFormValues = {
  title: '',
  description: '',
  url: '',
  salary: '',
  companyId: null,
  appliedAt: new Date().toISOString().split('T')[0],
};

function VacancyForm(props: IProps) {
  const { companies, mode, onCancel } = props;

  const isEditMode = mode === 'edit';

  const [values, setValues] = useState<VacancyFormValues | VacancyEditFormValues>(
    props.initialValues ?? defaultValues
  );

  const [errors, setErrors] = useState<Partial<Record<VacancyFormField, string>>>({});

  const companyOptions = companies.map((company) => ({
    value: String(company.id),
    label: company.name,
  }));

  const statusOptions = vacancyStatusOptions.filter((option) => option.value !== 'ALL');

  const handleChange = <K extends keyof VacancyFormValues>(
    field: K,
    value: VacancyFormValues[K]
  ) => {
    setValues((current) => ({
      ...current,
      [field]: value,
    }));

    setErrors((current) => ({
      ...current,
      [field]: undefined,
    }));
  };

  const handleStatusChange = (value: VacancyEditFormValues['status']) => {
    setValues((current) => ({
      ...current,
      status: value,
    }));

    setErrors((current) => ({
      ...current,
      status: undefined,
    }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const result = vacancySchema.safeParse(values);

    if (!result.success) {
      const formErrors: Partial<Record<VacancyFormField, string>> = {};

      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as VacancyFormField;

        formErrors[field] = issue.message;
      });

      setErrors(formErrors);

      return;
    }

    setErrors({});

    if (isEditMode) {
      props.onSubmit(result.data as VacancyEditFormValues);
      return;
    }

    props.onSubmit(result.data as VacancyFormValues);
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

        {errors.title && <span className={styles['vacancy-form__error']}>{errors.title}</span>}
      </div>

      <div className={styles['vacancy-form__row']}>
        <div className={styles['vacancy-form__field']}>
          <label htmlFor="company">Company</label>

          <Select
            value={values.companyId ? String(values.companyId) : ''}
            options={companyOptions}
            onChange={(value) => handleChange('companyId', Number(value))}
            placeholder="Select company"
          />

          {errors.companyId && (
            <span className={styles['vacancy-form__error']}>{errors.companyId}</span>
          )}
        </div>

        {isEditMode && (
          <div className={styles['vacancy-form__field']}>
            <label htmlFor="status">Status</label>

            <Select
              value={(values as VacancyEditFormValues).status}
              options={statusOptions}
              onChange={handleStatusChange}
              placeholder="Select status"
            />

            {errors.status && (
              <span className={styles['vacancy-form__error']}>{errors.status}</span>
            )}
          </div>
        )}
      </div>

      <div className={styles['vacancy-form__field']}>
        <label htmlFor="salary">Salary</label>

        <Input
          id="salary"
          value={values.salary}
          onChange={(event) => handleChange('salary', event.target.value)}
          placeholder="2000-3000 USD"
        />

        {errors.salary && <span className={styles['vacancy-form__error']}>{errors.salary}</span>}
      </div>

      <div className={styles['vacancy-form__field']}>
        <label htmlFor="url">Vacancy URL</label>

        <Input
          id="url"
          value={values.url}
          onChange={(event) => handleChange('url', event.target.value)}
          placeholder="https://linkedin.com/jobs/123"
        />

        {errors.url && <span className={styles['vacancy-form__error']}>{errors.url}</span>}
      </div>

      <div className={styles['vacancy-form__field']}>
        <label htmlFor="appliedAt">Application date</label>

        <Input
          id="appliedAt"
          type="date"
          value={values.appliedAt ?? ''}
          onChange={(event) => handleChange('appliedAt', event.target.value)}
        />

        {errors.appliedAt && (
          <span className={styles['vacancy-form__error']}>{errors.appliedAt}</span>
        )}
      </div>

      <div className={styles['vacancy-form__field']}>
        <label htmlFor="description">Description</label>

        <textarea
          id="description"
          value={values.description}
          onChange={(event) => handleChange('description', event.target.value)}
          placeholder="React + TypeScript position"
        />

        {errors.description && (
          <span className={styles['vacancy-form__error']}>{errors.description}</span>
        )}
      </div>

      <div className={styles['vacancy-form__actions']}>
        <Button className={styles['vacancy-from__actions-button']} type="button" onClick={onCancel}>
          Cancel
        </Button>

        <Button className={styles['vacancy-from__actions-button']} type="submit">
          {isEditMode ? 'Save changes' : 'Create Vacancy'}
        </Button>
      </div>
    </form>
  );
}

export default VacancyForm;
