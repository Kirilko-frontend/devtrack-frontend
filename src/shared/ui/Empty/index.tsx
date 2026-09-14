import { Inbox } from 'lucide-react';
import type { ReactNode } from 'react';

import styles from './styles.module.scss';

interface IProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
}

function Empty({ title, description, icon = <Inbox />, action }: IProps) {
  return (
    <div className={styles['empty']}>
      <div className={styles['empty__icon']}>{icon}</div>

      <h2 className={styles['empty__title']}>{title}</h2>

      {description && <p className={styles['empty__description']}>{description}</p>}

      {action && <div className={styles['empty__action']}>{action}</div>}
    </div>
  );
}

export default Empty;
