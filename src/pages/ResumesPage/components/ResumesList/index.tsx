import type { Resume } from '@/types/resume';
import type { Vacancy } from '@/types/vacancy';

import { Empty } from '@/shared/ui';

import ResumeCard from '../ResumeCard';
import styles from './styles.module.scss';

interface IProps {
  resumes: Resume[];
  vacanciesById: Map<number, Vacancy>;
  isLoading: boolean;
  hasLoadError: boolean;
  onEdit: (resume: Resume) => void;
  onDelete: (resume: Resume) => void;
  onDownload: (resume: Resume) => void;
}

function ResumesList({
  resumes,
  vacanciesById,
  isLoading,
  hasLoadError,
  onEdit,
  onDelete,
  onDownload,
}: IProps) {
  return (
    <div className={styles['resumes-list']}>
      <div className={styles['resumes-list__header']}>
        <h2 className={styles['resumes-list__title']}>All resumes</h2>
        <span className={styles['resumes-list__count']}>{resumes.length}</span>
      </div>

      {isLoading ? (
        <div className={styles['resumes-list__empty']}>Loading resumes...</div>
      ) : resumes.length === 0 ? (
        <Empty
          title={hasLoadError ? 'Resumes could not be loaded' : 'No resumes yet'}
          description={hasLoadError ? 'Please try again later.' : 'Upload a file to add your first resume.'}
        />
      ) : (
        <div className={styles['resumes-list__grid']}>
          {resumes.map((resume) => (
            <ResumeCard
              key={resume.id}
              resume={resume}
              vacancy={resume.vacancyId ? vacanciesById.get(resume.vacancyId) : undefined}
              onEdit={onEdit}
              onDelete={onDelete}
              onDownload={onDownload}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default ResumesList;
