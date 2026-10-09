import { BriefcaseBusiness, Clock3, Download, FileText, Pencil, Trash2 } from 'lucide-react';

import type { Resume } from '@/types/resume';
import type { Vacancy } from '@/types/vacancy';

import styles from './styles.module.scss';

interface IProps {
  resume: Resume;
  vacancy?: Vacancy;
  onEdit: (resume: Resume) => void;
  onDelete: (resume: Resume) => void;
  onDownload: (resume: Resume) => void;
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function ResumeCard({ resume, vacancy, onEdit, onDelete, onDownload }: IProps) {
  return (
    <div className={styles['resume-card']}>
      <div className={styles['resume-card__top']}>
        <div className={styles['resume-card__file-icon']}>
          <FileText size={22} />
        </div>
        <div className={styles['resume-card__actions']}>
          <button
            className={styles['resume-card__action']}
            type="button"
            onClick={() => onEdit(resume)}
          >
            <Pencil size={16} />
          </button>
          <button
            className={styles['resume-card__action']}
            type="button"
            onClick={() => onDelete(resume)}
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <div className={styles['resume-card__body']}>
        <h3 className={styles['resume-card__name']}>{resume.name}</h3>
        <p className={styles['resume-card__file']}>Resume file</p>
      </div>

      <div className={styles['resume-card__vacancy']}>
        {vacancy ? (
          <>
            <BriefcaseBusiness size={15} />
            <div className={styles['resume-card__vacancy-copy']}>
              <strong>{vacancy.title}</strong>
              <span className={styles['resume-card__company']}>{vacancy.company.name}</span>
            </div>
          </>
        ) : (
          <span className={styles['resume-card__unlinked']}>
            {resume.vacancyId === null ? 'Not linked to a vacancy' : 'Linked vacancy is unavailable'}
          </span>
        )}
      </div>

      <div className={styles['resume-card__footer']}>
        <span className={styles['resume-card__updated']}>
          <Clock3 size={14} />
          Updated {formatDate(resume.updatedAt)}
        </span>
        <button
          className={styles['resume-card__download']}
          type="button"
          onClick={() => onDownload(resume)}
        >
          <Download size={16} />
        </button>
      </div>
    </div>
  );
}

export default ResumeCard;
