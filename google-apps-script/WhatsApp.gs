// ============================================================
// GENWEBZY CRM — WHATSAPP.gs
// WhatsApp link generation.
// ============================================================

/**
 * Generate a WhatsApp wa.me link for the owner to contact the client.
 * @param {Object} data  — sanitized form data
 * @returns {string}     — wa.me URL
 */
function generateWhatsAppLink(data) {
  const phone = cleanPhone(data.phone);

  const name    = escapeHtml(data.name);
  const service = escapeHtml(data.service);
  const company = data.company ? " from " + escapeHtml(data.company) : "";

  const message =
    "Hi " + name + company + ", this is the " + CONFIG.COMPANY_NAME + " team.\n\n" +
    "Thank you for reaching out regarding your *" + service + "* project! \uD83D\uDE80\n\n" +
    "We've received your enquiry and would love to discuss your requirements. " +
    "When would be a good time for a quick call or chat?";

  return "https://wa.me/" + phone + "?text=" + encodeURIComponent(message);
}

/**
 * Generate a WhatsApp link that the client can use to contact Genwebzy.
 * @param {Object} data  — sanitized form data
 * @returns {string}     — wa.me URL pointing to owner number
 */
function generateClientToOwnerWhatsApp(data) {
  const name    = escapeHtml(data.name);
  const service = escapeHtml(data.service);

  const message =
    "Hi " + CONFIG.COMPANY_NAME + ", I'm " + name + " and I recently submitted an enquiry " +
    "for a *" + service + "* project. I'd like to discuss further.";

  return "https://wa.me/" + CONFIG.OWNER_PHONE + "?text=" + encodeURIComponent(message);
}
