import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import type { Interview, UpdateInterviewData } from '@/types/interviews';
import type { Vacancy } from '@/types/vacancy';

import { interviewsService, vacanciesService } from '@/services';
import { Modal } from '@/shared/ui';
import type {
  InterviewDateFilter,
  InterviewSort,
  InterviewTypeFilter,
} from './components/InterviewsFilters/config';

import {
  InterviewsHeader,
  InterviewsFilters,
  InterviewsList,
  InterviewsStats,
  InterviewEditForm,
} from './components';

import styles from './styles.module.scss';

function InterviewsPage() {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [vacancies, setVacancies] = useState<Vacancy[]>([]);
  const [selectedInterview, setSelectedInterview] = useState<Interview | null>(null);
  const [deleteError, setDeleteError] = useState('');
  const [editError, setEditError] = useState('');
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<InterviewTypeFilter>('ALL');
  const [dateFilter, setDateFilter] = useState<InterviewDateFilter>('ALL');
  const [sort, setSort] = useState<InterviewSort>('SOONEST');

  const navigate = useNavigate();
  const handleCreateInterview = () => {
    navigate('/interviews-create');
  };

  const handleDeleteInterview = async (interview: Interview) => {
    setDeleteError('');

    try {
      await interviewsService.deleteInterview(interview.id);
      setInterviews((current) => current.filter((item) => item.id !== interview.id));
    } catch (error) {
      console.error('Error deleting interview:', error);
      setDeleteError('Could not delete the interview. Please try again.');
    }
  };

  const handleEditInterview = (interview: Interview) => {
    setEditError('');
    setSelectedInterview(interview);
  };

  const handleUpdateInterview = async (data: UpdateInterviewData) => {
    if (!selectedInterview) {
      return;
    }

    setEditError('');

    try {
      const updatedInterview = await interviewsService.updateInterview(selectedInterview.id, data);
      setInterviews((current) =>
        current.map((item) => (item.id === updatedInterview.id ? updatedInterview : item))
      );
      setSelectedInterview(null);
    } catch (error) {
      console.error('Error updating interview:', error);
      setEditError('Could not update the interview. Please try again.');
    }
  };

  useEffect(() => {
    const loadInterviews = async () => {
      try {
        const data = await interviewsService.getInterviews();
        setInterviews(data);
      } catch (error) {
        console.error('Error fetching interviews:', error);
      }
    };

    void loadInterviews();

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

  const filteredInterviews = useMemo(() => {
    const now = new Date();

    return interviews
      .filter((interview) => {
        if (typeFilter === 'ALL') {
          return true;
        }

        return interview.types === typeFilter;
      })
      .filter((interview) => {
        if (dateFilter === 'ALL') {
          return true;
        }

        const date = new Date(interview.date);

        if (dateFilter === 'UPCOMING') {
          return date >= now;
        }

        return date < now;
      })
      .filter((interview) => {
        if (!search.trim()) {
          return true;
        }

        const value = search.toLowerCase();

        return (
          interview.vacancy.title.toLowerCase().includes(value) ||
          interview.vacancy.company.name.toLowerCase().includes(value)
        );
      })
      .sort((a, b) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();

        return sort === 'SOONEST' ? dateA - dateB : dateB - dateA;
      });
  }, [interviews, search, typeFilter, dateFilter, sort]);

  return (
    <div className={styles['interviews-page']}>
      <InterviewsHeader onCreate={handleCreateInterview} />

      <main className={styles['interviews-page__main']}>
        {deleteError && (
          <div className={styles['interviews-page__error']} role="alert">
            {deleteError}
          </div>
        )}

        <InterviewsStats interviews={interviews} />

        <InterviewsFilters
          search={search}
          onSearchChange={setSearch}
          type={typeFilter}
          onTypeChange={setTypeFilter}
          date={dateFilter}
          onDateChange={setDateFilter}
          sort={sort}
          onSortChange={setSort}
        />

        <InterviewsList
          interviews={filteredInterviews}
          onEdit={handleEditInterview}
          onDelete={(interview) => void handleDeleteInterview(interview)}
        />
      </main>

      {selectedInterview && (
        <Modal
          title="Edit Interview"
          onClose={() => setSelectedInterview(null)}
        >
          <InterviewEditForm
            key={selectedInterview.id}
            interview={selectedInterview}
            vacancies={[
              ...vacancies.map(({ id, title }) => ({ id, title })),
              ...(vacancies.some((vacancy) => vacancy.id === selectedInterview.vacancyId)
                ? []
                : [
                    {
                      id: selectedInterview.vacancyId,
                      title: selectedInterview.vacancy.title,
                    },
                  ]),
            ]}
            error={editError}
            onCancel={() => setSelectedInterview(null)}
            onSubmit={handleUpdateInterview}
          />
        </Modal>
      )}
    </div>
  );
}

export default InterviewsPage;
