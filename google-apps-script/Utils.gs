// ============================================================
// GENWEBZY CRM — UTILS.gs
// Shared utility functions used across the project.
// ============================================================

/**
 * Escape HTML special characters to prevent XSS in email bodies.
 * @param {string} str
 * @returns {string}
 */
function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g,  "&amp;")
    .replace(/</g,  "&lt;")
    .replace(/>/g,  "&gt;")
    .replace(/"/g,  "&quot;")
    .replace(/'/g,  "&#39;");
}

/**
 * Sanitize a plain string — strip leading/trailing whitespace, limit length.
 * @param {string} str
 * @param {number} maxLen
 * @returns {string}
 */
function sanitize(str, maxLen) {
  maxLen = maxLen || 500;
  if (!str) return "";
  return String(str).trim().substring(0, maxLen);
}

/**
 * Validate an email address format.
 * @param {string} email
 * @returns {boolean}
 */
function isValidEmail(email) {
  if (!email) return false;
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).trim());
}

/**
 * Strip all non-digit characters from a phone number and return digits only.
 * @param {string} phone
 * @returns {string}
 */
function cleanPhone(phone) {
  if (!phone) return "";
  return String(phone).replace(/\D/g, "");
}

/**
 * Return the current IST timestamp string.
 * @returns {string}
 */
function nowIST() {
  const now = new Date();
  // Apps Script uses the script's timezone; set timezone to IST in project settings.
  return Utilities.formatDate(now, "Asia/Kolkata", "dd-MM-yyyy HH:mm:ss");
}

/**
 * Return a formatted date string for display.
 * @returns {string}
 */
function formattedDateTime() {
  const now = new Date();
  return Utilities.formatDate(now, "Asia/Kolkata", "MMMM dd, yyyy 'at' hh:mm a z");
}

/**
 * Parse the POST request body. Supports both JSON and URL-encoded form data.
 * @param {GoogleAppsScript.Events.DoPost} e
 * @returns {Object}
 */
function parsePostData(e) {
  try {
    // Priority 1: URL-encoded form data (no-cors mode from browser)
    // Apps Script automatically parses this into e.parameter
    if (e.parameter && Object.keys(e.parameter).length > 0) {
      return e.parameter;
    }
    // Priority 2: JSON body (direct API calls / testing)
    if (e.postData && e.postData.type === "application/json") {
      return JSON.parse(e.postData.contents);
    }
    // Priority 3: Raw body fallback
    if (e.postData && e.postData.contents) {
      return JSON.parse(e.postData.contents);
    }
  } catch (err) {
    Logger.log("parsePostData error: " + err.message);
  }
  return {};
}

/**
 * Return a JSON response with CORS headers.
 * @param {Object} data
 * @returns {GoogleAppsScript.Content.TextOutput}
 */
function jsonResponse(data) {
  const output = ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
  return output;
}

/**
 * Validate submitted form fields. Returns { valid: bool, errors: [] }.
 * @param {Object} data
 * @returns {{ valid: boolean, errors: string[] }}
 */
function validateSubmission(data) {
  const errors = [];

  if (!sanitize(data.name, 100)) {
    errors.push("Full Name is required.");
  }
  if (!isValidEmail(data.email)) {
    errors.push("A valid Email address is required.");
  }
  if (!sanitize(data.phone, 20)) {
    errors.push("Phone / WhatsApp number is required.");
  }
  if (!sanitize(data.service, 100)) {
    errors.push("Service selection is required.");
  }

  return { valid: errors.length === 0, errors: errors };
}

/**
 * Acquire a script-wide lock. Returns the lock object or null.
 * Use to prevent parallel/double submissions.
 * @returns {GoogleAppsScript.Lock.Lock|null}
 */
function acquireLock() {
  try {
    const lock = LockService.getScriptLock();
    lock.waitLock(10000); // Wait up to 10 seconds
    return lock;
  } catch (e) {
    Logger.log("Lock acquisition failed: " + e.message);
    return null;
  }
}

/**
 * Release a previously acquired lock.
 * @param {GoogleAppsScript.Lock.Lock} lock
 */
function releaseLock(lock) {
  try {
    if (lock) lock.releaseLock();
  } catch (e) {
    Logger.log("Lock release error: " + e.message);
  }
}

/**
 * Check if a submission is a duplicate of a recent one.
 * Uses PropertiesService to store a hash of recent submissions.
 * @param {Object} data
 * @returns {boolean}
 */
function isDuplicateSubmission(data) {
  try {
    const key = [
      sanitize(data.email, 100).toLowerCase(),
      sanitize(data.name, 100).toLowerCase(),
      sanitize(data.service, 100)
    ].join("|");

    const props  = PropertiesService.getScriptProperties();
    const stored = props.getProperty("LAST_SUB_" + Utilities.computeDigest(
      Utilities.DigestAlgorithm.MD5, key
    ).toString());

    if (stored) {
      const lastTime = parseInt(stored, 10);
      const now      = Date.now();
      if (now - lastTime < CONFIG.DEDUPE_WINDOW_SECONDS * 1000) {
        return true;
      }
    }

    // Store this submission timestamp
    props.setProperty(
      "LAST_SUB_" + Utilities.computeDigest(
        Utilities.DigestAlgorithm.MD5, key
      ).toString(),
      Date.now().toString()
    );
    return false;
  } catch (e) {
    Logger.log("Dedupe check error: " + e.message);
    return false;
  }
}
