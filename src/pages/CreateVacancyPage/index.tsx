import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import type { Company } from '@/types/company';
import type { VacancyFormValues } from '@/types/vacancy';

import { companiesService, vacanciesService } from '@/services';

import VacancyForm from './components/VacancyForm';

import styles from './styles.module.scss';

function CreateVacancyPage() {
  const navigate = useNavigate();

  const [companies, setCompanies] = useState<Company[]>([]);

  useEffect(() => {
    const loadCompanies = async () => {
      try {
        const data = await companiesService.getCompanies();

        setCompanies(data);
      } catch (error) {
        console.error('Companies error:', error);
      }
    };

    void loadCompanies();
  }, []);

  const handleSubmit = async (values: VacancyFormValues) => {
    if (values.companyId === null) {
      return;
    }

    try {
      await vacanciesService.createVacancy({
        title: values.title,
        description: values.description || undefined,
        url: values.url || undefined,
        salary: values.salary || undefined,
        companyId: values.companyId,
      });

      navigate('/vacancies');
    } catch (error) {
      console.error('Create vacancy error:', error);
    }
  };

  const handleCancel = () => {
    navigate('/vacancies');
  };

  return (
    <div className={styles['create-vacancy-page']}>
      <h1 className={styles['create-vacancy-page__title']}>
        Add a new job opportunity to your vacancies.
      </h1>

      <VacancyForm companies={companies} onSubmit={handleSubmit} onCancel={handleCancel} />
    </div>
  );
}

export default CreateVacancyPage;
