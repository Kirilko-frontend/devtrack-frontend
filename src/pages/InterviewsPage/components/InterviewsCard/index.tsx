import { Pencil, Trash2 } from 'lucide-react';

import type { Interview } from '@/types/interviews';

import styles from './styles.module.scss';

interface IProps {
  interview: Interview;
  onEdit: (interview: Interview) => void;
  onDelete: (interview: Interview) => void;
}

function InterviewCard({ interview, onEdit, onDelete }: IProps) {
  const date = new Date(interview.date);

  return (
    <article className={styles['interview-card']}>
      <div className={styles['interview-card__date']}>
        <span className={styles['interview-card__month']}>
          {date.toLocaleDateString('en-US', {
            month: 'short',
          })}
        </span>

        <strong className={styles['interview-card__day']}>{date.getDate()}</strong>

        <span className={styles['interview-card__time']}>
          {date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </span>
      </div>

      <div className={styles['interview-card__content']}>
        <div className={styles['interview-card__top']}>
          <span className={styles['interview-card__type']}>{interview.types}</span>
          <div className={styles['interview-card__actions']}>
            <button
              className={styles['interview-card__action']}
              type="button"
              aria-label={`Edit interview for ${interview.vacancy.title}`}
              title="Edit interview"
              onClick={() => onEdit(interview)}
            >
              <Pencil size={16} />
            </button>
            <button
              className={`${styles['interview-card__action']} ${styles['interview-card__action--delete']}`}
              type="button"
              aria-label={`Delete interview for ${interview.vacancy.title}`}
              title="Delete interview"
              onClick={() => onDelete(interview)}
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>

        <h3 className={styles['interview-card__title']}>{interview.vacancy.title}</h3>

        <p className={styles['interview-card__company']}>{interview.vacancy.company.name}</p>

        {interview.notes && <p className={styles['interview-card__notes']}>{interview.notes}</p>}
      </div>
    </article>
  );
}

export default InterviewCard;
