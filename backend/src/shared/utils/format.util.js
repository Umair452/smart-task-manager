// ─── CURRENCY FORMATTING ─────────────────────────────────

// Format a number as currency based on user's locale
// Uses built-in Intl.NumberFormat (no extra package needed)
export const formatCurrency = (amount, currency = 'USD', locale = 'en') => {
    if (amount === null || amount === undefined) return null

    // Intl.NumberFormat is built into JavaScript
    // It handles all the formatting rules for each locale
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency,
        // minimumFractionDigits = always show 2 decimal places
        minimumFractionDigits: 2
    }).format(amount)
}

// Examples:
// formatCurrency(1000, 'USD', 'en-US') → '$1,000.00'
// formatCurrency(1000, 'EUR', 'de-DE') → '1.000,00 €'
// formatCurrency(1000, 'GBP', 'en-GB') → '£1,000.00'
// formatCurrency(1000, 'JPY', 'ja-JP') → '￥1,000'

// ─── NUMBER FORMATTING ───────────────────────────────────

// Format numbers based on locale
// Different countries use different decimal separators
export const formatNumber = (number, locale = 'en') => {
    if (number === null || number === undefined) return null

    return new Intl.NumberFormat(locale).format(number)
}

// Examples:
// formatNumber(1234567.89, 'en-US') → '1,234,567.89'
// formatNumber(1234567.89, 'de-DE') → '1.234.567,89'
// formatNumber(1234567.89, 'fr-FR') → '1 234 567,89'

// ─── UNIT FORMATTING ─────────────────────────────────────

// Convert temperature between Celsius and Fahrenheit
export const formatTemperature = (value, unit = 'celsius', locale = 'en') => {
    if (value === null || value === undefined) return null

    // Convert to the right unit
    const converted = unit === 'fahrenheit'
        ? (value * 9 / 5) + 32  // celsius to fahrenheit
        : value

    // Format with locale
    const formatted = new Intl.NumberFormat(locale, {
        maximumFractionDigits: 1
    }).format(converted)

    const symbol = unit === 'fahrenheit' ? '°F' : '°C'
    return `${formatted}${symbol}`
}

// Convert distance between km and miles
export const formatDistance = (km, unit = 'km', locale = 'en') => {
    if (km === null || km === undefined) return null

    const value = unit === 'miles'
        ? km * 0.621371  // km to miles
        : km

    const formatted = new Intl.NumberFormat(locale, {
        maximumFractionDigits: 2
    }).format(value)

    return `${formatted} ${unit}`
}

// ─── LOCALE BASED DEFAULTS ───────────────────────────────

// Get default currency for a locale
// So we don't have to always pass currency manually
export const getDefaultCurrency = (locale = 'en') => {
    const currencyMap = {
        'en': 'USD',
        'en-US': 'USD',
        'en-GB': 'GBP',
        'de': 'EUR',
        'de-DE': 'EUR',
        'fr': 'EUR',
        'fr-FR': 'EUR',
        'ja': 'JPY',
        'ja-JP': 'JPY',
        'es': 'EUR',
        'es-MX': 'MXN',
        'zh': 'CNY'
    }

    // Return mapped currency or default to USD
    return currencyMap[locale] || 'USD'
}

// Get preferred unit system for a locale
export const getUnitSystem = (locale = 'en') => {
    // Only US, Liberia, Myanmar use imperial
    const imperialLocales = ['en-US', 'en-LR', 'my']
    return imperialLocales.includes(locale) ? 'imperial' : 'metric'
}