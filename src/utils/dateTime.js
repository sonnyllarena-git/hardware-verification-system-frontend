// Supabase's TIMESTAMP (no time zone) columns are written via NOW() under Supabase's
// UTC-default session and serialized without a 'Z'/offset (e.g. "2026-09-03T15:03:00").
// The browser's Date constructor treats an offset-less date-time string as LOCAL time per
// spec, not UTC — silently shifting every value by the viewer's own timezone offset. Every
// timestamp read from the API needs this before it's safe to format or compare.
export function parseDbTimestamp(value) {
  if (!value) return null;
  const hasOffset = /Z$|[+-]\d{2}:?\d{2}$/.test(value);
  const date = new Date(hasOffset ? value : `${value}Z`);
  return Number.isNaN(date.getTime()) ? null : date;
}
