/**
 * Formats a date string from YYYY-MM-DD to a more readable format with abbreviated month and timezone
 * @param dateString - Date in YYYY-MM-DD format
 * @returns Formatted date string (e.g., "Jun 04, 2025 UTC+8")
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString + 'T00:00:00'); // Add time to avoid timezone issues

  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  };

  const formattedDate = date.toLocaleDateString('en-US', options);
  return `${formattedDate} UTC+8`;
}
