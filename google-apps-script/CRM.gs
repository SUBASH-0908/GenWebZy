// ============================================================
// GENWEBZY CRM — CRM.gs
// Google Sheets CRM operations — setup, save, update.
// ============================================================

/**
 * Get or create the Genwebzy CRM spreadsheet.
 * Priority order:
 *   1. CONFIG.SPREADSHEET_ID (manually set)
 *   2. PropertiesService stored ID (auto-saved on first create)
 *   3. Create a brand new spreadsheet (first run only)
 * @returns {GoogleAppsScript.Spreadsheet.Spreadsheet}
 */
function getOrCreateSpreadsheet() {
  // ── Priority 1: Manually configured ID ──────────────────
  if (CONFIG.SPREADSHEET_ID && CONFIG.SPREADSHEET_ID.trim() !== "") {
    try {
      return SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID.trim());
    } catch (e) {
      Logger.log("Config SPREADSHEET_ID invalid, checking PropertiesService...");
    }
  }

  // ── Priority 2: Previously auto-created ID ───────────────
  const props   = PropertiesService.getScriptProperties();
  const savedId = props.getProperty("SPREADSHEET_ID");

  if (savedId) {
    try {
      return SpreadsheetApp.openById(savedId);
    } catch (e) {
      Logger.log("Saved SPREADSHEET_ID invalid, creating new spreadsheet...");
      props.deleteProperty("SPREADSHEET_ID"); // Clear bad ID
    }
  }

  // ── Priority 3: First run — create ONE spreadsheet ───────
  const ss = SpreadsheetApp.create("Genwebzy CRM — Enquiries");
  props.setProperty("SPREADSHEET_ID", ss.getId());
  Logger.log("✅ New spreadsheet created: " + ss.getUrl());
  Logger.log("📋 Spreadsheet ID saved: " + ss.getId());

  return ss;
}

/**
 * Find a sheet by name, creating it if it does not exist.
 * @param {GoogleAppsScript.Spreadsheet.Spreadsheet} ss
 * @param {string} name
 * @returns {GoogleAppsScript.Spreadsheet.Sheet}
 */
function findSheet(ss, name) {
  let sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
  }
  return sheet;
}

/**
 * Initialise the Enquiries sheet with headers and formatting if fresh.
 * @param {GoogleAppsScript.Spreadsheet.Sheet} sheet
 */
function initEnquiriesSheet(sheet) {
  if (sheet.getLastRow() === 0) {
    // Write headers
    const headers = CONFIG.CRM_HEADERS;
    sheet.appendRow(headers);
    styleHeaderRow(sheet, headers.length);
    setColumnWidths(sheet);
    sheet.setFrozenRows(1);
  }
}

/**
 * Save a new lead to the Enquiries sheet.
 * Returns the row number of the inserted lead.
 * @param {Object} data  — sanitized form data
 * @returns {number}     — row number inserted
 */
function saveLead(data) {
  const ss    = getOrCreateSpreadsheet();
  const sheet = findSheet(ss, CONFIG.SHEET_LEADS);
  initEnquiriesSheet(sheet);

  const timestamp = nowIST();

  const row = [
    timestamp,
    data.name,
    data.email,
    data.phone,
    data.company   || "—",
    data.service,
    data.budget    || "Not specified",
    data.timeline  || "Not specified",
    data.startDate || "Not specified",
    data.message   || "—",
    "New",                  // Status
    data.source,
    "",                     // WhatsApp Link (filled after)
    "",                     // Notes (manual field)
  ];

  sheet.appendRow(row);
  const newRow = sheet.getLastRow();

  // Apply alternating row styling
  styleDataRow(sheet, newRow, data);

  // Add status dropdown validation
  addStatusValidation(sheet, newRow);

  return newRow;
}

/**
 * Initialise the Reviews sheet with headers and formatting if fresh.
 * @param {GoogleAppsScript.Spreadsheet.Sheet} sheet
 */
function initReviewsSheet(sheet) {
  if (sheet.getLastRow() === 0) {
    const headers = CONFIG.REVIEW_HEADERS;
    sheet.appendRow(headers);
    styleHeaderRow(sheet, headers.length);
    setColumnWidths(sheet);
    sheet.setFrozenRows(1);
  }
}

/**
 * Save a new review to the Reviews sheet.
 * @param {Object} data  — sanitized form data
 * @returns {number}     — row number inserted
 */
function saveReview(data) {
  const ss    = getOrCreateSpreadsheet();
  const sheet = findSheet(ss, CONFIG.SHEET_REVIEWS);
  initReviewsSheet(sheet);

  const timestamp = nowIST();

  const row = [
    timestamp,
    data.name,
    data.email,
    data.company   || "—",
    data.service   || "—",
    data.rating,
    data.review,
    "Genwebzy Website"
  ];

  sheet.appendRow(row);
  const newRow = sheet.getLastRow();
  styleDataRow(sheet, newRow, data);

  return newRow;
}

/**
 * Update the WhatsApp link cell after row has been created.
 * @param {number} rowNumber
 * @param {string} waLink
 */
function updateWhatsAppInRow(rowNumber, waLink) {
  try {
    const ss    = getOrCreateSpreadsheet();
    const sheet = findSheet(ss, CONFIG.SHEET_LEADS);
    // Column 13 = WhatsApp Link
    const cell  = sheet.getRange(rowNumber, 13);
    cell.setValue(waLink);
    cell.setFormula('=HYPERLINK("' + waLink + '","Open WhatsApp")');
    cell.setFontColor("#4ade80");
  } catch (e) {
    Logger.log("updateWhatsAppInRow error: " + e.message);
  }
}

/**
 * Add data validation dropdown for the Status column (col 11) at a row.
 * @param {GoogleAppsScript.Spreadsheet.Sheet} sheet
 * @param {number} rowNumber
 */
function addStatusValidation(sheet, rowNumber) {
  const rule = SpreadsheetApp.newDataValidation()
    .requireValueInList(CONFIG.STATUS_OPTIONS, true)
    .setAllowInvalid(false)
    .build();
  sheet.getRange(rowNumber, 11).setDataValidation(rule);
}

/**
 * onEdit trigger — called when owner edits the sheet.
 * Refreshes status colour and dashboard on Status column edit.
 * @param {GoogleAppsScript.Events.SheetsOnEdit} e
 */
function onEdit(e) {
  try {
    const sheet = e.source.getActiveSheet();
    if (sheet.getName() !== CONFIG.SHEET_LEADS) return;

    const range = e.range;
    // Column 11 = Status
    if (range.getColumn() !== 11) return;

    const status = range.getValue();
    colorStatusCell(range, status);

    // Refresh dashboard in background
    try { updateDashboard(); } catch (dashErr) {
      Logger.log("Dashboard refresh error: " + dashErr.message);
    }
  } catch (err) {
    Logger.log("onEdit error: " + err.message);
  }
}

/**
 * Create the onEdit installable trigger. Run once manually.
 */
function createOnEditTrigger() {
  const triggers = ScriptApp.getProjectTriggers();
  for (const t of triggers) {
    if (t.getHandlerFunction() === "onEdit") return; // Already exists
  }
  ScriptApp.newTrigger("onEdit")
    .forSpreadsheet(getOrCreateSpreadsheet())
    .onEdit()
    .create();
}

/**
 * Get the CRM spreadsheet URL.
 * @returns {string}
 */
function getCRMUrl() {
  return getOrCreateSpreadsheet().getUrl();
}
