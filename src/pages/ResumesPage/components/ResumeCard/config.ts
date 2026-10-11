import { Eye, Pencil, Trash2 } from 'lucide-react';

const actionButtons = [
  {
    name: 'view',
    icon: Eye,
    title: 'View resume',
  },
  {
    name: 'edit',
    icon: Pencil,
    title: 'Edit resume',
  },
  {
    name: 'delete',
    icon: Trash2,
    title: 'Delete resume',
  },
] as const;

type ResumeAction = (typeof actionButtons)[number]['name'];

export { actionButtons, type ResumeAction };
