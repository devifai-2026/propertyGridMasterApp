/**
 * Safe date helpers.
 *
 * The backend sometimes returns null/undefined/empty dates. Passing those to
 * `new Date()` yields either an "Invalid Date" or, for `new Date(0)` / `null`
 * coerced to 0, the Unix epoch (01/01/1970). Both look broken in the UI, so
 * these helpers guard against missing / epoch / invalid values and fall back
 * to 'N/A'.
 */

const isUsableDate = (d: Date): boolean => {
  if (isNaN(d.getTime())) return false;
  // Treat the Unix epoch (or anything before 1971) as "no real date".
  if (d.getTime() <= 0) return false;
  if (d.getUTCFullYear() <= 1970) return false;
  return true;
};

/**
 * Parse a value into a usable Date, or return null if it is missing / epoch /
 * invalid. Accepts ISO strings, dd/mm/yyyy strings, timestamps and Date objects.
 */
export const parseDate = (
  value: string | number | Date | null | undefined,
): Date | null => {
  if (value === null || value === undefined || value === '') return null;

  let d: Date;
  if (value instanceof Date) {
    d = value;
  } else if (typeof value === 'string' && value.includes('/')) {
    // dd/mm/yyyy
    const parts = value.split('/');
    if (parts.length === 3) {
      const [dd, mm, yyyy] = parts;
      d = new Date(Number(yyyy), Number(mm) - 1, Number(dd));
    } else {
      d = new Date(value);
    }
  } else {
    d = new Date(value);
  }

  return isUsableDate(d) ? d : null;
};

/**
 * Format a date for display (e.g. "15 Jul 2026"). Falls back to 'N/A' when the
 * value is missing / epoch / invalid.
 *
 *   formatDate('2026-07-15T00:00:00Z') => "15 Jul 2026"
 *   formatDate(null)                    => "N/A"
 *   formatDate(0)                       => "N/A"  (no more 01/01/1970)
 */
export const formatDate = (
  value: string | number | Date | null | undefined,
  fallback = 'N/A',
): string => {
  const d = parseDate(value);
  if (!d) return fallback;
  return d.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

/**
 * Format a date + time for display (e.g. "15 Jul 2026, 04:30 PM"). Falls back
 * to 'N/A' when the value is missing / epoch / invalid.
 */
export const formatDateTime = (
  value: string | number | Date | null | undefined,
  fallback = 'N/A',
): string => {
  const d = parseDate(value);
  if (!d) return fallback;
  const datePart = d.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
  const timePart = d.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
  return `${datePart}, ${timePart}`;
};

/**
 * Render a "years left" label for a lease tenure.
 *
 * Prefers an explicit number of years (tenureLeftYears). If only an end date is
 * available, computes the number of whole/decimal years from now. Falls back to
 * 'N/A' when nothing usable is provided.
 *
 *   formatTenureYears(15)                       => "15 Yrs"
 *   formatTenureYears(2.5)                      => "2.5 Yrs"
 *   formatTenureYears(null, '2026-07-15')       => "<years-from-now> Yrs"
 *   formatTenureYears(null, null)               => "N/A"
 */
export const formatTenureYears = (
  years: number | string | null | undefined,
  endDate?: string | number | Date | null,
  fallback = 'N/A',
): string => {
  let value: number | null = null;

  if (years !== null && years !== undefined && years !== '') {
    const n = typeof years === 'string' ? parseFloat(years) : years;
    if (isFinite(n) && !isNaN(n)) value = n;
  }

  // Derive from an end date if no explicit year count was given.
  if (value === null && endDate) {
    const end = parseDate(endDate);
    if (end) {
      const diffMs = end.getTime() - Date.now();
      const yrs = diffMs / (365.25 * 24 * 60 * 60 * 1000);
      value = yrs > 0 ? yrs : 0;
    }
  }

  if (value === null) return fallback;
  if (value <= 0) return '0 Yrs';

  // Strip trailing zeros: 15.0 -> "15", 2.50 -> "2.5".
  const display = parseFloat(value.toFixed(1)).toString();
  return `${display} Yrs`;
};
