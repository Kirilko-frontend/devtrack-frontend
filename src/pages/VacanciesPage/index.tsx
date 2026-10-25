import { useEffect, useState } from 'react';

import { type VacancySort, type VacancyStatusFilter } from '@/shared/constants/vacancies';

import type { Vacancy, VacancyFormValues } from '@/types/vacancy';
import type { Company } from '@/types/company';

import { companiesService, vacanciesService } from '@/services';

import { Header, VacancyForm } from '@/widgets';
import { Modal, Pagination } from '@/shared/ui';
import { VacancyFilters, VacancyTable } from './components';

import styles from './styles.module.scss';

function VacanciesPage() {
  const [vacancies, setVacancies] = useState<Vacancy[]>([]);
  const [selectedVacancy, setSelectedVacancy] = useState<Vacancy | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createError, setCreateError] = useState('');
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
        title: values.title.trim(),
        description: values.description.trim(),
        url: values.url.trim() || undefined,
        salary: values.salary.trim(),
        companyId: values.companyId!,
        appliedAt: values.appliedAt || undefined,
        status: values.status,
      });

      setVacancies((current) =>
        current.map((vacancy) => (vacancy.id === updatedVacancy.id ? updatedVacancy : vacancy))
      );

      setSelectedVacancy(null);
    } catch (error) {
      console.error('Update vacancy error:', JSON.stringify(error, null, 2));
    }
  };

  const handleCreateVacancy = async (values: VacancyFormValues) => {
    setCreateError('');

    try {
      const createdVacancy = await vacanciesService.createVacancy({
        title: values.title.trim(),
        description: values.description.trim() || undefined,
        url: values.url.trim() || undefined,
        salary: values.salary.trim() || undefined,
        companyId: values.companyId!,
        status: values.status,
        appliedAt: values.appliedAt || undefined,
      });

      setSearch('');
      setStatusFilter('ALL');
      setSort('NEWEST');
      setPage(1);
      setVacancies((current) =>
        [createdVacancy, ...current.filter((vacancy) => vacancy.id !== createdVacancy.id)].slice(
          0,
          10
        )
      );

      try {
        const response = await vacanciesService.getVacancies({
          page: 1,
          limit: 10,
          status: 'ALL',
          sort: 'NEWEST',
        });
        setVacancies(response.data);
        setTotalPages(response.meta.totalPages);
      } catch (error) {
        console.error('Error refreshing vacancies after creation:', error);
      }

      setIsCreateModalOpen(false);
    } catch (error) {
      console.error('Create vacancy error:', error);
      setCreateError('Could not create the vacancy. Please try again.');
    }
  };

  const handleCreateCompany = async (name: string) => {
    const company = await companiesService.createCompany({
      name,
    });

    setCompanies((current) => [...current, company]);

    return company;
  };

  const handleCloseModal = () => {
    setSelectedVacancy(null);
  };

  const handleOpenCreateModal = () => {
    setCreateError('');
    setIsCreateModalOpen(true);
  };

  return (
    <div className={styles['vacancies-page']}>
      <Header
        title="Vacancies"
        subtitle="Manage and track your job opportunities."
        actionText="Add vacancy"
        onAction={handleOpenCreateModal}
      />

      <main className={styles['vacancies-page__main']}>
        <VacancyFilters
          search={search}
          onSearchChange={handleSearchChange}
          status={statusFilter}
          onStatusChange={handleStatusChange}
          sort={sort}
          onSortChange={handleSortChange}
        />

        <VacancyTable vacancies={vacancies} onEditVacancy={handleSelectVacancy} />
      </main>

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />

      {isCreateModalOpen && (
        <Modal onClose={() => setIsCreateModalOpen(false)} title="Create Vacancy">
          <VacancyForm
            companies={companies}
            onSubmit={handleCreateVacancy}
            onCancel={() => setIsCreateModalOpen(false)}
            onCreateItem={handleCreateCompany}
            error={createError}
          />
        </Modal>
      )}

      {selectedVacancy && (
        <Modal onClose={handleCloseModal} title="Edit Vacancy">
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
            onCreateItem={handleCreateCompany}
          />
        </Modal>
      )}
    </div>
  );
}

export default VacanciesPage;
