const SHORT_DAYS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const FULL_DAYS = [
  'Domingo',
  'Lunes',
  'Martes',
  'Miércoles',
  'Jueves',
  'Viernes',
  'Sábado',
];
const SHORT_MONTHS = [
  'ene',
  'feb',
  'mar',
  'abr',
  'may',
  'jun',
  'jul',
  'ago',
  'sep',
  'oct',
  'nov',
  'dic',
];

export function parseIsoDate(isoDate: string): Date {
  const [year, month, day] = isoDate.split('-').map(Number);
  return new Date(year, (month || 1) - 1, day || 1);
}

export function toIsoDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function formatReadableDate(isoDate: string, todayIso?: string): string {
  if (!isoDate) return '';
  if (todayIso) {
    if (isoDate === todayIso) return 'Hoy';
    const today = parseIsoDate(todayIso);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    if (isoDate === toIsoDate(tomorrow)) return 'Mañana';
  }
  const date = parseIsoDate(isoDate);
  const dayName = SHORT_DAYS[date.getDay()];
  const dayNum = date.getDate();
  const monthName = SHORT_MONTHS[date.getMonth()];
  return `${dayName} ${dayNum} ${monthName}`;
}

export function formatFullSpanishDate(isoDate: string): string {
  const date = parseIsoDate(isoDate);
  const dayName = FULL_DAYS[date.getDay()];
  const dayNum = date.getDate();
  const monthName = SHORT_MONTHS[date.getMonth()];
  return `${dayName} ${dayNum} ${monthName}`;
}

export function getWeekDates(anchorIso: string): Array<{
  iso: string;
  shortDay: string;
  dayNumber: number;
  monthLabel: string;
}> {
  const anchor = parseIsoDate(anchorIso);
  const dayOfWeek = anchor.getDay(); // 0 Sun .. 6 Sat
  const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const monday = new Date(anchor);
  monday.setDate(anchor.getDate() + diffToMonday);

  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return {
      iso: toIsoDate(d),
      shortDay: SHORT_DAYS[d.getDay()],
      dayNumber: d.getDate(),
      monthLabel: SHORT_MONTHS[d.getMonth()],
    };
  });
}

export function shiftDateByDays(isoDate: string, days: number): string {
  const d = parseIsoDate(isoDate);
  d.setDate(d.getDate() + days);
  return toIsoDate(d);
}
