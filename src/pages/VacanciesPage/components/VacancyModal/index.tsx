import type { Vacancy } from '@/types/vacancy';

import styles from './styles.module.scss';

interface IProps {
  vacancy: Vacancy;
  onClose: () => void;
}

function VacancyModal({ vacancy, onClose }: IProps) {
  return (
    <div className={styles['vacancy-modal']}>
      <h1>VacancyModal</h1>
    </div>
  );
}

export default VacancyModal;
