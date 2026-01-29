/**
 * Format a number as currency (EUR)
 * @param amount - The numeric amount to format
 * @returns Formatted currency string with EUR symbol
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-EU', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Parse a currency string to a number
 * Removes all non-numeric characters except decimal point and minus sign
 * @param value - The currency string to parse
 * @returns The numeric value, or 0 if invalid
 */
export function parseCurrency(value: string): number {
  return parseFloat(value.replace(/[^0-9.-]/g, '')) || 0;
}
