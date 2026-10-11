import { Plus } from 'lucide-react';

import { Button } from '@/shared/ui';

import styles from './styles.module.scss';

interface IProps {
  onCreate: () => void;
}

function CompaniesHeader({ onCreate }: IProps) {
  return (
    <div className={styles['companies-header']}>
      <h1 className={styles['companies-header__title']}>Your Companies</h1>
      <Button
        className={styles['companies-header__create-button']}
        variant="accent"
        onClick={onCreate}
      >
        <Plus size={18} />
        Create Company
      </Button>
    </div>
  );
}

export default CompaniesHeader;
