const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

const sendMail = async (to, subject, html) => {
    const info = await transporter.sendMail({
        from: `"Campus Complaints" <${process.env.SMTP_USER}>`,
        to,
        subject,
        html,
    });
    console.log(`Mail sent: ${info.messageId}`);
    return info;
};

module.exports = { sendMail };
