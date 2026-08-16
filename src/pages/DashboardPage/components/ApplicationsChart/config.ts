export type ApplicationPeriod = '7D' | '30D' | '3M' | '1Y';

const applicationPeriods: {
  value: ApplicationPeriod;
  label: string;
}[] = [
  {
    value: '7D',
    label: '7D',
  },
  {
    value: '30D',
    label: '30D',
  },
  {
    value: '3M',
    label: '3M',
  },
  {
    value: '1Y',
    label: '1Y',
  },
];

export { applicationPeriods };
