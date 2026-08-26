// Shared date/time formatting for the Super Admin website.
//
// Root cause of the "showing as UTC" bug: DateTime columns come back from the
// API as bare ISO strings with NO timezone designator (e.g. "2026-07-19T06:02:53")
// — System.Text.Json serializes MySqlConnector's DateTimeKind.Unspecified values
// without a trailing 'Z' or offset. Every page was rendering that raw string
// directly ({org.submittedAt}), so the browser never converted anything — admins
// were just reading the UTC wall-clock value stored in MySQL as plain text.
//
// The DB stores UTC (Railway's MySQL server runs UTC), so a string with no
// timezone designator is UTC and must be treated as such before converting to
// the viewer's local timezone. formatDateTime does exactly that: force-append
// 'Z' when no designator is present, let the browser's Date/Intl machinery do
// the UTC -> local conversion, then render as DD-MMM-YYYY hh:mm tt.
//
// formatDate is for pure DATE columns (RegistrationDate, DateOfBirth) that
// carry no time-of-day and therefore no timezone ambiguity — reformatting the
// YYYY-MM-DD parts directly avoids any risk of shifting the calendar date by
// re-interpreting it through a Date object.

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const HAS_TZ = /Z$|[+-]\d{2}:?\d{2}$/i

function pad2(n) {
  return String(n).padStart(2, '0')
}

// value: ISO-ish datetime string (with or without timezone designator), a
// Date, or null/undefined. Returns e.g. "26-Aug-2026 04:35 PM" in the
// viewer's local timezone, or fallback ('—' by default) when unparseable.
export function formatDateTime(value, fallback = '—') {
  if (!value) return fallback
  const raw = value instanceof Date
    ? value
    : new Date(HAS_TZ.test(String(value)) ? value : `${value}Z`)
  if (isNaN(raw.getTime())) return typeof value === 'string' ? value : fallback

  const day = pad2(raw.getDate())
  const month = MONTHS[raw.getMonth()]
  const year = raw.getFullYear()
  let hours = raw.getHours()
  const minutes = pad2(raw.getMinutes())
  const ampm = hours >= 12 ? 'PM' : 'AM'
  hours = hours % 12
  if (hours === 0) hours = 12
  return `${day}-${month}-${year} ${pad2(hours)}:${minutes} ${ampm}`
}

// value: DATE-only string (e.g. "2026-08-26" or "2026-08-26T00:00:00"), or
// null/undefined. No timezone conversion — reformats the calendar date as-is.
export function formatDate(value, fallback = '—') {
  if (!value) return fallback
  const s = String(value).slice(0, 10)
  const [y, m, d] = s.split('-')
  const monthIdx = Number(m) - 1
  if (!y || !d || Number.isNaN(monthIdx) || monthIdx < 0 || monthIdx > 11) return fallback
  return `${d}-${MONTHS[monthIdx]}-${y}`
}
