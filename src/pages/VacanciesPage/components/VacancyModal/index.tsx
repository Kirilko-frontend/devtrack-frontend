import { useCallback, useEffect, useState } from 'react';

import { X } from 'lucide-react';

import styles from './styles.module.scss';
import { Button } from '@/shared/ui';

interface IProps {
  onClose: () => void;
  children: React.ReactNode;
}

const CLOSE_ANIMATION_DURATION = 250;

function VacancyModal({ onClose, children }: IProps) {
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = useCallback(() => {
    if (isClosing) {
      return;
    }

    setIsClosing(true);

    window.setTimeout(() => {
      onClose();
    }, CLOSE_ANIMATION_DURATION);
  }, [isClosing, onClose]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleClose]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  return (
    <div
      className={`${styles['vacancy-modal']} ${isClosing ? styles['vacancy-modal--closing'] : ''}`}
      onMouseDown={handleClose}
    >
      <div
        className={styles['vacancy-modal__dialog']}
        role="dialog"
        aria-modal="true"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className={styles['vacancy-modal__header']}>
          <h2 className={styles['vacancy-modal__title']}>Vacancy</h2>

          <Button
            className={styles['vacancy-modal__button']}
            type="button"
            aria-label="Close"
            onClick={handleClose}
          >
            <X />
          </Button>
        </div>

        {children}
      </div>
    </div>
  );
}

export default VacancyModal;
