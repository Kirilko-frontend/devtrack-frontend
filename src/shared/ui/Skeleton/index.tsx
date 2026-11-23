import styles from './styles.module.scss';

interface ISkeletonProps {
  width?: string;
  height?: string;
  radius?: string;
  className?: string;
}

/** Placeholder block with a shimmer, shown while content is loading. */
function Skeleton({
  width = '100%',
  height = '1rem',
  radius = 'var(--radius-sm)',
  className,
}: ISkeletonProps) {
  return (
    <span
      className={`${styles['skeleton']} ${className ?? ''}`}
      style={{ width, height, borderRadius: radius }}
      aria-hidden="true"
    />
  );
}

export default Skeleton;
