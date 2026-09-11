// Sends email via Google Apps Script web app (HTTPS POST to Google's servers).
// The Apps Script calls GmailApp.sendEmail(), so the email comes directly from your Gmail account and no third-party mail provider involved.
// Works on Render free tier because it's a plain HTTPS call, not SMTP.

if (!process.env.APPS_SCRIPT_URL) {
    console.error('❌ APPS_SCRIPT_URL not set – email will not work on this environment.');
} else {
    console.log('✅ Mailer ready – using Google Apps Script relay');
}

const sendMail = async (to, subject, html) => {
    const payload = JSON.stringify({ to, subject, html });
    const opts = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: payload,
    };

    // Google Apps Script issues a 302 redirect on POST requests.
    // The default redirect:'follow' converts POST → GET (HTTP spec),
    // causing doGet() to run instead of doPost(). Fix: capture the
    // redirect manually and re-issue as POST to the final URL.
    const initial = await fetch(process.env.APPS_SCRIPT_URL, { ...opts, redirect: 'manual' });
    const finalUrl = initial.headers.get('location') || process.env.APPS_SCRIPT_URL;
    const res = await fetch(finalUrl, { ...opts, redirect: 'follow' });

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
