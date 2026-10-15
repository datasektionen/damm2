// Same month names as moment's "sv" locale
const MONTHS = [
  'januari',
  'februari',
  'mars',
  'april',
  'maj',
  'juni',
  'juli',
  'augusti',
  'september',
  'oktober',
  'november',
  'december',
];
const MONTHS_SHORT = [
  'jan',
  'feb',
  'mar',
  'apr',
  'maj',
  'jun',
  'jul',
  'aug',
  'sep',
  'okt',
  'nov',
  'dec',
];

type DateInput = string | number | Date;

const pad = (n: number) => String(n).padStart(2, '0');

// Date-only strings are parsed as local time (like moment), not UTC
export const parseDate = (date: DateInput): Date => {
  if (typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
    const [y, m, d] = date.split('-').map(Number);
    return new Date(y, m - 1, d);
  }
  return new Date(date);
};

export const getYear = (date: DateInput) => parseDate(date).getFullYear();

// YYYY-MM-DD
export const toDateString = (date: DateInput) => {
  const d = parseDate(date);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

// DD
export const formatDay = (date: DateInput) => pad(parseDate(date).getDate());

// MMM
export const formatMonthShort = (date: DateInput) =>
  MONTHS_SHORT[parseDate(date).getMonth()];

// D MMM YYYY
export const formatShortDate = (date: DateInput) => {
  const d = parseDate(date);
  return `${d.getDate()} ${MONTHS_SHORT[d.getMonth()]} ${d.getFullYear()}`;
};

// D MMMM YYYY
export const formatLongDate = (date: DateInput) => {
  const d = parseDate(date);
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
};

// D MMMM YYYY HH:mm:ss
export const formatDateTime = (date: DateInput) => {
  const d = parseDate(date);
  return `${formatLongDate(d)} ${pad(d.getHours())}:${pad(
    d.getMinutes()
  )}:${pad(d.getSeconds())}`;
};
