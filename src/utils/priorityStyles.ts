import { PriorityLevel } from '../types/agenda';

export const PRIORITY_OPTIONS: PriorityLevel[] = ['Baja', 'Media', 'Alta'];

export const PRIORITY_STYLES: Record<
  PriorityLevel,
  {
    label: string;
    badgeClass: string;
    dotClass: string;
    activeButtonClass: string;
  }
> = {
  Alta: {
    label: 'Prioridad Alta',
    badgeClass: 'border-rose-200 bg-rose-50 text-rose-700',
    dotClass: 'bg-rose-600',
    activeButtonClass: 'border-rose-600 bg-rose-600 text-white',
  },
  Media: {
    label: 'Prioridad Media',
    badgeClass: 'border-amber-200 bg-amber-50 text-amber-800',
    dotClass: 'bg-amber-500',
    activeButtonClass: 'border-amber-600 bg-amber-600 text-white',
  },
  Baja: {
    label: 'Prioridad Baja',
    badgeClass: 'border-emerald-200 bg-emerald-50 text-emerald-800',
    dotClass: 'bg-emerald-600',
    activeButtonClass: 'border-emerald-600 bg-emerald-600 text-white',
  },
};
