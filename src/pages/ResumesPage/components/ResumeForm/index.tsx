import { useState } from 'react';

import type { CreateResumeData, Resume, UpdateResumeData } from '@/types/resume';
import type { Vacancy } from '@/types/vacancy';

import { Button, Input, Select } from '@/shared/ui';

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

  const handleSubmit = () => {
    const trimmedName = name.trim();

    if (!trimmedName || (mode === 'upload' && !file)) {
      return;
    }

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
    <div className={styles['resume-form']}>
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

      <div className={styles['resume-form__actions']}>
        <Button
          className={styles['resume-form__cancel']}
          type="button"
          onClick={onCancel}
          disabled={isSaving}
        >
          Cancel
        </Button>
        <Button
          className={styles['resume-form__submit']}
          type="button"
          onClick={handleSubmit}
          disabled={isSaving || !name.trim() || (mode === 'upload' && !file)}
        >
          {isSaving ? 'Saving...' : mode === 'upload' ? 'Upload resume' : 'Save changes'}
        </Button>
      </div>
    </div>
  );
}

export default ResumeForm;
