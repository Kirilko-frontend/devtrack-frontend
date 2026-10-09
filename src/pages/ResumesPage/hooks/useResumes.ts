import { useEffect, useMemo, useState } from 'react';

import { resumesService, vacanciesService } from '@/services';
import type { CreateResumeData, Resume, UpdateResumeData } from '@/types/resume';
import type { Vacancy } from '@/types/vacancy';

type ResumeDialog = { mode: 'upload' } | { mode: 'edit'; resume: Resume } | null;

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === 'object' && error !== null && 'data' in error) {
    const data = error.data;

    if (typeof data === 'object' && data !== null && 'message' in data) {
      const message = data.message;

      if (typeof message === 'string') {
        return message;
      }

      if (Array.isArray(message)) {
        return message
          .map((item) => {
            if (typeof item === 'string') {
              return item;
            }

            if (typeof item === 'object' && item !== null && 'field' in item) {
              const field = item.field;
              const errors = 'errors' in item ? item.errors : undefined;

              if (typeof field === 'string' && Array.isArray(errors)) {
                return `${field}: ${errors.filter((entry) => typeof entry === 'string').join(', ')}`;
              }
            }

            return '';
          })
          .filter(Boolean)
          .join('; ');
      }
    }
  }

  return 'Something went wrong. Please try again.';
}

function useResumes() {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [vacancies, setVacancies] = useState<Vacancy[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasLoadError, setHasLoadError] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [dialog, setDialog] = useState<ResumeDialog>(null);
  const [error, setError] = useState('');
  const [vacancyError, setVacancyError] = useState('');

  useEffect(() => {
    let isMounted = true;

    const loadResumes = async () => {
      try {
        const data = await resumesService.getResumes();

        if (isMounted) {
          setResumes(data);
        }
      } catch (loadError) {
        if (isMounted) {
          setHasLoadError(true);
          setError(getErrorMessage(loadError));
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    const loadVacancies = async () => {
      try {
        const response = await vacanciesService.getVacancies({ page: 1, limit: 100 });

        if (isMounted) {
          setVacancies(response.data);
        }
      } catch (loadError) {
        if (isMounted) {
          setVacancyError(getErrorMessage(loadError));
        }
      }
    };

    void loadResumes();
    void loadVacancies();

    return () => {
      isMounted = false;
    };
  }, []);

  const vacanciesById = useMemo(
    () => new Map(vacancies.map((vacancy) => [vacancy.id, vacancy])),
    [vacancies],
  );

  const sortedResumes = useMemo(
    () =>
      [...resumes].sort(
        (first, second) => Date.parse(second.updatedAt) - Date.parse(first.updatedAt),
      ),
    [resumes],
  );

  const openUploadDialog = () => {
    setError('');
    setDialog({ mode: 'upload' });
  };

  const openEditDialog = (resume: Resume) => {
    setError('');
    setDialog({ mode: 'edit', resume });
  };

  const closeDialog = () => {
    if (!isSaving) {
      setDialog(null);
      setError('');
    }
  };

  const saveResume = async (data: CreateResumeData | UpdateResumeData) => {
    if (!dialog) {
      return;
    }

    setIsSaving(true);
    setError('');

    try {
      if (dialog.mode === 'upload' && 'file' in data) {
        const createdResume = await resumesService.uploadResume(data);
        setResumes((current) => [createdResume, ...current]);
      } else if (dialog.mode === 'edit' && !('file' in data)) {
        const updatedResume = await resumesService.updateResume(dialog.resume.id, data);
        setResumes((current) =>
          current.map((resume) => (resume.id === updatedResume.id ? updatedResume : resume)),
        );
      } else {
        return;
      }

      setDialog(null);
    } catch (saveError) {
      setError(getErrorMessage(saveError));
    } finally {
      setIsSaving(false);
    }
  };

  const deleteResume = async (resume: Resume) => {
    if (!window.confirm(`Delete "${resume.name}"?`)) {
      return;
    }

    setError('');

    try {
      await resumesService.deleteResume(resume.id);
      setResumes((current) => current.filter((item) => item.id !== resume.id));
    } catch (deleteError) {
      setError(getErrorMessage(deleteError));
    }
  };

  const downloadResume = async (resume: Resume) => {
    setError('');

    try {
      const { blob, filename } = await resumesService.downloadResume(resume.id);
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');

      link.href = url;
      link.download = filename ?? resume.name;
      document.body.append(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (downloadError) {
      setError(getErrorMessage(downloadError));
    }
  };

  return {
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
  };
}

export default useResumes;
