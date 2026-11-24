import type { InterviewType } from '@/types/interviews';

const interviewTypes = ['PHONE', 'HR', 'TECHNICAL', 'FINAL'] as const satisfies readonly InterviewType[];

const interviewTypeLabels: Record<InterviewType, string> = {
  PHONE: 'Phone',
  HR: 'HR',
  TECHNICAL: 'Technical',
  FINAL: 'Final',
};

export { interviewTypes, interviewTypeLabels };
