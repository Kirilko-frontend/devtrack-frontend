const interviewStats = [
  {
    key: 'upcoming',
    label: 'Upcoming',
  },
  {
    key: 'thisWeek',
    label: 'This week',
  },
  {
    key: 'technical',
    label: 'Technical',
  },
] as const;

type InterviewStatKey = (typeof interviewStats)[number]['key'];

export { interviewStats };
export type { InterviewStatKey };
