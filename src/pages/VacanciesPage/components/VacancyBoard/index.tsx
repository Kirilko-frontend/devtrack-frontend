import { useEffect, useRef, useState } from 'react';
import type { DragEvent, KeyboardEvent } from 'react';
import { CalendarDays, ExternalLink, GripVertical, Pencil, Trash2 } from 'lucide-react';
import clsx from 'clsx';

import { vacancyStatuses, type Vacancy, type VacancyStatus } from '@/types/vacancy';
import { vacancyStatusOptions } from '@/shared/constants/vacancies';
import { handleSpotlightMove } from '@/shared/utils';

import styles from './styles.module.scss';

interface IProps {
  vacancies: Vacancy[];
  onEditVacancy: (vacancy: Vacancy) => void;
  onDeleteVacancy: (vacancy: Vacancy) => void;
  onStatusChange: (vacancy: Vacancy, status: VacancyStatus) => void;
}

const statusLabels = Object.fromEntries(
  vacancyStatusOptions.map(({ value, label }) => [value, label])
) as Record<VacancyStatus, string>;

/** Kanban board: one column per status, dragging a card to another column changes its status. */
function VacancyBoard({ vacancies, onEditVacancy, onDeleteVacancy, onStatusChange }: IProps) {
  const [draggedId, setDraggedId] = useState<number | null>(null);
  const [overStatus, setOverStatus] = useState<VacancyStatus | null>(null);

  const boardRef = useRef<HTMLDivElement>(null);
  // A card moved from the keyboard re-mounts in another column, so focus has to follow it.
  const pendingFocusId = useRef<number | null>(null);

  useEffect(() => {
    if (pendingFocusId.current === null) {
      return;
    }

    boardRef.current
      ?.querySelector<HTMLElement>(`[data-vacancy-id="${pendingFocusId.current}"]`)
      ?.focus();
    pendingFocusId.current = null;
  }, [vacancies]);

  const draggedVacancy = vacancies.find((vacancy) => vacancy.id === draggedId) ?? null;

  const resetDrag = () => {
    setDraggedId(null);
    setOverStatus(null);
  };

  const handleDragStart = (event: DragEvent<HTMLElement>, vacancy: Vacancy) => {
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/plain', String(vacancy.id));
    setDraggedId(vacancy.id);
  };

  const handleDragOver = (event: DragEvent<HTMLElement>, status: VacancyStatus) => {
    if (!draggedVacancy) {
      return;
    }

    // preventDefault marks the column as a valid drop target.
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';

    if (overStatus !== status) {
      setOverStatus(status);
    }
  };

  const handleDragLeave = (event: DragEvent<HTMLElement>) => {
    // dragleave also fires when moving between children of the same column.
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
      setOverStatus(null);
    }
  };

  const handleDrop = (event: DragEvent<HTMLElement>, status: VacancyStatus) => {
    event.preventDefault();

    if (draggedVacancy && draggedVacancy.status !== status) {
      onStatusChange(draggedVacancy, status);
    }

    resetDrag();
  };

  // Keyboard alternative to dragging: Shift + ←/→ moves the card to the neighbouring column
  // (Alt + arrows would trigger the browser's Back/Forward).
  const handleCardKeyDown = (event: KeyboardEvent<HTMLElement>, vacancy: Vacancy) => {
    if (event.target !== event.currentTarget) {
      return;
    }

    if (event.key === 'Enter') {
      event.preventDefault();
      onEditVacancy(vacancy);
      return;
    }

    if (!event.shiftKey || (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight')) {
      return;
    }

    event.preventDefault();

    const index = vacancyStatuses.indexOf(vacancy.status);
    const nextStatus = vacancyStatuses[index + (event.key === 'ArrowRight' ? 1 : -1)];

    if (nextStatus) {
      pendingFocusId.current = vacancy.id;
      onStatusChange(vacancy, nextStatus);
    }
  };

  return (
    <div
      ref={boardRef}
      className={clsx(styles['vacancy-board'], draggedId !== null && styles['is-dragging'])}
    >
      {vacancyStatuses.map((status, columnIndex) => {
        const columnVacancies = vacancies.filter((vacancy) => vacancy.status === status);
        const isOver = overStatus === status && draggedVacancy?.status !== status;

        return (
          <section
            key={status}
            className={clsx(
              styles['vacancy-board__column'],
              styles[`vacancy-board__column--${status.toLowerCase()}`],
              isOver && styles['vacancy-board__column--over']
            )}
            style={{ animationDelay: `${columnIndex * 60}ms` }}
            aria-label={`${statusLabels[status]}, ${columnVacancies.length} vacancies`}
            onDragOver={(event) => handleDragOver(event, status)}
            onDragLeave={handleDragLeave}
            onDrop={(event) => handleDrop(event, status)}
          >
            <header className={styles['vacancy-board__column-header']}>
              <span className={styles['vacancy-board__column-dot']} aria-hidden="true" />
              <h2 className={styles['vacancy-board__column-title']}>{statusLabels[status]}</h2>
              <span className={styles['vacancy-board__column-count']}>
                {columnVacancies.length}
              </span>
            </header>

            <ul className={styles['vacancy-board__list']}>
              {columnVacancies.map((vacancy) => (
                <li
                  key={vacancy.id}
                  className={clsx(
                    styles['vacancy-board__card'],
                    draggedId === vacancy.id && styles['vacancy-board__card--dragged']
                  )}
                  data-vacancy-id={vacancy.id}
                  draggable
                  tabIndex={0}
                  aria-keyshortcuts="Shift+ArrowLeft Shift+ArrowRight Enter"
                  aria-label={`${vacancy.title} at ${vacancy.company.name}. Shift + arrows to change status, Enter to edit.`}
                  onDragStart={(event) => handleDragStart(event, vacancy)}
                  onDragEnd={resetDrag}
                  onKeyDown={(event) => handleCardKeyDown(event, vacancy)}
                  onPointerMove={handleSpotlightMove}
                >
                  <div className={styles['vacancy-board__card-top']}>
                    <GripVertical
                      className={styles['vacancy-board__card-grip']}
                      size={14}
                      aria-hidden="true"
                    />
                    <h3 className={styles['vacancy-board__card-title']}>{vacancy.title}</h3>

                    <div className={styles['vacancy-board__card-actions']}>
                      <button
                        className={styles['vacancy-board__card-button']}
                        type="button"
                        aria-label={`Edit ${vacancy.title}`}
                        title="Edit vacancy"
                        onClick={() => onEditVacancy(vacancy)}
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        className={clsx(
                          styles['vacancy-board__card-button'],
                          styles['vacancy-board__card-button--danger']
                        )}
                        type="button"
                        aria-label={`Delete ${vacancy.title}`}
                        title="Delete vacancy"
                        onClick={() => onDeleteVacancy(vacancy)}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  <p className={styles['vacancy-board__card-company']}>{vacancy.company.name}</p>

                  {(vacancy.salary || vacancy.appliedAt || vacancy.url) && (
                    <div className={styles['vacancy-board__card-meta']}>
                      {vacancy.salary && (
                        <span className={styles['vacancy-board__card-salary']}>
                          {vacancy.salary}
                        </span>
                      )}

                      {vacancy.appliedAt && (
                        <span className={styles['vacancy-board__card-date']}>
                          <CalendarDays size={12} aria-hidden="true" />
                          {new Date(vacancy.appliedAt).toLocaleDateString()}
                        </span>
                      )}

                      {vacancy.url && (
                        <a
                          className={styles['vacancy-board__card-link']}
                          href={vacancy.url}
                          target="_blank"
                          rel="noreferrer"
                          draggable={false}
                          aria-label={`Open ${vacancy.title} posting`}
                          title="Open vacancy"
                        >
                          <ExternalLink size={13} />
                        </a>
                      )}
                    </div>
                  )}
                </li>
              ))}
            </ul>

            {columnVacancies.length === 0 && (
              <p className={styles['vacancy-board__placeholder']}>
                {draggedId !== null ? 'Drop here' : 'No vacancies'}
              </p>
            )}
          </section>
        );
      })}
    </div>
  );
}

export default VacancyBoard;
