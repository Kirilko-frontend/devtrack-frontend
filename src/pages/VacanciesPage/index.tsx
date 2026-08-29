import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';

import { type VacancySort, type VacancyStatusFilter } from '@/shared/constants/vacancies';

import type { Vacancy } from '@/types/vacancy';

import { vacanciesService } from '@/services';

import { Button, Pagination } from '@/shared/ui';
import { VacancyFilters, VacancyModal, VacancyTable } from './components';

import styles from './styles.module.scss';

function VacanciesPage() {
  const navigate = useNavigate();

  const [vacancies, setVacancies] = useState<Vacancy[]>([]);
  const [selectedVacancy, setSelectedVacancy] = useState<Vacancy | null>(null);

  // const [isEditing, setIsEditing] = useState();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<VacancyStatusFilter>('ALL');
  const [sort, setSort] = useState<VacancySort>('NEWEST');

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const loadVacancies = async () => {
      try {
        const response = await vacanciesService.getVacancies({
          page,
          limit: 10,
          search,
          status: statusFilter,
          sort,
        });

        setVacancies(response.data);
        setTotalPages(response.meta.totalPages);
      } catch (error) {
        console.error('Vacancies error:', error);
      }
    };

    void loadVacancies();
  }, [page, search, statusFilter, sort]);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleStatusChange = (value: VacancyStatusFilter) => {
    setStatusFilter(value);
    setPage(1);
  };

  const handleSortChange = (value: VacancySort) => {
    setSort(value);
    setPage(1);
  };

  const handleSelectVacancy = (vacancy: Vacancy) => {
    setSelectedVacancy(vacancy);
  };

  const handleNavigate = () => {
    navigate('/vacancies-create');
  };

  const handleCloseModal = () => {
    setSelectedVacancy(null);
  };

  return (
    <div className={styles['vacancies-page']}>
      <div className={styles['vacancies-page__header']}>
        <h1 className={styles['vacancies-page__title']}>Manage and track your job opportunities</h1>

        <Button className={styles['vacancies-page__create-button']} onClick={handleNavigate}>
          <Plus className={styles['vacancies-page__create-button-icon']} />
          Add vacancy
        </Button>
      </div>

      <main className={styles['vacancies-page__main']}>
        <VacancyFilters
          search={search}
          onSearchChange={handleSearchChange}
          status={statusFilter}
          onStatusChange={handleStatusChange}
          sort={sort}
          onSortChange={handleSortChange}
        />

        <VacancyTable vacancies={vacancies} onSelectVacancy={handleSelectVacancy} />
      </main>

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />

      {selectedVacancy && (
        <VacancyModal vacancy={selectedVacancy} onClose={handleCloseModal}></VacancyModal>
      )}
    </div>
  );
}

export default VacanciesPage;
