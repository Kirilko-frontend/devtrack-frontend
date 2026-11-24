import { Columns3, Rows3 } from 'lucide-react';
import clsx from 'clsx';

import styles from './styles.module.scss';

type VacancyView = 'table' | 'board';

interface IProps {
  view: VacancyView;
  onViewChange: (view: VacancyView) => void;
}

const views = [
  { value: 'table', label: 'Table', icon: Rows3 },
  { value: 'board', label: 'Board', icon: Columns3 },
] as const;

/** Segmented switch between the table and the kanban board, with a sliding thumb. */
function ViewToggle({ view, onViewChange }: IProps) {
  return (
    <div
      className={clsx(styles['view-toggle'], view === 'board' && styles['view-toggle--board'])}
      role="group"
      aria-label="Vacancies view"
    >
      <span className={styles['view-toggle__thumb']} aria-hidden="true" />

      {views.map(({ value, label, icon: Icon }) => (
        <button
          key={value}
          className={clsx(
            styles['view-toggle__button'],
            view === value && styles['view-toggle__button--active']
          )}
          type="button"
          aria-pressed={view === value}
          onClick={() => onViewChange(value)}
        >
          <Icon size={14} aria-hidden="true" />
          {label}
        </button>
      ))}
    </div>
  );
}

export default ViewToggle;
export type { VacancyView };
