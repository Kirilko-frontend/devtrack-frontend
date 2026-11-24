import type { DashboardFunnel } from '@/types/dashboard';

type FunnelStageKey = Exclude<keyof DashboardFunnel, 'rejected'>;

// Stages top to bottom; `tone` picks the status color (same colors as StatusBadge).
const funnelStages: {
  key: FunnelStageKey;
  label: string;
  tone: 'saved' | 'applied' | 'interviewing' | 'offered';
}[] = [
  { key: 'tracked', label: 'Tracked', tone: 'saved' },
  { key: 'applied', label: 'Applied', tone: 'applied' },
  { key: 'interviewing', label: 'Interviewing', tone: 'interviewing' },
  { key: 'offered', label: 'Offered', tone: 'offered' },
];

// Bars delay one after another on mount.
const BAR_STAGGER_MS = 90;

// A non-empty stage never gets a thinner bar than this, so it stays visible.
const MIN_BAR_PERCENT = 3;

export { funnelStages, BAR_STAGGER_MS, MIN_BAR_PERCENT };
export type { FunnelStageKey };
