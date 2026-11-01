import { createElement } from 'react';
import { Trash2 } from 'lucide-react';
import { toast, type ExternalToast } from 'sonner';

import styles from '@/app/styles.module.scss';

function withClass(className: string, options: ExternalToast = {}) {
  const { classNames, ...rest } = options;

  return {
    ...rest,
    classNames: {
      ...classNames,
      toast: className,
    },
  };
}

const notify = {
  created: (message: string, description?: string) =>
    toast.success(
      message,
      withClass(styles['created'], {
        description,
        style: {
          backgroundColor: 'var(--notification-created-bg)',
          borderColor: 'var(--notification-created-border)',
          color: 'var(--notification-created-text)',
        },
      }),
    ),
  deleted: (message: string, description?: string) =>
    toast(
      message,
      withClass(styles['deleted'], {
        description,
        icon: createElement(Trash2, {
          size: 16,
          'aria-hidden': true,
          style: { color: 'var(--notification-deleted-border)' },
        }),
        style: {
          backgroundColor: 'var(--notification-deleted-bg)',
          borderColor: 'var(--notification-deleted-border)',
          color: 'var(--notification-deleted-text)',
        },
      }),
    ),
  updated: (message: string, description?: string) =>
    toast.info(
      message,
      withClass(styles['updated'], {
        description,
        style: {
          backgroundColor: 'var(--notification-updated-bg)',
          borderColor: 'var(--notification-updated-border)',
          borderLeft: '0.25rem solid var(--notification-updated-accent)',
          color: 'var(--notification-updated-text)',
        },
      }),
    ),
  error: (message: string, description?: string) =>
    toast.error(
      message,
      withClass(styles['error'], {
        description,
        style: {
          backgroundColor: 'var(--notification-error-bg)',
          borderColor: 'var(--notification-error-border)',
          color: 'var(--notification-error-text)',
        },
      }),
    ),
  info: (message: string, description?: string) =>
    toast.info(
      message,
      withClass(styles['info'], {
        description,
        style: {
          backgroundColor: 'var(--notification-info-bg)',
          borderColor: 'var(--notification-info-border)',
          color: 'var(--notification-info-text)',
        },
      }),
    ),
};

export default notify;
