import { useCallback, useEffect, useState } from 'react';

import { X } from 'lucide-react';

import { Button } from '@/shared/ui';

import styles from './styles.module.scss';

interface IProps {
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

const CLOSE_ANIMATION_DURATION = 250;

function Modal({ onClose, title, children }: IProps) {
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
      className={`${styles['modal']} ${isClosing ? styles['modal--closing'] : ''}`}
      onMouseDown={handleClose}
    >
      <div
        className={styles['modal__dialog']}
        role="dialog"
        aria-modal="true"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className={styles['modal__header']}>
          {title && <h2 className={styles['modal__title']}>{title}</h2>}

          <Button
            className={styles['modal__button']}
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

export default Modal;
