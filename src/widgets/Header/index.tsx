import { Button } from '@/shared/ui';

import styles from './styles.module.scss';

interface IProps {
  title: string;
  subtitle?: string;
  actionText?: string;
  onAction?: () => void;
}

function Header({ title, subtitle, actionText, onAction }: IProps) {
  return (
    <header className={styles['header']}>
      <div className={styles['header__content']}>
        <h2 className={styles['header__title']}>{title}</h2>
        {subtitle && <p className={styles['header__subtitle']}>{subtitle}</p>}
      </div>

      {actionText && onAction && (
        <Button
          className={styles['header__action']}
          variant="accent"
          type="button"
          onClick={onAction}
        >
          {actionText}
        </Button>
      )}
    </header>
  );
}

export default Header;
