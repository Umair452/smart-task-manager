import { DateTime } from 'luxon'

// ─── STORE DATE ──────────────────────────────────────────

// Convert any date input to UTC before storing in DB
// Always call this before saving dates to database
export const toUTC = (date) => {
    if (!date) return null

    // DateTime.fromISO() parses ISO string like
    // '2026-12-31T09:00:00' or '2026-12-31T09:00:00+05:00'
    // .toUTC() converts it to UTC
    // .toJSDate() converts to JS Date object that Prisma expects
    return DateTime.fromISO(date).toUTC().toJSDate()
}

// ─── DISPLAY DATE ────────────────────────────────────────

// Convert UTC date from DB to user's local timezone
// Call this when sending dates back to the user
export const toUserTimezone = (utcDate, timezone = 'UTC') => {
    if (!utcDate) return null

    // DateTime.fromJSDate() converts JS Date to Luxon DateTime
    // { zone: 'utc' } tells Luxon the input is in UTC
    // .setZone(timezone) converts to user's timezone
    // e.g. timezone = 'America/New_York' or 'Europe/London'
    return DateTime.fromJSDate(utcDate, { zone: 'utc' })
        .setZone(timezone)
        .toISO()
    // .toISO() returns ISO string with timezone offset
    // e.g. '2026-12-31T09:00:00.000-05:00'
}

// ─── FORMAT DATE FOR DISPLAY ─────────────────────────────

// Returns a human readable date string
// e.g. 'December 31, 2026 at 9:00 AM'
export const formatDate = (utcDate, timezone = 'UTC', locale = 'en') => {
    if (!utcDate) return null

    return DateTime.fromJSDate(utcDate, { zone: 'utc' })
        .setZone(timezone)
        .setLocale(locale)
        // toLocaleString() formats based on locale
        .toLocaleString(DateTime.DATETIME_FULL)
    // DATETIME_FULL = 'December 31, 2026 at 9:00 AM EST'
}

// ─── GET CURRENT UTC TIME ────────────────────────────────

// Always use this instead of new Date()
// Makes it explicit we're working in UTC
export const nowUTC = () => {
    return DateTime.utc().toJSDate()
}

// ─── CHECK IF DATE IS PAST ───────────────────────────────

// Returns true if date is in the past
export const isPast = (utcDate) => {
    if (!utcDate) return false

    return DateTime.fromJSDate(utcDate, { zone: 'utc' })
        .diffNow()
        .milliseconds < 0
    // diffNow() = difference from now
    // negative = in the past
}