/**
 * Format a number as Finnish currency (EUR)
 * @param value - Number to format
 * @returns Formatted string like "1 234,56 €"
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('fi-FI', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value) + ' €';
}

/**
 * Format a number as Finnish decimal
 * @param value - Number to format
 * @returns Formatted string like "1 234,56"
 */
export function formatNumber(value: number): string {
  return new Intl.NumberFormat('fi-FI', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

/**
 * Format a percentage with color
 * @param value - Percentage value (e.g., 5.2 for +5.2%)
 * @returns Object with formatted text and color class
 */
export function formatPercentage(value: number): { text: string; colorClass: string } {
  const sign = value >= 0 ? '+' : '';
  const text = `${sign}${formatNumber(value)}%`;
  const colorClass = value >= 0 ? 'text-green-500' : 'text-red-500';
  
  return { text, colorClass };
}

/**
 * Format a change value with sign and color
 * @param value - Change value in EUR
 * @returns Object with formatted text and color class
 */
export function formatChange(value: number): { text: string; colorClass: string } {
  const sign = value >= 0 ? '+' : '';
  const text = `${sign}${formatCurrency(value)}`;
  const colorClass = value >= 0 ? 'text-green-500' : 'text-red-500';
  
  return { text, colorClass };
}

/**
 * Format a timestamp as Finnish date and time
 * @param timestamp - Unix timestamp in milliseconds
 * @returns Formatted string like "14.2.2026 14:00"
 */
export function formatTimestamp(timestamp: number): string {
  return new Intl.DateTimeFormat('fi-FI', {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(timestamp));
}
