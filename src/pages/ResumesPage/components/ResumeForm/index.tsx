import { useState, type FormEvent } from 'react';

import type { CreateResumeData, Resume, UpdateResumeData } from '@/types/resume';
import type { Vacancy } from '@/types/vacancy';

import { ActionButtons, Input, Select } from '@/shared/ui';

import styles from './styles.module.scss';

interface IProps {
  mode: 'upload' | 'edit';
  resume?: Resume;
  vacancies: Vacancy[];
  isSaving: boolean;
  isVacanciesUnavailable: boolean;
  error: string;
  onCancel: () => void;
  onSubmit: (data: CreateResumeData | UpdateResumeData) => void;
}

function ResumeForm({
  mode,
  resume,
  vacancies,
  isSaving,
  isVacanciesUnavailable,
  error,
  onCancel,
  onSubmit,
}: IProps) {
  const [name, setName] = useState(resume?.name ?? '');
  const [vacancyId, setVacancyId] = useState(
    resume?.vacancyId === null || resume?.vacancyId === undefined
      ? ''
      : String(resume.vacancyId),
  );
  const [file, setFile] = useState<File | null>(null);
  const vacancyOptions = [
    { value: '', label: 'No vacancy' },
    ...vacancies.map((vacancy) => ({
      value: String(vacancy.id),
      label: `${vacancy.title} — ${vacancy.company.name}`,
    })),
  ];

  const hasChanges =
    mode === 'upload' ||
    (resume !== undefined &&
      (name.trim() !== resume.name ||
        (vacancyId ? Number(vacancyId) : null) !== resume.vacancyId));
  const isSubmitDisabled =
    isSaving || !name.trim() || (mode === 'upload' && !file) || !hasChanges;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isSubmitDisabled) {
      return;
    }

    const trimmedName = name.trim();

    if (mode === 'upload' && file) {
      onSubmit({
        name: trimmedName,
        file,
        ...(vacancyId ? { vacancyId: Number(vacancyId) } : {}),
      });
      return;
    }

    onSubmit({
      name: trimmedName,
      vacancyId: vacancyId ? Number(vacancyId) : null,
    });
  };

  return (
    <form className={styles['resume-form']} onSubmit={handleSubmit}>
      <div className={styles['resume-form__field']}>
        <span className={styles['resume-form__label']}>Resume name</span>
        <Input
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="e.g. Frontend Developer"
          maxLength={120}
        />
      </div>

      {mode === 'upload' && (
        <div className={styles['resume-form__field']}>
          <span className={styles['resume-form__label']}>Resume file</span>
          <input
            className={styles['resume-form__file']}
            type="file"
            onChange={(event) => setFile(event.target.files?.[0] ?? null)}
          />
        </div>
      )}

      <div className={styles['resume-form__field']}>
        <span className={styles['resume-form__label']}>Related vacancy</span>
        <Select
          className={styles['resume-form__select']}
          value={vacancyId}
          options={vacancyOptions}
          onChange={setVacancyId}
          placement="top"
          disabled={isVacanciesUnavailable}
        />
      </div>

      {error && (
        <p className={styles['resume-form__error']} role="alert">
          {error}
        </p>
      )}

      <ActionButtons
        onCancel={onCancel}
        isSubmitting={isSaving}
        isSubmitDisabled={isSubmitDisabled}
        submitText={mode === 'upload' ? 'Upload resume' : 'Save changes'}
        submittingText={mode === 'upload' ? 'Uploading...' : 'Saving changes...'}
      />
    </form>
  );
}

export default ResumeForm;
