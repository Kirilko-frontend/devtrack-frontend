import { Plus } from 'lucide-react';

import { Button } from '@/shared/ui';

import styles from './styles.module.scss';

interface IProps {
  onUpload: () => void;
}

function ResumesHeader({ onUpload }: IProps) {
  return (
    <div className={styles['resumes-header']}>
      <div>
        <h1 className={styles['resumes-header__title']}>Resumes</h1>
        <p className={styles['resumes-header__description']}>
          Keep your CVs organized and ready for your next opportunity
        </p>
      </div>

      <Button className={styles['resumes-header__upload-button']} type="button" onClick={onUpload}>
        <Plus size={18} />
        Upload resume
      </Button>
    </div>
  );
}

export default ResumesHeader;
