import { useEffect, useMemo, useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import clsx from 'clsx';

import type { Interview } from '@/types/interviews';
import { interviewTypeLabels } from '@/shared/constants/interviews';
import { formatTime, handleSpotlightMove } from '@/shared/utils';
import {
  formatTimeUntil,
  groupInterviewsForAgenda,
  toDayKey,
  type AgendaSection,
} from '@/shared/utils/interviews';

import { AGENDA_TICK_MS } from './config';

import styles from './styles.module.scss';

interface IProps {
  interviews: Interview[];
  /** Unfiltered list: "Next up" must stay the real next interview whatever the filters are. */
  allInterviews: Interview[];
  onEdit: (interview: Interview) => void;
  onDelete: (interview: Interview) => void;
}

// Today / Tomorrow get the date next to the title, the rest show it per day.
const getSectionHint = (section: AgendaSection) => {
  if (section.kind !== 'TODAY' && section.kind !== 'TOMORROW') {
    return null;
  }

  return section.days[0]?.date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });
};

/** Interviews as an agenda: sections (Today, Tomorrow, This week…) split into days. */
function InterviewsAgenda({ interviews, allInterviews, onEdit, onDelete }: IProps) {
  // Ticks every minute: keeps "in 25 min", the past dimming and day sections fresh.
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), AGENDA_TICK_MS);
    return () => window.clearInterval(timer);
  }, []);

  const sections = useMemo(() => groupInterviewsForAgenda(interviews, now), [interviews, now]);

  const nextUp = useMemo(
    () =>
      allInterviews
        .filter((interview) => new Date(interview.date) >= now)
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0] ?? null,
    [allInterviews, now]
  );

  const todayKey = toDayKey(now);

  return (
    <div className={styles['agenda']}>
      {sections.map((section, sectionIndex) => {
        const hint = getSectionHint(section);

        return (
          <section
            key={section.key}
            className={clsx(
              styles['agenda__section'],
              section.kind === 'PAST' && styles['agenda__section--past']
            )}
            style={{ animationDelay: `${Math.min(sectionIndex, 5) * 70}ms` }}
            aria-labelledby={`agenda-${section.key}`}
          >
            <header className={styles['agenda__section-header']}>
              <h2 id={`agenda-${section.key}`} className={styles['agenda__section-title']}>
                {section.title}
              </h2>
              {hint && <span className={styles['agenda__section-hint']}>{hint}</span>}
              <span className={styles['agenda__section-count']}>{section.count}</span>
            </header>

            <div className={styles['agenda__days']}>
              {section.days.map((day) => (
                <div key={day.key} className={styles['agenda__day']}>
                  <div
                    className={clsx(
                      styles['agenda__day-label'],
                      day.key === todayKey && styles['agenda__day-label--today']
                    )}
                  >
                    <span className={styles['agenda__day-weekday']}>
                      {day.date.toLocaleDateString('en-US', { weekday: 'short' })}
                    </span>
                    <strong className={styles['agenda__day-number']}>{day.date.getDate()}</strong>
                    <span className={styles['agenda__day-month']}>
                      {day.date.toLocaleDateString('en-US', { month: 'short' })}
                    </span>
                  </div>

                  <ul className={styles['agenda__items']}>
                    {day.interviews.map((interview) => {
                      const date = new Date(interview.date);
                      const isPast = date < now;
                      const isNext = nextUp?.id === interview.id;

                      return (
                        <li
                          key={interview.id}
                          className={clsx(
                            styles['agenda__item'],
                            styles[`agenda__item--${interview.types.toLowerCase()}`],
                            isPast && styles['agenda__item--past'],
                            isNext && styles['agenda__item--next']
                          )}
                          onPointerMove={handleSpotlightMove}
                        >
                          <time className={styles['agenda__item-time']} dateTime={interview.date}>
                            {formatTime(date)}
                          </time>

                          <div className={styles['agenda__item-body']}>
                            <div className={styles['agenda__item-top']}>
                              <span className={styles['agenda__item-type']}>
                                {interviewTypeLabels[interview.types]}
                              </span>

                              {isNext && (
                                <span className={styles['agenda__item-next']}>
                                  <span
                                    className={styles['agenda__item-next-dot']}
                                    aria-hidden="true"
                                  />
                                  Next up · {formatTimeUntil(date, now)}
                                </span>
                              )}

                              <div className={styles['agenda__item-actions']}>
                                <button
                                  className={styles['agenda__item-button']}
                                  type="button"
                                  aria-label={`Edit interview for ${interview.vacancy.title}`}
                                  title="Edit interview"
                                  onClick={() => onEdit(interview)}
                                >
                                  <Pencil size={14} />
                                </button>
                                <button
                                  className={clsx(
                                    styles['agenda__item-button'],
                                    styles['agenda__item-button--danger']
                                  )}
                                  type="button"
                                  aria-label={`Delete interview for ${interview.vacancy.title}`}
                                  title="Delete interview"
                                  onClick={() => onDelete(interview)}
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </div>

                            <h3 className={styles['agenda__item-title']}>
                              {interview.vacancy.title}
                            </h3>
                            <p className={styles['agenda__item-company']}>
                              {interview.vacancy.company.name}
                            </p>

                            {interview.notes && (
                              <p className={styles['agenda__item-notes']}>{interview.notes}</p>
                            )}
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}

export default InterviewsAgenda;
