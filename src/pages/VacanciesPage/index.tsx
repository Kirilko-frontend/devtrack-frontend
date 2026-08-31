import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';

import { type VacancySort, type VacancyStatusFilter } from '@/shared/constants/vacancies';

import type { Vacancy, VacancyFormValues } from '@/types/vacancy';
import type { Company } from '@/types/company';

import { companiesService, vacanciesService } from '@/services';

import { VacancyForm } from '@/widgets';
import { Button, Pagination } from '@/shared/ui';
import { VacancyFilters, VacancyModal, VacancyTable } from './components';

import styles from './styles.module.scss';

function VacanciesPage() {
  const navigate = useNavigate();

  const [vacancies, setVacancies] = useState<Vacancy[]>([]);
  const [selectedVacancy, setSelectedVacancy] = useState<Vacancy | null>(null);
  const [companies, setCompanies] = useState<Company[]>([]);

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

  useEffect(() => {
    const loadCompanies = async () => {
      try {
        const response = await companiesService.getCompanies();
        setCompanies(response);
      } catch (error) {
        console.error('Companies error:', error);
      }
    };

    void loadCompanies();
  }, []);

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

  const handleUpdateVacancy = async (values: VacancyFormValues) => {
    if (!selectedVacancy) {
      return;
    }

    try {
      const updatedVacancy = await vacanciesService.updateVacancy(selectedVacancy.id, {
        title: values.title,
        description: values.description,
        url: values.url,
        salary: values.salary,
        companyId: values.companyId!,
        appliedAt: values.appliedAt,
        status: values.status,
      });

      setVacancies((current) =>
        current.map((vacancy) => (vacancy.id === updatedVacancy.id ? updatedVacancy : vacancy))
      );

      setSelectedVacancy(null);
    } catch (error) {
      console.error('Update vacancy error:', error);
    }
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
        <VacancyModal onClose={handleCloseModal}>
          <VacancyForm
            initialValues={{
              title: selectedVacancy.title,
              description: selectedVacancy.description ?? '',
              url: selectedVacancy.url ?? '',
              salary: selectedVacancy.salary ?? '',
              companyId: selectedVacancy.companyId,
              appliedAt: selectedVacancy.appliedAt ? selectedVacancy.appliedAt.split('T')[0] : '',
              status: selectedVacancy.status,
            }}
            companies={companies}
            onSubmit={handleUpdateVacancy}
            onCancel={handleCloseModal}
          />
        </VacancyModal>
      )}
    </div>
  );
}

export default VacanciesPage;
