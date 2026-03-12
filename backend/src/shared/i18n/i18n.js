import i18next from 'i18next'
import Backend from 'i18next-fs-backend'
import middleware from 'i18next-http-middleware'
import { fileURLToPath } from 'url'
import path from 'path'

// In ES modules we don't have __dirname
// so we recreate it using import.meta.url
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

i18next
    // Use filesystem backend to load translation files
    .use(Backend)
    // Use HTTP middleware to detect language from requests
    .use(middleware.LanguageDetector)
    .init({
        // Fallback language if translation not found
        fallbackLng: 'en',

        // Available languages
        supportedLngs: ['en', 'es', 'fr'],

        // Where to load translation files from
        backend: {
            loadPath: path.join(__dirname, 'locales/{{lng}}/translation.json')
            // {{lng}} gets replaced with the language code
            // e.g. locales/en/translation.json
            //      locales/es/translation.json
        },

        // Language detection settings
        detection: {
            // Look for language in these places in order:
            order: [
                'querystring',  // ?lng=es in URL
                'header'        // Accept-Language: es header
            ],
            // The query parameter name
            lookupQuerystring: 'lng',
            // The header name
            lookupHeader: 'accept-language'
        },

        // Don't log debug info in production
        debug: process.env.NODE_ENV === 'development'
    })

export default i18next