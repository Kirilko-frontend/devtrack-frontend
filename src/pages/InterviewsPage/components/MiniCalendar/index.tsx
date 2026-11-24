import { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import clsx from 'clsx';

import type { Interview, InterviewType } from '@/types/interviews';
import { interviewTypeLabels, interviewTypes } from '@/shared/constants/interviews';
import { addDays, startOfWeek, toDayKey } from '@/shared/utils/interviews';

import { GRID_DAYS, MAX_DOTS, WEEKDAYS } from './config';

import styles from './styles.module.scss';

interface IProps {
  interviews: Interview[];
  /** Selected day as a local yyyy-mm-dd key, or null for "all days". */
  selectedDay: string | null;
  onSelectDay: (day: string | null) => void;
}

const startOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1);

const parseDayKey = (key: string) => {
  const [year, month, day] = key.split('-').map(Number);
  return new Date(year, month - 1, day);
};

/** Month grid with a dot per interview on each day; clicking a day filters the agenda. */
function MiniCalendar({ interviews, selectedDay, onSelectDay }: IProps) {
  const todayKey = toDayKey(new Date());

  const [month, setMonth] = useState(() =>
    startOfMonth(selectedDay ? parseDayKey(selectedDay) : new Date())
  );
  // Direction of the last month switch: the grid slides in from that side.
  const [direction, setDirection] = useState<'prev' | 'next'>('next');

  const typesByDay = useMemo(() => {
    const map = new Map<string, InterviewType[]>();

    interviews.forEach((interview) => {
      const key = toDayKey(new Date(interview.date));
      map.set(key, [...(map.get(key) ?? []), interview.types]);
    });

    return map;
  }, [interviews]);

  const days = useMemo(() => {
    const first = startOfWeek(month);
    return Array.from({ length: GRID_DAYS }, (_, index) => addDays(first, index));
  }, [month]);

  const changeMonth = (offset: number) => {
    setDirection(offset > 0 ? 'next' : 'prev');
    setMonth((current) => new Date(current.getFullYear(), current.getMonth() + offset, 1));
  };

  const goToToday = () => {
    const today = new Date();
    setDirection(today < month ? 'prev' : 'next');
    setMonth(startOfMonth(today));
    onSelectDay(toDayKey(today));
  };

  const handleSelect = (date: Date) => {
    const key = toDayKey(date);

    // A day from the neighbouring month also flips the calendar to that month.
    if (date.getMonth() !== month.getMonth()) {
      setDirection(date < month ? 'prev' : 'next');
      setMonth(startOfMonth(date));
    }

    onSelectDay(selectedDay === key ? null : key);
  };

  const monthLabel = month.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <section className={styles['mini-calendar']} aria-label="Interview calendar">
      <header className={styles['mini-calendar__header']}>
        <h2 className={styles['mini-calendar__title']} aria-live="polite">
          {monthLabel}
        </h2>

        <div className={styles['mini-calendar__nav']}>
          <button
            className={styles['mini-calendar__today']}
            type="button"
            onClick={goToToday}
          >
            Today
          </button>
          <button
            className={styles['mini-calendar__arrow']}
            type="button"
            aria-label="Previous month"
            onClick={() => changeMonth(-1)}
          >
            <ChevronLeft size={16} />
          </button>
          <button
            className={styles['mini-calendar__arrow']}
            type="button"
            aria-label="Next month"
            onClick={() => changeMonth(1)}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </header>

      <div className={styles['mini-calendar__weekdays']} aria-hidden="true">
        {WEEKDAYS.map((weekday) => (
          <span key={weekday}>{weekday}</span>
        ))}
      </div>

      {/* key re-mounts the grid on month change, which replays the slide animation. */}
      <div
        key={toDayKey(month)}
        className={clsx(
          styles['mini-calendar__grid'],
          styles[`mini-calendar__grid--${direction}`]
        )}
      >
        {days.map((date) => {
          const key = toDayKey(date);
          const types = typesByDay.get(key) ?? [];
          const isOutside = date.getMonth() !== month.getMonth();
          const fullDate = date.toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
          });

          return (
            <button
              key={key}
              className={clsx(
                styles['mini-calendar__day'],
                isOutside && styles['mini-calendar__day--outside'],
                key === todayKey && styles['mini-calendar__day--today'],
                key === selectedDay && styles['mini-calendar__day--selected'],
                types.length > 0 && styles['mini-calendar__day--busy']
              )}
              type="button"
              aria-pressed={key === selectedDay}
              aria-label={`${fullDate}${
                types.length
                  ? `, ${types.length} ${types.length === 1 ? 'interview' : 'interviews'}`
                  : ''
              }`}
              onClick={() => handleSelect(date)}
            >
              {date.getDate()}

              {types.length > 0 && (
                <span className={styles['mini-calendar__dots']} aria-hidden="true">
                  {types.slice(0, MAX_DOTS).map((type, index) => (
                    <span
                      key={index}
                      className={clsx(
                        styles['mini-calendar__dot'],
                        styles[`mini-calendar__dot--${type.toLowerCase()}`]
                      )}
                    />
                  ))}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <ul className={styles['mini-calendar__legend']} aria-label="Interview types">
        {interviewTypes.map((type) => (
          <li key={type} className={styles['mini-calendar__legend-item']}>
            <span
              className={clsx(
                styles['mini-calendar__dot'],
                styles[`mini-calendar__dot--${type.toLowerCase()}`]
              )}
              aria-hidden="true"
            />
            {interviewTypeLabels[type]}
          </li>
        ))}
      </ul>
    </section>
  );
}

export default MiniCalendar;
