import { createElement } from 'react';
import { toast } from 'sonner';

import Toast, { type ToastType } from '@/shared/ui/Toast';

// Toasts are our own component (shared/ui/Toast) rendered through toast.custom().
// sonner only positions and animates them; the Toast itself owns the timer
// (progress line) and dismisses itself, so sonner's own timer is turned off.
const show = (type: ToastType, title: string, description?: string) =>
  toast.custom((id) => createElement(Toast, { id, type, title, description }), {
    duration: Infinity,
  });

const notify = {
  created: (message: string, description?: string) => show('created', message, description),
  updated: (message: string, description?: string) => show('updated', message, description),
  deleted: (message: string, description?: string) => show('deleted', message, description),
  error: (message: string, description?: string) => show('error', message, description),
  info: (message: string, description?: string) => show('info', message, description),
};

export default notify;
