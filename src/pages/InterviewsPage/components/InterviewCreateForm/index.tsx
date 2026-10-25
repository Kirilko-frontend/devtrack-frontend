import { useState, type FormEvent } from 'react';

import type { CreateInterviewData, InterviewType } from '@/types/interviews';

import { ActionButtons, Input, Select } from '@/shared/ui';

import styles from './styles.module.scss';

interface IProps {
  vacancies: { id: number; title: string }[];
  error: string;
  onCancel: () => void;
  onSubmit: (data: CreateInterviewData) => Promise<void>;
}

const interviewTypeOptions: { value: InterviewType; label: string }[] = [
  { value: 'PHONE', label: 'Phone' },
  { value: 'HR', label: 'HR' },
  { value: 'TECHNICAL', label: 'Technical' },
  { value: 'FINAL', label: 'Final' },
];

function InterviewCreateForm({ vacancies, error, onCancel, onSubmit }: IProps) {
  const [vacancyId, setVacancyId] = useState('');
  const [interviewType, setInterviewType] = useState<InterviewType | ''>('');
  const [date, setDate] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isSubmitDisabled =
    !vacancyId || !interviewType || !date.trim() || !Number.isFinite(new Date(date).getTime());

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (
      isSubmitDisabled ||
      isSubmitting ||
      !vacancyId ||
      !interviewType ||
      !Number.isFinite(new Date(date).getTime())
    ) {
      return;
    }

    setIsSubmitting(true);

    try {
      await onSubmit({
        date: new Date(date).toISOString(),
        notes: notes.trim() || undefined,
        types: interviewType,
        vacancyId: Number(vacancyId),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const vacancyOptions = vacancies.map((vacancy) => ({
    value: String(vacancy.id),
    label: vacancy.title,
  }));

  return (
    <form className={styles['interview-create-form']} onSubmit={handleSubmit}>
      <div className={styles['interview-create-form__field']}>
        <label htmlFor="create-interview-vacancy">Vacancy</label>
        <Select
          value={vacancyId}
          options={vacancyOptions}
          onChange={setVacancyId}
          placeholder="Select vacancy"
          disabled={isSubmitting}
        />
      </div>

      <div className={styles['interview-create-form__row']}>
        <div className={styles['interview-create-form__field']}>
          <label htmlFor="create-interview-type">Interview type</label>
          <Select
            value={interviewType}
            options={interviewTypeOptions}
            onChange={setInterviewType}
            placeholder="Select type"
            disabled={isSubmitting}
          />
        </div>

        <div className={styles['interview-create-form__field']}>
          <label htmlFor="create-interview-date">Date &amp; time</label>
          <Input
            id="create-interview-date"
            type="datetime-local"
            value={date}
            onChange={(event) => setDate(event.target.value)}
            disabled={isSubmitting}
          />
        </div>
      </div>

      <div className={styles['interview-create-form__field']}>
        <label htmlFor="create-interview-notes">Notes</label>
        <textarea
          id="create-interview-notes"
          className={styles['interview-create-form__textarea']}
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          placeholder="Preparation notes, contacts, links..."
          disabled={isSubmitting}
        />
      </div>

      {error && (
        <p className={styles['interview-create-form__error']} role="alert">
          {error}
        </p>
      )}

      <ActionButtons
        onCancel={onCancel}
        isSubmitting={isSubmitting}
        isSubmitDisabled={isSubmitDisabled}
        submitText="Create Interview"
        submittingText="Creating Interview..."
      />
    </form>
  );
}

export default InterviewCreateForm;
