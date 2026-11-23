import { ChevronLeft, ChevronRight } from 'lucide-react';

import styles from './styles.module.scss';

interface IProps {
  className?: string;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

function Pagination({ className, page, totalPages, onPageChange }: IProps) {
  const isFirstPage = page <= 1;
  const isLastPage = page >= totalPages;

  return (
    <nav className={`${styles['pagination']} ${className ?? ''}`} aria-label="Pagination">
      <button
        type="button"
        className={styles['pagination__button']}
        disabled={isFirstPage}
        onClick={() => onPageChange(page - 1)}
      >
        <ChevronLeft size={16} aria-hidden="true" />
        Previous
      </button>

      <p className={styles['pagination__text']}>
        {/* key replays the number animation on every page change */}
        <span key={page} className={styles['pagination__current']}>
          {page}
        </span>
        <span className={styles['pagination__total']}>/ {Math.max(totalPages, 1)}</span>
      </p>

      <button
        type="button"
        className={styles['pagination__button']}
        disabled={isLastPage}
        onClick={() => onPageChange(page + 1)}
      >
        Next
        <ChevronRight size={16} aria-hidden="true" />
      </button>
    </nav>
  );
}

export default Pagination;
