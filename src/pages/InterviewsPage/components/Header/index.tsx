import { Plus } from 'lucide-react';

import { Button } from '@/shared/ui';

import styles from './styles.module.scss';

interface IProps {
  onCreate?: () => void;
}

function Header({ onCreate }: IProps) {
  return (
    <div className={styles['interviews-header']}>
      <div>
        <h1 className={styles['interviews-header__title']}>Interviews</h1>

        <p className={styles['interviews-header__description']}>
          Manage and prepare for your upcoming interviews
        </p>
      </div>

      <Button className={styles['interviews-header__create-button']} onClick={onCreate}>
        <Plus size={18} />
        Add interview
      </Button>
    </div>
  );
}

export default Header;
