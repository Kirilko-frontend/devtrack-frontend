import { FormEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import type { InterviewType } from '@/types/interviews';
import type { Vacancy } from '@/types/vacancy';

import { interviewsService, vacanciesService } from '@/services';

import { Button, Input, Select } from '@/shared/ui';

import styles from './styles.module.scss';

const interviewTypeOptions: {
  value: InterviewType;
  label: string;
}[] = [
  { value: 'PHONE', label: 'Phone' },
  { value: 'HR', label: 'HR' },
  { value: 'TECHNICAL', label: 'Technical' },
  { value: 'FINAL', label: 'Final' },
];

function CreateInterviewsPage() {
  const navigate = useNavigate();

  const [vacancies, setVacancies] = useState<Vacancy[]>([]);

  const [vacancyId, setVacancyId] = useState<number | null>(null);
  const [interviewType, setInterviewType] = useState<InterviewType | ''>('');
  const [date, setDate] = useState('');
  const [notes, setNotes] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadVacancies = async () => {
      try {
        const response = await vacanciesService.getVacancies({ limit: 100 });
        setVacancies(response.data);
      } catch (error) {
        console.error('Error fetching vacancies:', error);
      }
    };

    void loadVacancies();
  }, []);

  const vacancyOptions = vacancies.map((vacancy) => ({
    value: String(vacancy.id),
    label: vacancy.title,
  }));

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (vacancyId === null || !interviewType || !date.trim() || isSubmitting) {
      return;
    }

    try {
      setIsSubmitting(true);

      await interviewsService.createInterview({
        date: new Date(date).toISOString(),
        notes: notes.trim() || undefined,
        types: interviewType,
        vacancyId,
      });

      navigate('/interviews');
    } catch (error) {
      console.error('Error creating interview:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles['create-interview-page']}>
      <div className={styles['create-interview-page__card']}>
        <div className={styles['create-interview-page__header']}>
          <h1 className={styles['create-interview-page__title']}>Create Interview</h1>

          <p className={styles['create-interview-page__description']}>
            Schedule an interview for one of your vacancies.
          </p>
        </div>

        <form className={styles['create-interview-page__form']} onSubmit={handleSubmit}>
          <div className={styles['create-interview-page__field']}>
            <label htmlFor="vacancy">Vacancy</label>

            <Select
              value={vacancyId !== null ? String(vacancyId) : ''}
              options={vacancyOptions}
              onChange={(value) => setVacancyId(Number(value))}
              placeholder="Select vacancy"
            />
          </div>

          <div className={styles['create-interview-page__row']}>
            <div className={styles['create-interview-page__field']}>
              <label htmlFor="types">Interview type</label>

              <Select
                value={interviewType}
                options={interviewTypeOptions}
                onChange={(value) => setInterviewType(value as InterviewType)}
                placeholder="Select type"
              />
            </div>

            <div className={styles['create-interview-page__field']}>
              <label htmlFor="date">Date &amp; time</label>

              <Input
                id="date"
                type="datetime-local"
                className={styles['create-interview-page__date-input']}
                value={date}
                onChange={(event) => setDate(event.target.value)}
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className={styles['create-interview-page__field']}>
            <label htmlFor="notes">Notes</label>

            <textarea
              id="notes"
              className={styles['create-interview-page__textarea']}
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              placeholder="Preparation notes, contacts, links..."
              disabled={isSubmitting}
            />
          </div>

          <div className={styles['create-interview-page__actions']}>
            <Button type="button" onClick={() => navigate('/interviews')} disabled={isSubmitting}>
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={vacancyId === null || !interviewType || !date.trim() || isSubmitting}
            >
              {isSubmitting ? 'Creating...' : 'Create Interview'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateInterviewsPage;

