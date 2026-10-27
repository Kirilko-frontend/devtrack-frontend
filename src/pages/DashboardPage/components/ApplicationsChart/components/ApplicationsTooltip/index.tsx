import type { ValueType, NameType } from 'recharts/types/component/DefaultTooltipContent';
import type { TooltipContentProps } from 'recharts';

import styles from './styles.module.scss';

type IProps = TooltipContentProps<ValueType, NameType>;

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
};

function ApplicationsTooltip({ active, payload, label }: IProps) {
  if (!active || !payload?.length) {
    return null;
  }

  return (
    <div className={styles['tooltip']}>
      <p className={styles['tooltip__date']}>{formatDate(String(label))}</p>

      <div className={styles['tooltip__value']}>
        <span className={styles['tooltip__dot']} />

        <span>
          Applications: <strong>{payload[0].value}</strong>
        </span>
      </div>
    </div>
  );
}

export default ApplicationsTooltip;
