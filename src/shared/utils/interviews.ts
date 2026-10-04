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
