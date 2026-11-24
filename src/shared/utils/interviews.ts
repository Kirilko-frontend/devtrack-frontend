import type { Interview } from '@/types/interviews';
import type { InterviewStatKey } from '@/pages/InterviewsPage/components/InterviewsStats/config';

export const getInterviewStats = (interviews: Interview[]): Record<InterviewStatKey, number> => {
  const now = new Date();

  const day = now.getDay();
  const diffToMonday = day === 0 ? -6 : 1 - day;

  const weekStart = new Date(now);
  weekStart.setHours(0, 0, 0, 0);
  weekStart.setDate(now.getDate() + diffToMonday);

  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 7);

  let upcoming = 0;
  let thisWeek = 0;
  let technical = 0;

  interviews.forEach((interview) => {
    const date = new Date(interview.date);

    if (date >= now) {
      upcoming++;
    }

    if (date >= weekStart && date < weekEnd) {
      thisWeek++;
    }

    if (interview.types === 'TECHNICAL') {
      technical++;
    }
  });

  return {
    upcoming,
    thisWeek,
    technical,
  };
};

// ---------- agenda ----------

type AgendaSectionKind = 'TODAY' | 'TOMORROW' | 'THIS_WEEK' | 'NEXT_WEEK' | 'LATER' | 'PAST';

interface AgendaDay {
  /** Local yyyy-mm-dd, stable across re-renders. */
  key: string;
  date: Date;
  interviews: Interview[];
}

interface AgendaSection {
  key: string;
  kind: AgendaSectionKind;
  title: string;
  days: AgendaDay[];
  count: number;
}

const DAY_MS = 24 * 60 * 60 * 1000;

const startOfDay = (date: Date) => {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
};

const addDays = (date: Date, days: number) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

/** Monday of the week that contains `date`. */
const startOfWeek = (date: Date) => {
  const day = date.getDay();
  return addDays(startOfDay(date), day === 0 ? -6 : 1 - day);
};

/** Local date key: toISOString() would shift late-evening interviews to the next day in UTC. */
const toDayKey = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(
    date.getDate()
  ).padStart(2, '0')}`;

const isSameDay = (a: Date, b: Date) => toDayKey(a) === toDayKey(b);

/**
 * Splits interviews into agenda sections: Today, Tomorrow, This week, Next week,
 * one section per later month, and Past at the end (most recent first).
 * Inside every section interviews are grouped by day.
 */
const groupInterviewsForAgenda = (
  interviews: Interview[],
  now: Date = new Date()
): AgendaSection[] => {
  const today = startOfDay(now);
  const tomorrow = addDays(today, 1);
  const dayAfterTomorrow = addDays(today, 2);
  const nextWeekStart = addDays(startOfWeek(now), 7);
  const nextWeekEnd = addDays(nextWeekStart, 7);

  const sections = new Map<string, AgendaSection>();

  const getSection = (key: string, kind: AgendaSectionKind, title: string) => {
    let section = sections.get(key);

    if (!section) {
      section = { key, kind, title, days: [], count: 0 };
      sections.set(key, section);
    }

    return section;
  };

  const sorted = [...interviews].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  sorted.forEach((interview) => {
    const date = new Date(interview.date);
    let section: AgendaSection;

    if (date < today) {
      section = getSection('PAST', 'PAST', 'Past');
    } else if (date < tomorrow) {
      section = getSection('TODAY', 'TODAY', 'Today');
    } else if (date < dayAfterTomorrow) {
      section = getSection('TOMORROW', 'TOMORROW', 'Tomorrow');
    } else if (date < nextWeekStart) {
      section = getSection('THIS_WEEK', 'THIS_WEEK', 'This week');
    } else if (date < nextWeekEnd) {
      section = getSection('NEXT_WEEK', 'NEXT_WEEK', 'Next week');
    } else {
      const sameYear = date.getFullYear() === now.getFullYear();
      const title = date.toLocaleDateString('en-US', {
        month: 'long',
        ...(sameYear ? {} : { year: 'numeric' }),
      });

      section = getSection(`LATER-${date.getFullYear()}-${date.getMonth()}`, 'LATER', title);
    }

    const dayKey = toDayKey(date);
    let day = section.days.find((item) => item.key === dayKey);

    if (!day) {
      day = { key: dayKey, date: startOfDay(date), interviews: [] };
      section.days.push(day);
    }

    day.interviews.push(interview);
    section.count++;
  });

  const past = sections.get('PAST');
  sections.delete('PAST');

  // Map keeps insertion order, and interviews were inserted chronologically,
  // so upcoming sections are already in the right order.
  const result = [...sections.values()];

  if (past) {
    past.days.reverse();
    result.push(past);
  }

  return result;
};

/** "in 25 min", "in 3h 10m", "in 2 days" — for the next upcoming interview. */
const formatTimeUntil = (date: Date, now: Date = new Date()) => {
  const diff = date.getTime() - now.getTime();

  if (diff <= 0) {
    return 'now';
  }

  const minutes = Math.round(diff / 60000);

  if (minutes < 60) {
    return `in ${Math.max(minutes, 1)} min`;
  }

  if (diff < DAY_MS) {
    const hours = Math.floor(minutes / 60);
    const rest = minutes % 60;
    return rest ? `in ${hours}h ${rest}m` : `in ${hours}h`;
  }

  const days = Math.round((startOfDay(date).getTime() - startOfDay(now).getTime()) / DAY_MS);
  return `in ${days} ${days === 1 ? 'day' : 'days'}`;
};

export {
  groupInterviewsForAgenda,
  formatTimeUntil,
  startOfDay,
  addDays,
  startOfWeek,
  toDayKey,
  isSameDay,
};
export type { AgendaSection, AgendaDay, AgendaSectionKind };
