// Sends email via Google Apps Script web app (HTTPS POST to Google's servers).
// Uses Node's built-in https module instead of fetch because fetch's
// redirect:'manual' returns an opaque response in Node 18+ (location header = null),
// so we can't re-POST to the redirect URL. The https module exposes headers fully.

const https = require('https');
const http = require('http');
const { URL } = require('url');

if (!process.env.APPS_SCRIPT_URL) {
    console.error('❌ APPS_SCRIPT_URL not set – email will not work on this environment.');
} else {
    console.log('✅ Mailer ready – using Google Apps Script relay');
}

/**
 * POST JSON to a URL, manually following any redirects while keeping POST + body.
 * (fetch / undici converts POST → GET on 302, which breaks Apps Script's doPost)
 */
const postJson = (urlStr, body, maxRedirects = 5) =>
    new Promise((resolve, reject) => {
        if (maxRedirects < 0) return reject(new Error('Too many redirects'));

        const data = Buffer.from(JSON.stringify(body));
        const parsed = new URL(urlStr);
        const client = parsed.protocol === 'https:' ? https : http;

        const req = client.request(
            {
                hostname: parsed.hostname,
                path: parsed.pathname + parsed.search,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': data.length,
                },
                timeout: 30_000,
            },
            (res) => {
                console.log(`[mailer] status: ${res.statusCode}, location: ${res.headers.location || 'none'}`);

                // Follow redirect using a GET request to retrieve the generated output payload
                if ([301, 302, 303, 307, 308].includes(res.statusCode) && res.headers.location) {
                    const next = new URL(res.headers.location, urlStr).toString();
                    console.log(`[mailer] redirect ${res.statusCode} → ${next.slice(0, 80)}…`);
                    res.resume(); // discard body, free socket

                    return resolve(new Promise((resolveGet, rejectGet) => {
                        https.get(next, (resGet) => {
                            let text = '';
                            resGet.setEncoding('utf8');
                            resGet.on('data', chunk => (text += chunk));
                            resGet.on('end', () => resolveGet(text));
                        }).on('error', rejectGet);
                    }));
                }

                let text = '';
                res.setEncoding('utf8');
                res.on('data', chunk => (text += chunk));
                res.on('end', () => resolve(text));
            }
        );

        req.on('error', reject);
        req.on('timeout', () => req.destroy(new Error('Apps Script request timed out')));
        req.write(data);
        req.end();
    });

const sendMail = async (to, subject, html) => {
    const text = await postJson(process.env.APPS_SCRIPT_URL, { to, subject, html });

    let data;
    try { data = JSON.parse(text); }
    catch { data = { success: false, error: text.slice(0, 300) }; }

    if (!data.success) {
        throw new Error(data.error || 'Apps Script mailer returned failure');
    }

    console.log(`✉️  Mail sent to ${to} via Gmail (Apps Script)`);
    return data;
};

module.exports = { sendMail };
