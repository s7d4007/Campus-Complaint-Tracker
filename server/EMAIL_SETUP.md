# Email Setup — Google Apps Script Relay

## Updated Apps Script Code

Go to [Google Apps Script](https://script.google.com) → Open your existing CampusTracker mailer project → Replace the code with:

```javascript
/**
 * CampusTracker Email Relay — Google Apps Script
 *
 * Receives { to, subject, html, text } via POST from the Node.js backend
 * and sends a properly-formatted multipart email via GmailApp.
 *
 * Deploy as: Web App → Execute as: Me → Access: Anyone
 */

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const { to, subject, html, text } = data;

    if (!to || !subject || !html) {
      return _json({
        success: false,
        error: "Missing required fields: to, subject, html",
      });
    }

    // Send with BOTH plain-text body and htmlBody
    // This creates a proper multipart/alternative email — critical for deliverability
    GmailApp.sendEmail(to, subject, text || stripHtml(subject), {
      htmlBody: html,
      name: "CampusTracker", // Display name shown in inbox
      noReply: false, // Allow replies (noReply emails are more likely to be flagged)
    });

    return _json({ success: true });
  } catch (err) {
    return _json({ success: false, error: err.message });
  }
}

// Fallback: strip HTML to produce plain text if 'text' wasn't provided
function stripHtml(html) {
  return html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n\n")
    .replace(/<[^>]+>/g, "")
    .replace(/ /gi, " ")
    .replace(/&/gi, "&")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function _json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON,
  );
}

// Required for Apps Script Web App
function doGet() {
  return _json({ status: "CampusTracker Email Relay is running." });
}
```

### Deployment Steps

1. Paste the code above, replacing your existing script
2. Click **Deploy** → **New deployment**
3. Type: **Web App**
4. Execute as: **Me**
5. Who has access: **Anyone**
6. Click **Deploy** and copy the new URL
7. If the URL changed, update `APPS_SCRIPT_URL` in your `.env` and Render environment variables

---

## Why Emails Go to Spam — and Fixes

### What We've Already Fixed (in this update)

| Fix                                    | Why it helps                                                                                          |
| -------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| **Plain-text fallback**          | Multipart emails (HTML + text) are a spam filter requirement. Single-format emails get penalized.     |
| **Professional HTML**            | Proper HTML structure with`DOCTYPE`, `meta charset`, and valid tables — not rogue `<h1>` tags. |
| **Preheader text**               | Hidden text for inbox preview shows legitimacy.                                                       |
| **Sender display name**          | "CampusTracker" instead of raw email — builds trust.                                                 |
| **"If you didn't request this"** | Standard unsubscribe/opt-out language signals legitimacy to filters.                                  |

### Additional Steps YOU Should Take

#### 1. Don't use `noReply: true`

We set `noReply: false` in the script. No-reply addresses are flagged by Gmail spam filters because they indicate one-way bulk mail.

#### 2. Warm up the sending account

If your Gmail account is new or has never sent bulk emails:

- Send a few manual emails first
- Have recipients **reply** to your emails
- Have recipients **mark as "Not Spam"** if it lands there initially
- Gradually increase volume over a few days

#### 3. Ask initial users to whitelist

Tell your first batch of users:

> "Check your **Spam folder** for the verification code. If it's there, click **Report as Not Spam**. This helps future emails arrive in your inbox."

#### 4. (Advanced) Set up a custom domain

The #1 reason Gmail-to-Gmail via Apps Script gets flagged is that the sender is a regular `@gmail.com` address. Using a custom domain with proper SPF/DKIM/DMARC records dramatically improves deliverability. This is a longer-term fix.

#### 5. Avoid spam trigger words

Our updated email avoids common triggers like "FREE", "ACT NOW", "CLICK HERE" in the subject line.
