// ============================================================
// GENWEBZY CRM — EMAIL.gs
// Owner notification + client confirmation emails.
// ============================================================

// ── OWNER NOTIFICATION ────────────────────────────────────────

/**
 * Send a premium owner notification email.
 * @param {Object} data    — sanitized form data
 * @param {string} waLink  — WhatsApp link to client
 * @param {number} rowNum  — CRM sheet row number
 */
function sendOwnerNotification(data, waLink, rowNum) {
  const crmUrl    = getCRMUrl();
  const replyLink = "mailto:" + encodeURIComponent(data.email) +
                    "?subject=" + encodeURIComponent("Re: Your " + data.service + " enquiry — Genwebzy") +
                    "&body=" + encodeURIComponent(
                      "Hello " + data.name + ",\n\nThank you for reaching out to Genwebzy.\n\n"
                    );

  const subject   = buildOwnerSubject(data);
  const htmlBody  = buildOwnerEmailHtml(data, waLink, replyLink, crmUrl);
  const plainBody = [
    "New enquiry received — Genwebzy",
    "═══════════════════════════════",
    "Name:     " + data.name,
    "Email:    " + data.email,
    "Phone:    " + data.phone,
    "Company:  " + (data.company || "—"),
    "Service:  " + data.service,
    "Budget:   " + (data.budget || "Not specified"),
    "Timeline: " + (data.timeline || "Not specified"),
    "Message:  " + (data.message || "—"),
    "",
    "WhatsApp: " + waLink,
    "CRM:      " + crmUrl,
  ].join("\n");

  // GmailApp sends directly through Gmail (full DKIM/SPF) — better deliverability
  GmailApp.sendEmail(CONFIG.OWNER_EMAIL, subject, plainBody, {
    htmlBody:  htmlBody,
    replyTo:   data.email,
    name:      "Genwebzy CRM",
  });

  Logger.log("Owner notification sent for: " + data.email);
}

/**
 * Build a dynamic subject line for the owner notification.
 * @param {Object} data
 * @returns {string}
 */
function buildOwnerSubject(data) {
  const first = data.name.split(" ")[0];
  // Clean subjects — no emoji, no ALL CAPS, no spam trigger words
  const patterns = [
    "New enquiry from " + first + " — " + data.service,
    "New project enquiry — " + (data.company || first),
    "Website enquiry from " + first,
    "New client enquiry — " + data.service,
  ];
  const index = new Date().getHours() % patterns.length;
  return patterns[index];
}

/**
 * Build the full premium HTML email for the owner.
 */
function buildOwnerEmailHtml(data, waLink, replyLink, crmUrl) {
  const time    = formattedDateTime();
  const name    = escapeHtml(data.name);
  const email   = escapeHtml(data.email);
  const phone   = escapeHtml(data.phone);
  const company = escapeHtml(data.company  || "—");
  const service = escapeHtml(data.service);
  const budget  = escapeHtml(data.budget   || "Not specified");
  const timeline= escapeHtml(data.timeline || "Not specified");
  const start   = escapeHtml(data.startDate|| "Not specified");
  const message = escapeHtml(data.message  || "No message provided.");

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>New Enquiry — ${name}</title>
</head>
<body style="margin:0;padding:0;background:#0a0a12;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">

<!-- Wrapper -->
<table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a12;padding:32px 16px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

  <!-- ══ HEADER BAR ══════════════════════════════════════ -->
  <tr>
    <td style="background:linear-gradient(135deg,#6c63ff 0%,#a78bfa 100%);border-radius:16px 16px 0 0;padding:36px 40px 32px;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td>
            <p style="margin:0 0 8px;font-size:22px;font-weight:800;letter-spacing:0.12em;color:#ffffff;text-transform:uppercase;">
              GENWEBZY
            </p>
            <p style="margin:0 0 20px;font-size:11px;font-weight:600;letter-spacing:0.25em;color:rgba(255,255,255,0.65);text-transform:uppercase;">
              New Project Enquiry
            </p>
            <p style="margin:0 0 10px;font-size:26px;font-weight:700;color:#ffffff;line-height:1.3;">
              You have a new<br/>potential client.
            </p>
            <p style="margin:0;font-size:12px;color:rgba(255,255,255,0.55);">
              Received: ${time}
            </p>
          </td>
          <td align="right" valign="top">
            <div style="background:rgba(255,255,255,0.15);border-radius:50px;padding:6px 16px;display:inline-block;">
              <span style="font-size:11px;font-weight:700;color:#ffffff;letter-spacing:0.1em;">NEW LEAD</span>
            </div>
          </td>
        </tr>
      </table>
    </td>
  </tr>

  <!-- ══ LEAD BADGE ══════════════════════════════════════ -->
  <tr>
    <td style="background:#13131f;padding:14px 40px;">
      <table cellpadding="0" cellspacing="0">
        <tr>
          <td style="background:#1e3a5f;border-radius:6px;padding:4px 12px;">
            <span style="font-size:10px;font-weight:700;color:#60a5fa;letter-spacing:0.15em;">NEW LEAD</span>
          </td>
          <td style="padding-left:12px;">
            <span style="font-size:10px;color:#64748b;letter-spacing:0.1em;">SOURCE: GENWEBZY WEBSITE</span>
          </td>
        </tr>
      </table>
    </td>
  </tr>

  <!-- ══ MAIN BODY ════════════════════════════════════════ -->
  <tr>
    <td style="background:#0f0f1a;padding:8px 40px 32px;">

      <!-- ─ CLIENT CARD ──────────────────────────────── -->
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#111120;border:1px solid #1e1e35;border-radius:12px;margin-bottom:16px;">
        <tr>
          <td style="padding:24px 28px 20px;">
            <p style="margin:0 0 20px;font-size:10px;font-weight:700;color:#6c63ff;letter-spacing:0.2em;text-transform:uppercase;border-bottom:1px solid #1e1e35;padding-bottom:12px;">
              Client Information
            </p>
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td width="50%" valign="top" style="padding-bottom:18px;">
                  <p style="margin:0 0 4px;font-size:9px;font-weight:700;color:#475569;letter-spacing:0.15em;text-transform:uppercase;">CLIENT</p>
                  <p style="margin:0;font-size:16px;font-weight:700;color:#f1f5f9;">${name}</p>
                </td>
                <td width="50%" valign="top" style="padding-bottom:18px;">
                  <p style="margin:0 0 4px;font-size:9px;font-weight:700;color:#475569;letter-spacing:0.15em;text-transform:uppercase;">COMPANY</p>
                  <p style="margin:0;font-size:14px;font-weight:600;color:#e2e8f0;">${company}</p>
                </td>
              </tr>
              <tr>
                <td width="50%" valign="top">
                  <p style="margin:0 0 4px;font-size:9px;font-weight:700;color:#475569;letter-spacing:0.15em;text-transform:uppercase;">EMAIL</p>
                  <a href="mailto:${email}" style="font-size:13px;font-weight:500;color:#60a5fa;text-decoration:none;">${email}</a>
                </td>
                <td width="50%" valign="top">
                  <p style="margin:0 0 4px;font-size:9px;font-weight:700;color:#475569;letter-spacing:0.15em;text-transform:uppercase;">PHONE / WHATSAPP</p>
                  <a href="${waLink}" style="font-size:13px;font-weight:500;color:#4ade80;text-decoration:none;">${phone}</a>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>

      <!-- ─ PROJECT CARD ─────────────────────────────── -->
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#111120;border:1px solid #1e1e35;border-radius:12px;margin-bottom:16px;">
        <tr>
          <td style="padding:24px 28px 20px;">
            <p style="margin:0 0 20px;font-size:10px;font-weight:700;color:#a78bfa;letter-spacing:0.2em;text-transform:uppercase;border-bottom:1px solid #1e1e35;padding-bottom:12px;">
              Project Information
            </p>
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td width="50%" valign="top" style="padding-bottom:18px;">
                  <p style="margin:0 0 4px;font-size:9px;font-weight:700;color:#475569;letter-spacing:0.15em;text-transform:uppercase;">SERVICE</p>
                  <p style="margin:0;font-size:15px;font-weight:700;color:#f1f5f9;">${service}</p>
                </td>
                <td width="50%" valign="top" style="padding-bottom:18px;">
                  <p style="margin:0 0 4px;font-size:9px;font-weight:700;color:#475569;letter-spacing:0.15em;text-transform:uppercase;">BUDGET</p>
                  <p style="margin:0;font-size:14px;font-weight:600;color:#fbbf24;">${budget}</p>
                </td>
              </tr>
              <tr>
                <td width="50%" valign="top">
                  <p style="margin:0 0 4px;font-size:9px;font-weight:700;color:#475569;letter-spacing:0.15em;text-transform:uppercase;">TIMELINE</p>
                  <p style="margin:0;font-size:13px;font-weight:500;color:#e2e8f0;">${timeline}</p>
                </td>
                <td width="50%" valign="top">
                  <p style="margin:0 0 4px;font-size:9px;font-weight:700;color:#475569;letter-spacing:0.15em;text-transform:uppercase;">PREFERRED START</p>
                  <p style="margin:0;font-size:13px;font-weight:500;color:#e2e8f0;">${start}</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>

      <!-- ─ MESSAGE CARD ─────────────────────────────── -->
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#111120;border:1px solid #1e1e35;border-left:3px solid #6c63ff;border-radius:0 12px 12px 0;margin-bottom:28px;">
        <tr>
          <td style="padding:24px 28px;">
            <p style="margin:0 0 12px;font-size:9px;font-weight:700;color:#475569;letter-spacing:0.2em;text-transform:uppercase;">CLIENT MESSAGE</p>
            <p style="margin:0;font-size:14px;line-height:1.75;color:#cbd5e1;font-style:italic;">&ldquo;${message}&rdquo;</p>
          </td>
        </tr>
      </table>

      <!-- ─ ACTION BUTTONS ───────────────────────────── -->
      <p style="margin:0 0 16px;font-size:10px;font-weight:700;color:#475569;letter-spacing:0.2em;text-transform:uppercase;">Quick Actions</p>
      <table cellpadding="0" cellspacing="0">
        <tr>
          <!-- Reply -->
          <td style="padding-right:10px;">
            <a href="${replyLink}"
               style="display:inline-block;background:#6c63ff;color:#ffffff;font-size:12px;font-weight:700;text-decoration:none;padding:12px 22px;border-radius:8px;letter-spacing:0.05em;">
              ✉️ Reply to Client
            </a>
          </td>
          <!-- WhatsApp -->
          <td style="padding-right:10px;">
            <a href="${waLink}"
               style="display:inline-block;background:#128c7e;color:#ffffff;font-size:12px;font-weight:700;text-decoration:none;padding:12px 22px;border-radius:8px;letter-spacing:0.05em;">
              💬 WhatsApp Client
            </a>
          </td>
          <!-- CRM -->
          <td>
            <a href="${crmUrl}"
               style="display:inline-block;background:#1e1e35;border:1px solid #2e2e4e;color:#a78bfa;font-size:12px;font-weight:700;text-decoration:none;padding:12px 22px;border-radius:8px;letter-spacing:0.05em;">
              📊 Open CRM
            </a>
          </td>
        </tr>
      </table>

    </td>
  </tr>

  <!-- ══ FOOTER ═══════════════════════════════════════════ -->
  <tr>
    <td style="background:#080810;border-radius:0 0 16px 16px;padding:20px 40px;border-top:1px solid #1a1a2e;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td>
            <p style="margin:0;font-size:11px;font-weight:800;letter-spacing:0.15em;color:#6c63ff;text-transform:uppercase;">GENWEBZY</p>
            <p style="margin:4px 0 0;font-size:10px;color:#334155;">This is an automated lead notification.</p>
          </td>
          <td align="right">
            <a href="${CONFIG.WEBSITE}" style="font-size:10px;color:#475569;text-decoration:none;">${CONFIG.WEBSITE}</a>
          </td>
        </tr>
      </table>
    </td>
  </tr>

</table>
</td></tr>
</table>
</body>
</html>`;
}


// ── CLIENT CONFIRMATION ───────────────────────────────────────

/**
 * Send a premium confirmation email to the client.
 * @param {Object} data    — sanitized form data
 * @param {string} waLink  — WhatsApp link for client to contact Genwebzy
 */
function sendClientConfirmation(data, waLink) {
  const clientWaLink = generateClientToOwnerWhatsApp(data);
  const subject      = "We received your enquiry — " + CONFIG.COMPANY_NAME;
  const htmlBody     = buildClientEmailHtml(data, clientWaLink);
  const firstName    = data.name.split(" ")[0];

  // Plain text version (critical for inbox delivery)
  const plainBody = [
    "Hello " + firstName + ",",
    "",
    "Thank you for reaching out to Genwebzy. We have received your enquiry and our team will review your project requirements and get back to you within 24 hours.",
    "",
    "Your Project Summary:",
    "Service:  " + data.service,
    "Budget:   " + (data.budget || "Not specified"),
    "Timeline: " + (data.timeline || "Not specified"),
    "",
    "What happens next:",
    "1. We review your project requirements.",
    "2. We contact you to discuss the details (usually within 24 hours).",
    "3. We share a proposal and timeline tailored to your project.",
    "",
    "Chat with us on WhatsApp: " + CONFIG.WHATSAPP_LINK,
    "Visit our website: " + CONFIG.WEBSITE,
    "",
    "Warm regards,",
    "The Genwebzy Team",
    CONFIG.OWNER_EMAIL,
  ].join("\n");

  // GmailApp sends directly through Gmail — better deliverability than MailApp
  GmailApp.sendEmail(data.email, subject, plainBody, {
    htmlBody:  htmlBody,
    replyTo:   CONFIG.OWNER_EMAIL,
    name:      CONFIG.COMPANY_NAME,
  });

  Logger.log("Client confirmation sent to: " + data.email);
}

/**
 * Build the premium HTML email for the client.
 */
function buildClientEmailHtml(data, clientWaLink) {
  const firstName = escapeHtml(data.name.split(" ")[0]);
  const service   = escapeHtml(data.service);
  const budget    = escapeHtml(data.budget    || "Not specified");
  const timeline  = escapeHtml(data.timeline  || "Not specified");
  const start     = escapeHtml(data.startDate || "Not specified");

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Enquiry Received — Genwebzy</title>
</head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:32px 16px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

  <!-- ══ HEADER ════════════════════════════════════════════ -->
  <tr>
    <td style="background:#0f0f1a;border-radius:16px 16px 0 0;padding:36px 40px 32px;">
      <p style="margin:0 0 6px;font-size:20px;font-weight:800;letter-spacing:0.12em;color:#ffffff;text-transform:uppercase;">
        GENWEBZY
      </p>
      <p style="margin:0;font-size:10px;font-weight:600;letter-spacing:0.25em;color:rgba(255,255,255,0.35);text-transform:uppercase;">
        Building Websites That Work
      </p>
    </td>
  </tr>

  <!-- ══ HERO ══════════════════════════════════════════════ -->
  <tr>
    <td style="background:linear-gradient(135deg,#6c63ff 0%,#8b5cf6 50%,#a78bfa 100%);padding:40px 40px 36px;">
      <p style="margin:0 0 8px;font-size:11px;font-weight:700;letter-spacing:0.25em;color:rgba(255,255,255,0.65);text-transform:uppercase;">Enquiry Confirmed</p>
      <p style="margin:0 0 16px;font-size:30px;font-weight:800;color:#ffffff;line-height:1.2;">
        We've received<br/>your enquiry.
      </p>
      <p style="margin:0;font-size:15px;color:rgba(255,255,255,0.8);line-height:1.6;">
        Hello ${firstName}, thank you for reaching out to Genwebzy. Our team will review your project requirements and get back to you shortly.
      </p>
    </td>
  </tr>

  <!-- ══ BODY ══════════════════════════════════════════════ -->
  <tr>
    <td style="background:#ffffff;padding:36px 40px 24px;">

      <!-- ─ What Happens Next ─────────────────────────── -->
      <p style="margin:0 0 8px;font-size:11px;font-weight:700;color:#6c63ff;letter-spacing:0.2em;text-transform:uppercase;">What Happens Next</p>
      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
        <tr>
          <td style="padding:12px 0;border-bottom:1px solid #f1f5f9;">
            <table cellpadding="0" cellspacing="0">
              <tr>
                <td style="background:#ede9fe;border-radius:50%;width:28px;height:28px;text-align:center;vertical-align:middle;">
                  <span style="font-size:12px;font-weight:800;color:#6c63ff;">1</span>
                </td>
                <td style="padding-left:14px;font-size:13px;color:#374151;line-height:1.5;">
                  We review your project requirements.
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding:12px 0;border-bottom:1px solid #f1f5f9;">
            <table cellpadding="0" cellspacing="0">
              <tr>
                <td style="background:#ede9fe;border-radius:50%;width:28px;height:28px;text-align:center;vertical-align:middle;">
                  <span style="font-size:12px;font-weight:800;color:#6c63ff;">2</span>
                </td>
                <td style="padding-left:14px;font-size:13px;color:#374151;line-height:1.5;">
                  We'll contact you to discuss the details — usually within 24 hours.
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding:12px 0;">
            <table cellpadding="0" cellspacing="0">
              <tr>
                <td style="background:#ede9fe;border-radius:50%;width:28px;height:28px;text-align:center;vertical-align:middle;">
                  <span style="font-size:12px;font-weight:800;color:#6c63ff;">3</span>
                </td>
                <td style="padding-left:14px;font-size:13px;color:#374151;line-height:1.5;">
                  We share a proposal and timeline tailored to your project.
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>

      <!-- ─ Project Summary ───────────────────────────── -->
      <p style="margin:0 0 14px;font-size:11px;font-weight:700;color:#374151;letter-spacing:0.15em;text-transform:uppercase;">Your Project Summary</p>
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border-radius:10px;border:1px solid #e2e8f0;margin-bottom:28px;">
        <tr>
          <td style="padding:20px 24px;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td width="50%" style="padding-bottom:14px;">
                  <p style="margin:0 0 3px;font-size:9px;font-weight:700;color:#94a3b8;letter-spacing:0.15em;text-transform:uppercase;">SERVICE</p>
                  <p style="margin:0;font-size:14px;font-weight:700;color:#0f172a;">${service}</p>
                </td>
                <td width="50%" style="padding-bottom:14px;">
                  <p style="margin:0 0 3px;font-size:9px;font-weight:700;color:#94a3b8;letter-spacing:0.15em;text-transform:uppercase;">BUDGET</p>
                  <p style="margin:0;font-size:14px;font-weight:700;color:#0f172a;">${budget}</p>
                </td>
              </tr>
              <tr>
                <td width="50%">
                  <p style="margin:0 0 3px;font-size:9px;font-weight:700;color:#94a3b8;letter-spacing:0.15em;text-transform:uppercase;">TIMELINE</p>
                  <p style="margin:0;font-size:13px;font-weight:500;color:#334155;">${timeline}</p>
                </td>
                <td width="50%">
                  <p style="margin:0 0 3px;font-size:9px;font-weight:700;color:#94a3b8;letter-spacing:0.15em;text-transform:uppercase;">PREFERRED START</p>
                  <p style="margin:0;font-size:13px;font-weight:500;color:#334155;">${start}</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>

      <!-- ─ CTA Buttons ──────────────────────────────── -->
      <table cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
        <tr>
          <td style="padding-right:12px;">
            <a href="${clientWaLink}"
               style="display:inline-block;background:#128c7e;color:#ffffff;font-size:13px;font-weight:700;text-decoration:none;padding:14px 24px;border-radius:8px;">
              💬 Chat with Genwebzy on WhatsApp
            </a>
          </td>
          <td>
            <a href="${CONFIG.WEBSITE}"
               style="display:inline-block;background:#f1f5f9;border:1px solid #e2e8f0;color:#374151;font-size:13px;font-weight:600;text-decoration:none;padding:14px 24px;border-radius:8px;">
              🌐 Visit Genwebzy
            </a>
          </td>
        </tr>
      </table>

      <p style="margin:0;font-size:13px;color:#64748b;line-height:1.7;">
        If you have any immediate questions, feel free to reply to this email or reach out to us on WhatsApp.<br/><br/>
        Warm regards,<br/>
        <strong style="color:#0f172a;">The Genwebzy Team</strong>
      </p>
    </td>
  </tr>

  <!-- ══ FOOTER ═══════════════════════════════════════════ -->
  <tr>
    <td style="background:#0f0f1a;border-radius:0 0 16px 16px;padding:20px 40px;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td>
            <p style="margin:0;font-size:12px;font-weight:800;letter-spacing:0.15em;color:#6c63ff;text-transform:uppercase;">GENWEBZY</p>
            <p style="margin:4px 0 0;font-size:10px;color:#334155;">Building Websites That Work</p>
            <p style="margin:6px 0 0;font-size:9px;color:#1e293b;line-height:1.5;">Genwebzy, Tamil Nadu, India<br/>contact.genwebzy@gmail.com</p>
          </td>
          <td align="right">
            <a href="${CONFIG.WEBSITE}" style="font-size:10px;color:#475569;text-decoration:none;">${CONFIG.WEBSITE}</a><br/>
            <a href="mailto:${CONFIG.OWNER_EMAIL}" style="font-size:10px;color:#475569;text-decoration:none;">${CONFIG.OWNER_EMAIL}</a>
          </td>
        </tr>
      </table>
    </td>
  </tr>

</table>
</td></tr>
</table>
</body>
</html>`;
}

// ── REVIEW THANK YOU EMAIL ───────────────────────────────────────

/**
 * Send a premium thank you email to the client for their review.
 * @param {Object} data    — sanitized review data
 */
function sendReviewThankYouEmail(data) {
  const subject      = "Thank you for your review! — " + CONFIG.COMPANY_NAME;
  const htmlBody     = buildReviewEmailHtml(data);
  const firstName    = data.name.split(" ")[0];

  const plainBody = [
    "Hello " + firstName + ",",
    "",
    "Thank you so much for taking the time to leave a review for Genwebzy! We truly appreciate your feedback.",
    "",
    "You rated us: " + data.rating + " / 5 stars",
    "Your review: \"" + data.review + "\"",
    "",
    "Your support means the world to us and helps us continue to build better websites.",
    "",
    "Visit our website: " + CONFIG.WEBSITE,
    "",
    "Warm regards,",
    "The Genwebzy Team",
    CONFIG.OWNER_EMAIL,
  ].join("\n");

  GmailApp.sendEmail(data.email, subject, plainBody, {
    htmlBody:  htmlBody,
    replyTo:   CONFIG.OWNER_EMAIL,
    name:      CONFIG.COMPANY_NAME,
  });

  Logger.log("Review thank you email sent to: " + data.email);
}

/**
 * Build the HTML email for the review thank you.
 */
function buildReviewEmailHtml(data) {
  const firstName = escapeHtml(data.name.split(" ")[0]);
  const rating    = data.rating;
  const reviewMsg = escapeHtml(data.review);
  
  let stars = "";
  for (let i = 0; i < 5; i++) {
    stars += i < rating ? "★ " : "☆ ";
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Thank You For Your Review!</title>
</head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:32px 16px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

  <!-- ══ HEADER ════════════════════════════════════════════ -->
  <tr>
    <td style="background:#0f0f1a;border-radius:16px 16px 0 0;padding:36px 40px 32px;">
      <p style="margin:0 0 6px;font-size:20px;font-weight:800;letter-spacing:0.12em;color:#ffffff;text-transform:uppercase;">
        GENWEBZY
      </p>
      <p style="margin:0;font-size:10px;font-weight:600;letter-spacing:0.25em;color:rgba(255,255,255,0.35);text-transform:uppercase;">
        Building Websites That Work
      </p>
    </td>
  </tr>

  <!-- ══ HERO ══════════════════════════════════════════════ -->
  <tr>
    <td style="background:linear-gradient(135deg,#6c63ff 0%,#8b5cf6 50%,#a78bfa 100%);padding:40px 40px 36px;">
      <p style="margin:0 0 8px;font-size:11px;font-weight:700;letter-spacing:0.25em;color:rgba(255,255,255,0.65);text-transform:uppercase;">Feedback Received</p>
      <p style="margin:0 0 16px;font-size:30px;font-weight:800;color:#ffffff;line-height:1.2;">
        Thank you for<br/>your review!
      </p>
      <p style="margin:0;font-size:15px;color:rgba(255,255,255,0.8);line-height:1.6;">
        Hello \${firstName}, we truly appreciate you taking the time to share your experience with Genwebzy.
      </p>
    </td>
  </tr>

  <!-- ══ BODY ══════════════════════════════════════════════ -->
  <tr>
    <td style="background:#ffffff;padding:36px 40px 24px;">

      <p style="margin:0 0 14px;font-size:11px;font-weight:700;color:#374151;letter-spacing:0.15em;text-transform:uppercase;">Your Feedback</p>
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border-radius:10px;border:1px solid #e2e8f0;margin-bottom:28px;">
        <tr>
          <td style="padding:20px 24px;">
            <p style="margin:0 0 10px;font-size:14px;font-weight:700;color:#0f172a;">Rating: <span style="color:#fbbf24;letter-spacing:2px;font-size:18px;">\${stars}</span></p>
            <p style="margin:0;font-size:14px;color:#334155;line-height:1.6;font-style:italic;">"\${reviewMsg}"</p>
          </td>
        </tr>
      </table>

      <p style="margin:0;font-size:14px;color:#374151;line-height:1.7;margin-bottom:24px;">
        Your support means the world to us and helps us continue to build better websites. If you ever need anything else, we are always here to help.
      </p>

      <table cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
        <tr>
          <td>
            <a href="\${CONFIG.WEBSITE}"
               style="display:inline-block;background:#6c63ff;color:#ffffff;font-size:13px;font-weight:700;text-decoration:none;padding:14px 24px;border-radius:8px;">
              🌐 Visit Genwebzy
            </a>
          </td>
        </tr>
      </table>

      <p style="margin:0;font-size:13px;color:#64748b;line-height:1.7;">
        Warm regards,<br/>
        <strong style="color:#0f172a;">The Genwebzy Team</strong>
      </p>
    </td>
  </tr>

  <!-- ══ FOOTER ═══════════════════════════════════════════ -->
  <tr>
    <td style="background:#0f0f1a;border-radius:0 0 16px 16px;padding:20px 40px;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td>
            <p style="margin:0;font-size:12px;font-weight:800;letter-spacing:0.15em;color:#6c63ff;text-transform:uppercase;">GENWEBZY</p>
            <p style="margin:4px 0 0;font-size:10px;color:#334155;">Building Websites That Work</p>
            <p style="margin:6px 0 0;font-size:9px;color:#1e293b;line-height:1.5;">Genwebzy, Tamil Nadu, India<br/>contact.genwebzy@gmail.com</p>
          </td>
          <td align="right">
            <a href="\${CONFIG.WEBSITE}" style="font-size:10px;color:#475569;text-decoration:none;">\${CONFIG.WEBSITE}</a><br/>
            <a href="mailto:\${CONFIG.OWNER_EMAIL}" style="font-size:10px;color:#475569;text-decoration:none;">\${CONFIG.OWNER_EMAIL}</a>
          </td>
        </tr>
      </table>
    </td>
  </tr>

</table>
</td></tr>
</table>
</body>
</html>`;
}
