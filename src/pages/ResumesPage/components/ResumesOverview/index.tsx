import { FileText } from 'lucide-react';

import styles from './styles.module.scss';

interface IProps {
  count: number;
}

function ResumesOverview({ count }: IProps) {
  return (
    <div className={styles['resumes-overview']}>
      <div className={styles['resumes-overview__icon']}>
        <FileText size={22} />
      </div>
      <div className={styles['resumes-overview__content']}>
        <h2 className={styles['resumes-overview__title']}>Your resume library</h2>
        <p className={styles['resumes-overview__description']}>
          Tailor a resume for every role and keep all your versions in one place.
        </p>
      </div>
      <div className={styles['resumes-overview__count']}>
        <span className={styles['resumes-overview__count-value']}>{count}</span>
        <span className={styles['resumes-overview__count-label']}>saved resumes</span>
      </div>
    </div>
  );
}

export default ResumesOverview;
