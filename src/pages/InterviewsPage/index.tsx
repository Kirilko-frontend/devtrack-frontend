import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import type { Interview } from '@/types/interviews';

import { interviewsService } from '@/services';
import type {
  InterviewDateFilter,
  InterviewSort,
  InterviewTypeFilter,
} from './components/InterviewsFilters/config';

import { Header, InterviewsFilters, InterviewsList, InterviewsStats } from './components';

import styles from './styles.module.scss';

function InterviewsPage() {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<InterviewTypeFilter>('ALL');
  const [dateFilter, setDateFilter] = useState<InterviewDateFilter>('ALL');
  const [sort, setSort] = useState<InterviewSort>('SOONEST');

  const navigate = useNavigate();
  const handleCreateInterview = () => {
    navigate('/interviews-create');
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
      <Header onCreate={handleCreateInterview} />

      <main className={styles['interviews-page__main']}>
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

        <InterviewsList interviews={filteredInterviews} />
      </main>
    </div>
  );
}

export default InterviewsPage;
