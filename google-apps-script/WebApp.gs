// ============================================================
// GENWEBZY CRM — WEBAPP.gs
// doGet() / doPost() entry points for the Web App.
// ============================================================

/**
 * Health-check endpoint.
 * GET  https://script.google.com/macros/s/<ID>/exec
 */
function doGet(e) {
  return jsonResponse({
    status:  "ok",
    service: CONFIG.COMPANY_NAME + " CRM API",
    version: "1.0.0",
    time:    nowIST(),
  });
}

/**
 * Main form submission endpoint.
 * POST https://script.google.com/macros/s/<ID>/exec
 */
function doPost(e) {
  const lock = acquireLock();
  if (!lock) {
    return jsonResponse({ success: false, message: "Server busy — please try again." });
  }

  try {
    // ── 1. PARSE ──────────────────────────────────────────
    const raw = parsePostData(e);

    // ── 2. SANITIZE ───────────────────────────────────────
    const data = {
      name:      sanitize(raw.name,      100),
      email:     sanitize(raw.email,     150),
      phone:     sanitize(raw.phone,      25),
      company:   sanitize(raw.company,   150),
      service:   sanitize(raw.service,   100),
      budget:    sanitize(raw.budget,    100),
      timeline:  sanitize(raw.timeline,  100),
      startDate: sanitize(raw.startDate, 100),
      message:   sanitize(raw.message,  2000),
      source:    "Genwebzy Website",
    };

    // ── 3. VALIDATE ───────────────────────────────────────
    const validation = validateSubmission(data);
    if (!validation.valid) {
      releaseLock(lock);
      return jsonResponse({ success: false, message: validation.errors.join(" ") });
    }

    // ── 4. DUPLICATE CHECK ────────────────────────────────
    if (isDuplicateSubmission(data)) {
      releaseLock(lock);
      return jsonResponse({
        success: true,
        message: "Enquiry received — thank you! We will be in touch soon.",
      });
    }

    // ── 5. SAVE TO SHEETS CRM ─────────────────────────────
    const row = saveLead(data);
    if (!row) throw new Error("Failed to save lead to CRM.");

    // ── 6. GENERATE WHATSAPP LINK ─────────────────────────
    const waLink = generateWhatsAppLink(data);

    // ── 7. UPDATE WHATSAPP LINK IN ROW ───────────────────
    updateWhatsAppInRow(row, waLink);

    // ── 8. SEND OWNER NOTIFICATION ────────────────────────
    sendOwnerNotification(data, waLink, row);

    // ── 9. SEND CLIENT CONFIRMATION ───────────────────────
    sendClientConfirmation(data, waLink);

    // ── 10. UPDATE DASHBOARD ──────────────────────────────
    try { updateDashboard(); } catch (dashErr) {
      Logger.log("Dashboard update error (non-fatal): " + dashErr.message);
    }

    releaseLock(lock);
    return jsonResponse({
      success: true,
      message: "Enquiry received successfully — we will be in touch within 24 hours.",
    });

  } catch (err) {
    Logger.log("doPost critical error: " + err.message + "\n" + err.stack);
    releaseLock(lock);
    return jsonResponse({
      success: false,
      message: "Unable to process enquiry at the moment. Please try again or contact us on WhatsApp.",
    });
  }
}
