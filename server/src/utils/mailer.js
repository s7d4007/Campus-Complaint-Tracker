// Sends email via Google Apps Script web app (HTTPS POST to Google's servers).

const axios = require('axios');

if (!process.env.APPS_SCRIPT_URL) {
    console.error('❌ APPS_SCRIPT_URL not set – email will not work on this environment.');
} else {
    console.log('✅ Mailer ready – using Google Apps Script relay (Axios)');
}

/**
 * Send an email via the Apps Script relay.
 * @param {string} to       - recipient email
 * @param {string} subject  - email subject
 * @param {string} html     - HTML body
 * @param {string} [text]   - plain-text fallback (improves deliverability)
 */
const sendMail = async (to, subject, html, text) => {
    try {
        const payload = { to, subject, html };

        // Include plain-text body if provided (helps avoid spam filters)
        if (text) payload.text = text;

        const { data } = await axios.post(
            process.env.APPS_SCRIPT_URL,
            payload,
            {
                headers: { 'Content-Type': 'application/json' },
                timeout: 30_000 // 30s timeout
            }
        );

        if (!data.success) {
            throw new Error(data.error || 'Apps Script mailer returned failure');
        }

        console.log(`✉️  Mail sent to ${to} via Gmail (Apps Script)`);
        return data;
    } catch (err) {
        throw new Error(err.response?.data?.error || err.message || 'Apps Script request failed');
    }
};

module.exports = { sendMail };
