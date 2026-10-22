import { useState } from 'react';

import type { Company } from '@/types/company';
import type { VacancyFormValues } from '@/types/vacancy';

import { ActionButtons, Input, Select } from '@/shared/ui';
import { vacancyStatusOptions } from '@/shared/constants/vacancies';
import { vacancySchema } from '@/shared/validation/vacancy';

import styles from './styles.module.scss';

interface IProps {
  companies: Company[];
  initialValues?: VacancyFormValues;
  onSubmit: (values: VacancyFormValues) => void | Promise<void>;
  onCancel: () => void;
  onCreateItem?: (name: string) => Promise<Company>;
}

type VacancyFormField = keyof VacancyFormValues;

const defaultValues: VacancyFormValues = {
  title: '',
  description: '',
  url: '',
  salary: '',
  companyId: null,
  status: 'APPLIED',
  appliedAt: new Date().toISOString().split('T')[0],
};

function VacancyForm({ companies, initialValues, onSubmit, onCancel, onCreateItem }: IProps) {
  const [values, setValues] = useState<VacancyFormValues>(initialValues ?? defaultValues);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<VacancyFormField, string>>>({});

  const companyOptions = companies.map((company) => ({
    value: String(company.id),
    label: company.name,
  }));

  const statusOptions = vacancyStatusOptions.filter((option) => option.value !== 'ALL');
  const isEditing = initialValues !== undefined;
  const hasRequiredFields = values.title.trim().length >= 2 && (values.companyId ?? 0) > 0;
  const hasChanges =
    !isEditing ||
    values.title.trim() !== initialValues.title.trim() ||
    values.description.trim() !== initialValues.description.trim() ||
    values.url.trim() !== initialValues.url.trim() ||
    values.salary.trim() !== initialValues.salary.trim() ||
    values.companyId !== initialValues.companyId ||
    values.status !== initialValues.status ||
    values.appliedAt !== initialValues.appliedAt;

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

  const isSubmitDisabled = !hasRequiredFields || !hasChanges;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

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
    setIsSubmitting(true);
    try {
      await onSubmit(result.data);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateCompany = async (name: string) => {
    if (!onCreateItem) {
      return;
    }

    const company = await onCreateItem(name);

    handleChange('companyId', company.id);
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
            value={values.companyId !== null ? String(values.companyId) : ''}
            options={companyOptions}
            onChange={(value) => {
              handleChange('companyId', Number(value));
            }}
            placeholder="Select company"
            action={{
              label: 'Add company',
              onClick: handleCreateCompany,
            }}
          />

          {errors.companyId && (
            <span className={styles['vacancy-form__error']}>{errors.companyId}</span>
          )}
        </div>

        <div className={styles['vacancy-form__field']}>
          <label htmlFor="status">Status</label>

          <Select
            value={values.status}
            options={statusOptions}
            onChange={(value) => handleChange('status', value)}
            placeholder="Select status"
          />

          {errors.status && <span className={styles['vacancy-form__error']}>{errors.status}</span>}
        </div>
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

      <ActionButtons
        onCancel={onCancel}
        isSubmitting={isSubmitting}
        isSubmitDisabled={isSubmitDisabled}
        submitText={isEditing ? 'Save Changes' : 'Create Vacancy'}
        submittingText={isEditing ? 'Saving Changes...' : 'Creating Vacancy...'}
      />
    </form>
  );
}

export default VacancyForm;
