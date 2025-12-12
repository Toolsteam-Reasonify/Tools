import i18n from '@/i18n';

/**
 * Format a number according to the current locale
 */
export const formatNumber = (value: number, options?: Intl.NumberFormatOptions): string => {
  const locale = i18n.language || 'en';
  return new Intl.NumberFormat(locale, options).format(value);
};

/**
 * Format a date according to the current locale
 */
export const formatDate = (date: Date | number | string, options?: Intl.DateTimeFormatOptions): string => {
  const locale = i18n.language || 'en';
  const dateObj = typeof date === 'string' ? new Date(date) : typeof date === 'number' ? new Date(date) : date;
  return new Intl.DateTimeFormat(locale, options).format(dateObj);
};

/**
 * Format currency according to the current locale
 */
export const formatCurrency = (value: number, currency: string = 'INR', options?: Intl.NumberFormatOptions): string => {
  const locale = i18n.language || 'en';
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    ...options,
  }).format(value);
};

/**
 * Format percentage
 */
export const formatPercentage = (value: number, options?: Intl.NumberFormatOptions): string => {
  const locale = i18n.language || 'en';
  return new Intl.NumberFormat(locale, {
    style: 'percent',
    ...options,
  }).format(value / 100);
};

