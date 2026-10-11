import { Plus } from 'lucide-react';

import { Button } from '@/shared/ui';

import styles from './styles.module.scss';

interface IProps {
  onCreate: () => void;
}

function VacanciesHeader({ onCreate }: IProps) {
  return (
    <div className={styles['vacancies-header']}>
      <h1 className={styles['vacancies-header__title']}>
        Manage and track your job opportunities
      </h1>

      <Button
        className={styles['vacancies-header__create-button']}
        variant="accent"
        onClick={onCreate}
      >
        <Plus className={styles['vacancies-header__create-button-icon']} />
        Add vacancy
      </Button>
    </div>
  );
}

export default VacanciesHeader;
