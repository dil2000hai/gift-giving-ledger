export const MONTHS_SHORT = [
  'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN',
  'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC',
];

export const MONTHS_LONG = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export const initial = (name: string) =>
  name.trim().length > 0 ? name.trim().charAt(0).toUpperCase() : '?';

export const shortDate = (month: number, day: number) =>
  day + ' ' + (MONTHS_SHORT[month] ?? 'JAN');

export const todayLabel = () => {
  const d = new Date();
  return shortDate(d.getMonth(), d.getDate());
};

/** Days until the next occurrence of month/day, counted from today. */
export function daysUntil(month: number, day: number): number {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  let target = new Date(now.getFullYear(), month, day);
  if (target.getTime() < today.getTime()) {
    target = new Date(now.getFullYear() + 1, month, day);
  }
  return Math.round((target.getTime() - today.getTime()) / 86400000);
}

export function countdownLabel(month: number, day: number): string {
  const n = daysUntil(month, day);
  if (n === 0) {
    return 'TODAY';
  }
  if (n === 1) {
    return 'TOMORROW';
  }
  return 'IN ' + n + ' DAYS';
}

export const pluralise = (n: number, one: string, many: string) =>
  n + ' ' + (n === 1 ? one : many);
