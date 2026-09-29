/**
 * Formats an ISO string or date string to readable format e.g. "Oct 15, 2026"
 */
export function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return 'No due date';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

/**
 * Checks if a date string is in the past (overdue)
 */
export function isOverdue(dateStr: string | null | undefined): boolean {
  if (!dateStr) return false;
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return false;
    const now = new Date();
    // Normalize to midnight
    now.setHours(0, 0, 0, 0);
    return d < now;
  } catch {
    return false;
  }
}

/**
 * Returns today's date formatted as YYYY-MM-DD
 */
export function getTodayString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Returns a future date string (+N days) formatted as YYYY-MM-DD
 */
export function getFutureDateString(daysAhead: number): string {
  const d = new Date();
  d.setDate(d.getDate() + daysAhead);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
