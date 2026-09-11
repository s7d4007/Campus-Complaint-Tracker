const nodemailer = require('nodemailer');

if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.error('❌ SMTP env vars missing – email will not work. Set SMTP_HOST, SMTP_USER, SMTP_PASS.');
}

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: Number(process.env.SMTP_PORT) === 465,   // true = SSL (465), false = STARTTLS (587)
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
    // Hard timeouts so the request fails fast instead of hanging for minutes
    connectionTimeout: 10_000,   // 10 s to establish TCP connection
    greetingTimeout: 5_000,    // 5 s after connect to receive SMTP greeting
    socketTimeout: 10_000,   // 10 s of inactivity before giving up
});

// Verify SMTP config on server start – prints a clear success/failure log
transporter.verify((err) => {
    if (err) {
        console.error('❌ SMTP transporter verify failed:', err.message);
        console.error('   → Check SMTP_HOST / SMTP_PORT / SMTP_USER / SMTP_PASS and that the port is reachable.');
    } else {
        console.log('✅ SMTP transporter ready –', process.env.SMTP_USER);
    }
});

const sendMail = async (to, subject, html) => {
    const info = await transporter.sendMail({
        from: `"Campus Complaints" <${process.env.SMTP_USER}>`,
        to,
        subject,
        html,
    });
    console.log(`✉️  Mail sent to ${to} – messageId: ${info.messageId}`);
    return info;
};

module.exports = { sendMail };
