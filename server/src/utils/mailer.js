const nodemailer = require('nodemailer');

let transporter;

const initMailer = async () => {
    try {
        if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
            transporter = nodemailer.createTransport({
                host: process.env.SMTP_HOST,
                port: process.env.SMTP_PORT || 587,
                secure: process.env.SMTP_PORT == 465,
                auth: {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PASS
                }
            });
            console.log('Real SMTP transporter initialized');
        } else {
            // Use Ethereal for testing
            const testAccount = await nodemailer.createTestAccount();
            transporter = nodemailer.createTransport({
                host: 'smtp.ethereal.email',
                port: 587,
                secure: false,
                auth: {
                    user: testAccount.user,
                    pass: testAccount.pass
                }
            });
            console.log('Ethereal Mail transporter initialized. User:', testAccount.user);
        }
    } catch (err) {
        console.error('Error initializing mailer:', err);
    }
};

// Initialize proactively
initMailer();

const sendMail = async (to, subject, html) => {
    if (!transporter) await initMailer();

    try {
        const info = await transporter.sendMail({
            from: '"Campus Complaints" <noreply@campuscomplaints.edu>',
            to,
            subject,
            html
        });
        console.log(`Message sent: ${info.messageId}`);
        if (info.messageId.includes('ethereal')) {
            console.log(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
        }
        return info;
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
};

module.exports = { sendMail };
