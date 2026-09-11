// Sends email via Google Apps Script web app (HTTPS POST to Google's servers).
// The Apps Script calls GmailApp.sendEmail(), so the email comes directly from your Gmail account and no third-party mail provider involved.
// Works on Render free tier because it's a plain HTTPS call, not SMTP.

if (!process.env.APPS_SCRIPT_URL) {
    console.error('❌ APPS_SCRIPT_URL not set – email will not work on this environment.');
} else {
    console.log('✅ Mailer ready – using Google Apps Script relay');
}

const sendMail = async (to, subject, html) => {
    const res = await fetch(process.env.APPS_SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to, subject, html }),
        redirect: 'follow', // Apps Script redirects once before responding
    });

    // Google redirects POST → GET when following, so content may come back as text
    const text = await res.text();
    let data;
    try { data = JSON.parse(text); } catch { data = { success: false, error: text }; }

    if (!data.success) {
        throw new Error(data.error || 'Apps Script mailer returned failure');
    }

    console.log(`✉️  Mail sent to ${to} via Gmail (Apps Script)`);
    return data;
};

module.exports = { sendMail };
