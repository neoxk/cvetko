const MS_PER_DAY = 24 * 60 * 60 * 1000;

const pad = (value: number): string => value.toString().padStart(2, '0');

export const formatDateOnly = (date: Date): string =>
  `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())}`;

export const parseDateOnly = (value: string): Date | null => {
  const [year, month, day] = value.split('-').map((part) => Number(part));
  if (!year || !month || !day) {
    return null;
  }
  const date = new Date(Date.UTC(year, month - 1, day));
  if (Number.isNaN(date.getTime())) {
    return null;
  }
  return date;
};

export const addDaysUtc = (date: Date, days: number): Date =>
  new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() + days));

export const daysBetweenUtc = (start: Date, end: Date): number =>
  Math.floor((end.getTime() - start.getTime()) / MS_PER_DAY);

export const daysInMonthUtc = (year: number, monthIndex: number): number =>
  new Date(Date.UTC(year, monthIndex + 1, 0)).getUTCDate();

export const getTodayUtc = (): Date => {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
};

export const isWithinRange = (value: Date, start: Date, end: Date): boolean =>
  value.getTime() >= start.getTime() && value.getTime() <= end.getTime();
