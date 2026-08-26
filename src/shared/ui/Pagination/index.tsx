import Button from '../Button';

import styles from './styles.module.scss';

interface IProps {
  className?: string;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

function Pagination({ className, page, totalPages, onPageChange }: IProps) {
  const isFirstPage = page === 1;
  const isLastPage = page === totalPages;

  return (
    <div className={`${styles['pagination']} ${className}`}>
      <Button
        className={`${styles['pagination__button']} ${styles['pagination__button-previous']}`}
        disabled={isFirstPage}
        onClick={() => onPageChange(page - 1)}
      >
        Previous
      </Button>

      <p className={styles['pagination__text']}>
        Page {page} of {totalPages}
      </p>

      <Button
        className={`${styles['pagination__button']} ${styles['pagination__button-next']}`}
        disabled={isLastPage}
        onClick={() => onPageChange(page + 1)}
      >
        Next
      </Button>
    </div>
  );
}

export default Pagination;
