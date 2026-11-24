import { useEffect, useMemo, useState } from 'react';

import type { CreateInterviewData, Interview, UpdateInterviewData } from '@/types/interviews';
import type { Vacancy } from '@/types/vacancy';

import { interviewsService, vacanciesService } from '@/services';
import { Button, Empty, Modal } from '@/shared/ui';
import { notify, subscribeToCreate } from '@/shared/utils';
import { toDayKey } from '@/shared/utils/interviews';
import { Header } from '@/widgets';
import type { InterviewDateFilter, InterviewTypeFilter } from './components/InterviewsFilters/config';

import {
  InterviewsFilters,
  InterviewsAgenda,
  MiniCalendar,
  InterviewsStats,
  InterviewEditForm,
  InterviewCreateForm,
} from './components';

import styles from './styles.module.scss';

function InterviewsPage() {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [vacancies, setVacancies] = useState<Vacancy[]>([]);
  const [selectedInterview, setSelectedInterview] = useState<Interview | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createError, setCreateError] = useState('');
  const [deleteError, setDeleteError] = useState('');
  const [editError, setEditError] = useState('');
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<InterviewTypeFilter>('ALL');
  const [dateFilter, setDateFilter] = useState<InterviewDateFilter>('ALL');
  // Day picked in the mini calendar (local yyyy-mm-dd), null = all days.
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  // "+ New" in the top bar and the command palette can open this modal from anywhere.
  useEffect(
    () =>
      subscribeToCreate('interview', () => {
        setCreateError('');
        setIsCreateModalOpen(true);
      }),
    []
  );

  const handleCreateInterview = () => {
    setCreateError('');
    setIsCreateModalOpen(true);
  };

  const handleDeleteInterview = async (interview: Interview) => {
    setDeleteError('');

    try {
      await interviewsService.deleteInterview(interview.id);
      setInterviews((current) => current.filter((item) => item.id !== interview.id));
      notify.deleted('Interview deleted', 'The interview was removed from your schedule.');
    } catch (error) {
      console.error('Error deleting interview:', error);
      setDeleteError('Could not delete the interview. Please try again.');
      notify.error('Could not delete interview', 'Please try again.');
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
      notify.updated('Interview updated', 'Your interview details have been saved.');
    } catch (error) {
      console.error('Error updating interview:', error);
      setEditError('Could not update the interview. Please try again.');
      notify.error('Could not update interview', 'Please try again.');
    }
  };

  const handleCreateInterviewSubmit = async (data: CreateInterviewData) => {
    setCreateError('');

    try {
      const createdInterview = await interviewsService.createInterview(data);
      setInterviews((current) => [createdInterview, ...current]);
      setSearch('');
      setTypeFilter('ALL');
      setDateFilter('ALL');
      setSelectedDay(null);
      setIsCreateModalOpen(false);
      notify.created('Interview created', 'Your interview has been added to the schedule.');
    } catch (error) {
      console.error('Error creating interview:', error);
      setCreateError('Could not create the interview. Please try again.');
      notify.error('Could not create interview', 'Please check the form and try again.');
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

  // The agenda decides the order itself (upcoming first, past at the end), so no sort here.
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
      .filter((interview) => !selectedDay || toDayKey(new Date(interview.date)) === selectedDay)
      .filter((interview) => {
        if (!search.trim()) {
          return true;
        }

        const value = search.toLowerCase();

        return (
          interview.vacancy.title.toLowerCase().includes(value) ||
          interview.vacancy.company.name.toLowerCase().includes(value)
        );
      });
  }, [interviews, search, typeFilter, dateFilter, selectedDay]);

  const selectedDayLabel = selectedDay
    ? new Date(`${selectedDay}T00:00:00`).toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
      })
    : null;

  return (
    <div className={styles['interviews-page']}>
      <Header
        title="Interviews"
        subtitle="Manage and prepare for your upcoming interviews."
        actionText="Add interview"
        onAction={handleCreateInterview}
      />

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
        />

        <div className={styles['interviews-page__content']}>
          <div className={styles['interviews-page__agenda']}>
            {selectedDayLabel && (
              <div className={styles['interviews-page__day-filter']}>
                <span>
                  Showing <strong>{selectedDayLabel}</strong>
                </span>
                <button
                  className={styles['interviews-page__day-filter-clear']}
                  type="button"
                  onClick={() => setSelectedDay(null)}
                >
                  Show all days
                </button>
              </div>
            )}

            {filteredInterviews.length > 0 ? (
              <InterviewsAgenda
                interviews={filteredInterviews}
                allInterviews={interviews}
                onEdit={handleEditInterview}
                onDelete={(interview) => void handleDeleteInterview(interview)}
              />
            ) : selectedDayLabel ? (
              <Empty
                title="Nothing planned for this day"
                description="Pick another day in the calendar or show all days."
                action={<Button onClick={() => setSelectedDay(null)}>Show all days</Button>}
              />
            ) : (
              <Empty
                title="No interviews found"
                description="Try changing your search or filters."
              />
            )}
          </div>

          <aside className={styles['interviews-page__aside']}>
            <MiniCalendar
              interviews={interviews}
              selectedDay={selectedDay}
              onSelectDay={setSelectedDay}
            />
          </aside>
        </div>
      </main>

      {isCreateModalOpen && (
        <Modal title="Create Interview" onClose={() => setIsCreateModalOpen(false)}>
          <InterviewCreateForm
            vacancies={vacancies.map(({ id, title }) => ({ id, title }))}
            error={createError}
            onCancel={() => setIsCreateModalOpen(false)}
            onSubmit={handleCreateInterviewSubmit}
          />
        </Modal>
      )}

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
