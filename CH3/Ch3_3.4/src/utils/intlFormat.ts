// Lightweight Intl formatting helpers bound to the current i18n language
// Usage:
//   import { formatDate, formatNumber, formatCurrency } from '@/utils/intlFormat';
//   const s = formatCurrency(1234.56, 'INR');

import i18n from '@/i18n';

export function formatDate(
  date: Date | number | string,
  options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  }
): string {
  const d = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
  return new Intl.DateTimeFormat(i18n.language, options).format(d);
}

export function formatNumber(
  value: number,
  options: Intl.NumberFormatOptions = {}
): string {
  return new Intl.NumberFormat(i18n.language, options).format(value);
}

export function formatCurrency(
  value: number,
  currency: string = 'INR',
  options: Intl.NumberFormatOptions = {}
): string {
  return new Intl.NumberFormat(i18n.language, { style: 'currency', currency, ...options }).format(value);
}
