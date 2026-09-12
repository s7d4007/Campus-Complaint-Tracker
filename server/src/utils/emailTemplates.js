// Professional HTML email templates for CampusTracker
// Uses inline styles for maximum email client compatibility

const BRAND = {
  name: 'CampusTracker',
  color: '#7c3aed',       // primary purple
  colorLight: '#a78bfa',
  bgDark: '#0f0d1a',
  bgCard: '#1a1726',
  textPrimary: '#f3f0ff',
  textSecondary: '#a1a1aa',
  border: '#2d2640',
  year: new Date().getFullYear(),
};

/**
 * Shared email shell — responsive layout, dark brand theme
 */
const emailShell = (bodyContent) => `
<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="color-scheme" content="light dark" />
  <meta name="supported-color-schemes" content="light dark" />
  <title>CampusTracker</title>
</head>
<body style="margin:0;padding:0;background-color:#0a0a0f;font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;">
  <!-- Preheader (hidden text for inbox preview) -->
  <div style="display:none;font-size:1px;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">
    CampusTracker — Your Campus, Your Voice, Our Action.
  </div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#0a0a0f;">
    <tr>
      <td align="center" style="padding:32px 16px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;width:100%;">

          <!-- Logo Header -->
          <tr>
            <td align="center" style="padding-bottom:28px;">
              <table role="presentation" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background-color:${BRAND.color};width:36px;height:36px;border-radius:10px;text-align:center;vertical-align:middle;font-weight:700;color:#fff;font-size:13px;letter-spacing:0.5px;">
                    CC
                  </td>
                  <td style="padding-left:10px;font-size:20px;font-weight:700;color:${BRAND.textPrimary};letter-spacing:-0.3px;">
                    Campus<span style="color:${BRAND.colorLight};">Tracker</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Main Card -->
          <tr>
            <td style="background-color:${BRAND.bgCard};border:1px solid ${BRAND.border};border-radius:16px;padding:40px 32px;">
              ${bodyContent}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding-top:28px;text-align:center;">
              <p style="margin:0 0 6px;font-size:12px;color:${BRAND.textSecondary};">
                Built for students. Powered by transparency.
              </p>
              <p style="margin:0;font-size:11px;color:#52525b;">
                &copy; ${BRAND.year} CampusTracker. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`.trim();


/* ── OTP Verification Email ─────────────────────────────────────── */

const otpEmail = (code) => {
  const digits = code.toString().split('');

  const digitBoxes = digits.map(d =>
    `<td style="width:42px;height:50px;background-color:#0f0d1a;border:1px solid ${BRAND.border};border-radius:10px;text-align:center;vertical-align:middle;font-size:24px;font-weight:700;color:${BRAND.colorLight};letter-spacing:1px;">${d}</td>`
  ).join(`<td style="width:6px;"></td>`);

  const html = emailShell(`
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding-bottom:20px;">
                    <div style="width:56px;height:56px;border-radius:50%;background:linear-gradient(135deg,${BRAND.color},#6366f1);display:inline-flex;align-items:center;justify-content:center;">
                      <span style="font-size:24px;color:#ffffff;font-weight:700;line-height:1;letter-spacing:1px;">CC</span>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding-bottom:8px;">
                    <h1 style="margin:0;font-size:22px;font-weight:700;color:${BRAND.textPrimary};">
                      Verify Your Email
                    </h1>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding-bottom:28px;">
                    <p style="margin:0;font-size:14px;color:${BRAND.textSecondary};line-height:1.6;">
                      Use the 6-digit code below to complete your<br/>registration on CampusTracker.
                    </p>
                  </td>
                </tr>

                <!-- OTP Digit Boxes -->
                <tr>
                  <td align="center" style="padding-bottom:28px;">
                    <table role="presentation" cellpadding="0" cellspacing="0">
                      <tr>
                        ${digitBoxes}
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Divider -->
                <tr>
                  <td style="padding-bottom:20px;">
                    <div style="height:1px;background-color:${BRAND.border};"></div>
                  </td>
                </tr>

                <!-- Info -->
                <tr>
                  <td>
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding-bottom:8px;">
                          <span style="font-size:12px;color:${BRAND.textSecondary}; font-weight:bold;">Time: </span>
                          <span style="font-size:13px;color:${BRAND.textSecondary};">This code expires in <strong style="color:${BRAND.textPrimary};">10 minutes</strong></span>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <span style="font-size:12px;color:${BRAND.textSecondary}; font-weight:bold;">Secure: </span>
                          <span style="font-size:13px;color:${BRAND.textSecondary};">Never share this code with anyone</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Note -->
                <tr>
                  <td style="padding-top:24px;">
                    <p style="margin:0;font-size:12px;color:#52525b;line-height:1.5;">
                      If you didn't request this code, you can safely ignore this email. Someone may have entered your email address by mistake.
                    </p>
                  </td>
                </tr>
              </table>
    `);

  const text = [
    'CampusTracker — Email Verification',
    '',
    `Your 6-digit verification code is: ${code}`,
    '',
    'This code expires in 10 minutes.',
    'Never share this code with anyone.',
    '',
    'If you did not request this code, please ignore this email.',
    '',
    `© ${BRAND.year} CampusTracker`,
  ].join('\n');

  return { html, text };
};


/* ── Welcome Email ──────────────────────────────────────────────── */

const welcomeEmail = (name) => {
  const features = [
    { emoji: '•', title: 'Submit Complaints', desc: 'File campus issues with descriptions, priority levels, and photo attachments.' },
    { emoji: '•', title: 'Real-Time Tracking', desc: 'Watch your complaint move through Open → In Progress → Resolved.' },
    { emoji: '•', title: 'Instant Notifications', desc: 'Get notified the moment your complaint status changes.' },
    { emoji: '•', title: 'Admin Communication', desc: 'Communicate directly with administrators regarding your issues.' },
  ];

  const featureRows = features.map(f => `
                      <tr>
                        <td style="padding:12px 16px;background-color:#0f0d1a;border:1px solid ${BRAND.border};border-radius:12px;">
                          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                            <tr>
                              <td style="width:36px;vertical-align:top;font-size:20px;">${f.emoji}</td>
                              <td style="vertical-align:top;">
                                <p style="margin:0 0 2px;font-size:14px;font-weight:600;color:${BRAND.textPrimary};">${f.title}</p>
                                <p style="margin:0;font-size:12px;color:${BRAND.textSecondary};line-height:1.5;">${f.desc}</p>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                      <tr><td style="height:8px;"></td></tr>
    `).join('');

  const html = emailShell(`
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding-bottom:20px;">
                    <div style="width:56px;height:56px;border-radius:50%;background:linear-gradient(135deg,${BRAND.color},#6366f1);display:inline-flex;align-items:center;justify-content:center;">
                      <span style="font-size:24px;color:#ffffff;font-weight:700;line-height:1;letter-spacing:1px;">CC</span>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding-bottom:8px;">
                    <h1 style="margin:0;font-size:22px;font-weight:700;color:${BRAND.textPrimary};">
                      Welcome aboard, ${name}!
                    </h1>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding-bottom:28px;">
                    <p style="margin:0;font-size:14px;color:${BRAND.textSecondary};line-height:1.6;">
                      Your account has been created successfully.<br/>Here's what you can do on CampusTracker:
                    </p>
                  </td>
                </tr>

                <!-- Features -->
                <tr>
                  <td style="padding-bottom:24px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      ${featureRows}
                    </table>
                  </td>
                </tr>

                <!-- CTA Button -->
                <tr>
                  <td align="center" style="padding-bottom:24px;">
                    <a href="https://campus-complaint-tracker-gamma.vercel.app/login"
                       style="display:inline-block;padding:14px 36px;background:linear-gradient(135deg,${BRAND.color},#6366f1);color:#ffffff;font-size:15px;font-weight:600;text-decoration:none;border-radius:12px;letter-spacing:0.3px;">
                      Go to Dashboard →
                    </a>
                  </td>
                </tr>

                <!-- Divider -->
                <tr>
                  <td style="padding-bottom:20px;">
                    <div style="height:1px;background-color:${BRAND.border};"></div>
                  </td>
                </tr>

                <tr>
                  <td>
                    <p style="margin:0;font-size:12px;color:#52525b;line-height:1.5;">
                      You're receiving this because you registered on CampusTracker. If this wasn't you, please contact us.
                    </p>
                  </td>
                </tr>
              </table>
    `);

  const text = [
    `Welcome to CampusTracker, ${name}!`,
    '',
    'Your account has been created successfully.',
    '',
    'Here is what you can do:',
    '• Submit campus complaints with descriptions & photos',
    '• Track real-time status: Open → In Progress → Resolved',
    '• Get instant notifications on status changes',
    '• Communicate directly with administrators',
    '',
    'Log in: https://campus-complaint-tracker-gamma.vercel.app/login',
    '',
    `© ${BRAND.year} CampusTracker`,
  ].join('\n');

  return { html, text };
};


module.exports = { otpEmail, welcomeEmail };
