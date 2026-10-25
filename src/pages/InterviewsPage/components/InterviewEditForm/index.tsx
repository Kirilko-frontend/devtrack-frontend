import { useState, type FormEvent } from 'react';

import type { Interview, InterviewType, UpdateInterviewData } from '@/types/interviews';

import { ActionButtons, Input, Select } from '@/shared/ui';

import styles from './styles.module.scss';

interface IProps {
  interview: Interview;
  vacancies: { id: number; title: string }[];
  error: string;
  onCancel: () => void;
  onSubmit: (data: UpdateInterviewData) => Promise<void>;
}

const interviewTypeOptions: { value: InterviewType; label: string }[] = [
  { value: 'PHONE', label: 'Phone' },
  { value: 'HR', label: 'HR' },
  { value: 'TECHNICAL', label: 'Technical' },
  { value: 'FINAL', label: 'Final' },
];

function toLocalDateTime(value: string) {
  const date = new Date(value);
  const timezoneOffset = date.getTimezoneOffset() * 60_000;

  return new Date(date.getTime() - timezoneOffset).toISOString().slice(0, 16);
}

function InterviewEditForm({ interview, vacancies, error, onCancel, onSubmit }: IProps) {
  const initialDate = toLocalDateTime(interview.date);
  const initialNotes = interview.notes ?? '';
  const [vacancyId, setVacancyId] = useState(String(interview.vacancyId));
  const [interviewType, setInterviewType] = useState<InterviewType>(interview.types);
  const [date, setDate] = useState(initialDate);
  const [notes, setNotes] = useState(initialNotes);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const hasChanges =
    vacancyId !== String(interview.vacancyId) ||
    interviewType !== interview.types ||
    date !== initialDate ||
    notes !== initialNotes;
  const isSubmitDisabled =
    !vacancyId ||
    !interviewType ||
    !date.trim() ||
    !Number.isFinite(new Date(date).getTime()) ||
    !hasChanges;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isSubmitDisabled || isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    try {
      await onSubmit({
        date: new Date(date).toISOString(),
        notes: notes.trim(),
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
    <form className={styles['interview-edit-form']} onSubmit={handleSubmit}>
      <div className={styles['interview-edit-form__field']}>
        <label htmlFor="edit-interview-vacancy">Vacancy</label>
        <Select
          value={vacancyId}
          options={vacancyOptions}
          onChange={setVacancyId}
          placeholder="Select vacancy"
          disabled={isSubmitting}
        />
      </div>

      <div className={styles['interview-edit-form__row']}>
        <div className={styles['interview-edit-form__field']}>
          <label htmlFor="edit-interview-type">Interview type</label>
          <Select
            value={interviewType}
            options={interviewTypeOptions}
            onChange={setInterviewType}
            placeholder="Select type"
            disabled={isSubmitting}
          />
        </div>

        <div className={styles['interview-edit-form__field']}>
          <label htmlFor="edit-interview-date">Date &amp; time</label>
          <Input
            id="edit-interview-date"
            type="datetime-local"
            value={date}
            onChange={(event) => setDate(event.target.value)}
            disabled={isSubmitting}
          />
        </div>
      </div>

      <div className={styles['interview-edit-form__field']}>
        <label htmlFor="edit-interview-notes">Notes</label>
        <textarea
          id="edit-interview-notes"
          className={styles['interview-edit-form__textarea']}
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          placeholder="Preparation notes, contacts, links..."
          disabled={isSubmitting}
        />
      </div>

      {error && (
        <p className={styles['interview-edit-form__error']} role="alert">
          {error}
        </p>
      )}

      <ActionButtons
        onCancel={onCancel}
        isSubmitting={isSubmitting}
        isSubmitDisabled={isSubmitDisabled}
        submitText="Save Changes"
        submittingText="Saving Interview..."
      />
    </form>
  );
}

export default InterviewEditForm;
