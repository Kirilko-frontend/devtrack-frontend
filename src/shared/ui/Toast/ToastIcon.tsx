import styles from './styles.module.scss';

export type ToastType = 'created' | 'updated' | 'deleted' | 'error' | 'info';

interface IToastIconProps {
  type: ToastType;
}

/**
 * Hand-drawn 24×24 icons, one per toast type. Each has its own enter animation
 * (see styles: check draws in, trash lid lifts, pencil writes a line, ! shakes, i drops).
 */
function ToastIcon({ type }: IToastIconProps) {
  return (
    <svg
      className={`${styles['toast__icon']} ${styles[`toast__icon--${type}`]}`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {type === 'created' && (
        <path className={styles['toast__draw']} d="M6.5 12.5l3.6 3.6L17.5 8.5" pathLength={1} />
      )}

      {type === 'updated' && (
        <>
          <path d="M14.5 5.5l3 3L9 17l-3.5.5L6 14z" />
          <path d="M12.5 7.5l3 3" />
          <path className={styles['toast__draw']} d="M12 19.5h7" pathLength={1} />
        </>
      )}

      {type === 'deleted' && (
        <>
          <g className={styles['toast__lid']}>
            <path d="M5 7h14" />
            <path d="M10 7V5.5h4V7" />
          </g>
          <path d="M7 7l.8 11.1a1.5 1.5 0 0 0 1.5 1.4h5.4a1.5 1.5 0 0 0 1.5-1.4L17 7" />
          <path d="M10.5 10.5v5.5M13.5 10.5v5.5" />
        </>
      )}

      {type === 'error' && (
        <>
          <path className={styles['toast__draw']} d="M12 6.5v7" pathLength={1} />
          <circle className={styles['toast__dot']} cx="12" cy="17.5" r="0.6" fill="currentColor" />
        </>
      )}

      {type === 'info' && (
        <>
          <circle className={styles['toast__dot']} cx="12" cy="6.8" r="0.6" fill="currentColor" />
          <path className={styles['toast__draw']} d="M12 10.5v7" pathLength={1} />
        </>
      )}
    </svg>
  );
}

export default ToastIcon;
