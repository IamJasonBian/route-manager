const DATE_FMT = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' });
const DATE_FMT_LONG = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

export function formatDate(iso?: string, opts?: { long?: boolean }): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return (opts?.long ? DATE_FMT_LONG : DATE_FMT).format(d);
}

export function formatDateRange(depart?: string, ret?: string): string {
  if (!depart) return '';
  return ret ? `${formatDate(depart)} → ${formatDate(ret)}` : formatDate(depart);
}

export function formatPrice(amount?: number | null, currency = 'USD'): string {
  if (amount == null) return '';
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `$${amount}`;
  }
}

export function normalizeIata(input: string): string {
  return input.trim().toUpperCase().slice(0, 3);
}
