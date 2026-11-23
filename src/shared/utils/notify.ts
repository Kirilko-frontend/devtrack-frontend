import { createElement } from 'react';
import { CircleAlert, CircleCheck, Info, Pencil, Trash2 } from 'lucide-react';
import { toast, type ExternalToast } from 'sonner';

import styles from '@/app/styles.module.scss';

// Colors live in app/styles.module.scss: each type class sets --toast-color.
function withType(
  className: string,
  icon: typeof CircleCheck,
  description?: string
): ExternalToast {
  return {
    description,
    icon: createElement(icon, { size: 16, 'aria-hidden': true }),
    classNames: {
      toast: className,
    },
  };
}

const notify = {
  created: (message: string, description?: string) =>
    toast.success(message, withType(styles['created'], CircleCheck, description)),
  deleted: (message: string, description?: string) =>
    toast(message, withType(styles['deleted'], Trash2, description)),
  updated: (message: string, description?: string) =>
    toast.info(message, withType(styles['updated'], Pencil, description)),
  error: (message: string, description?: string) =>
    toast.error(message, withType(styles['error'], CircleAlert, description)),
  info: (message: string, description?: string) =>
    toast.info(message, withType(styles['info'], Info, description)),
};

export default notify;
