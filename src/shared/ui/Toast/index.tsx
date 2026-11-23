import type { CSSProperties } from 'react';
import { X } from 'lucide-react';
import { toast } from 'sonner';

import ToastIcon, { type ToastType } from './ToastIcon';

import styles from './styles.module.scss';

export const TOAST_DURATION_MS = 4500;

interface IToastProps {
  id: string | number;
  type: ToastType;
  title: string;
  description?: string;
  duration?: number;
}

/**
 * Notification card rendered through sonner's toast.custom().
 * The progress line at the bottom IS the timer: when its animation ends the toast
 * is dismissed, and hovering/focusing the toast pauses it (pure CSS play-state),
 * so the line and the moment the toast disappears always match.
 */
function Toast({ id, type, title, description, duration = TOAST_DURATION_MS }: IToastProps) {
  const dismiss = () => toast.dismiss(id);

  return (
    <div
      className={`${styles['toast']} ${styles[`toast--${type}`]}`}
      role={type === 'error' ? 'alert' : 'status'}
      style={{ '--toast-duration': `${duration}ms` } as CSSProperties}
    >
      <span className={styles['toast__badge']}>
        <ToastIcon type={type} />
      </span>

      <div className={styles['toast__content']}>
        <p className={styles['toast__title']}>{title}</p>
        {description && <p className={styles['toast__description']}>{description}</p>}
      </div>

      <button
        type="button"
        className={styles['toast__close']}
        aria-label="Close notification"
        onClick={dismiss}
      >
        <X size={14} aria-hidden="true" />
      </button>

      <span
        className={styles['toast__progress']}
        aria-hidden="true"
        onAnimationEnd={(event) => {
          // Only the progress animation dismisses the toast, not animations bubbling from children.
          if (event.target === event.currentTarget) {
            dismiss();
          }
        }}
      />
    </div>
  );
}

export default Toast;
export type { ToastType };
