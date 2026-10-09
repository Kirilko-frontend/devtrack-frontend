import { Modal } from '@/shared/ui';

import {
  ResumeForm,
  ResumesHeader,
  ResumesList,
  ResumesOverview,
} from './components';
import useResumes from './hooks/useResumes';

import styles from './styles.module.scss';

function ResumesPage() {
  const {
    resumes,
    sortedResumes,
    vacancies,
    vacanciesById,
    isLoading,
    hasLoadError,
    isSaving,
    dialog,
    error,
    vacancyError,
    openUploadDialog,
    openEditDialog,
    closeDialog,
    saveResume,
    deleteResume,
    downloadResume,
  } = useResumes();

  return (
    <div className={styles['resumes-page']}>
      <ResumesHeader onUpload={openUploadDialog} />

      <div className={styles['resumes-page__main']}>
        {error && !dialog && <div className={styles['resumes-page__error']}>{error}</div>}

        <ResumesOverview count={resumes.length} />

        <div className={styles['resumes-library']}>
          {vacancyError && (
            <div className={styles['resumes-page__notice']}>
              Vacancies could not be loaded. Resume files are still available, but vacancy links
              cannot be edited.
            </div>
          )}

          <ResumesList
            resumes={sortedResumes}
            vacanciesById={vacanciesById}
            isLoading={isLoading}
            hasLoadError={hasLoadError}
            onEdit={openEditDialog}
            onDelete={(resume) => void deleteResume(resume)}
            onDownload={(resume) => void downloadResume(resume)}
          />
        </div>
      </div>

      {dialog && (
        <Modal
          onClose={closeDialog}
          title={dialog.mode === 'upload' ? 'Upload resume' : 'Edit resume'}
        >
          <ResumeForm
            key={dialog.mode === 'edit' ? dialog.resume.id : 'upload'}
            mode={dialog.mode}
            resume={dialog.mode === 'edit' ? dialog.resume : undefined}
            vacancies={vacancies}
            isSaving={isSaving}
            isVacanciesUnavailable={Boolean(vacancyError)}
            error={error}
            onCancel={closeDialog}
            onSubmit={(data) => void saveResume(data)}
          />
        </Modal>
      )}
    </div>
  );
}

export default ResumesPage;
