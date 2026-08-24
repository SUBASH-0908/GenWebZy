// ============================================================
// GENWEBZY CRM — FORMATTING.gs
// Sheet visual styling — headers, rows, status colours.
// ============================================================

/**
 * Style the header row with a dark premium look.
 * @param {GoogleAppsScript.Spreadsheet.Sheet} sheet
 * @param {number} numCols
 */
function styleHeaderRow(sheet, numCols) {
  const header = sheet.getRange(1, 1, 1, numCols);
  header
    .setBackground("#0f172a")
    .setFontColor("#e2e8f0")
    .setFontWeight("bold")
    .setFontSize(10)
    .setFontFamily("Google Sans")
    .setVerticalAlignment("middle")
    .setHorizontalAlignment("center")
    .setWrap(true);

  sheet.setRowHeight(1, 40);
}

/**
 * Set column widths for the Enquiries CRM sheet.
 * @param {GoogleAppsScript.Spreadsheet.Sheet} sheet
 */
function setColumnWidths(sheet) {
  const widths = {
    1:  140,  // Timestamp
    2:  160,  // Name
    3:  200,  // Email
    4:  130,  // Phone
    5:  160,  // Company
    6:  160,  // Service
    7:  140,  // Budget
    8:  120,  // Timeline
    9:  130,  // Start Date
    10: 280,  // Message
    11: 110,  // Status
    12: 130,  // Source
    13: 140,  // WhatsApp
    14: 200,  // Notes
  };
  for (const [col, width] of Object.entries(widths)) {
    sheet.setColumnWidth(parseInt(col, 10), width);
  }
}

/**
 * Apply alternating row colour and cell formatting to a data row.
 * @param {GoogleAppsScript.Spreadsheet.Sheet} sheet
 * @param {number} rowNumber
 * @param {Object} data
 */
function styleDataRow(sheet, rowNumber, data) {
  const isEven = rowNumber % 2 === 0;
  const bg     = isEven ? "#f8fafc" : "#ffffff";
  const numCols = CONFIG.CRM_HEADERS.length;

  const range = sheet.getRange(rowNumber, 1, 1, numCols);
  range
    .setBackground(bg)
    .setFontColor("#0f172a")
    .setFontSize(9)
    .setVerticalAlignment("top")
    .setWrap(true);

  sheet.setRowHeight(rowNumber, 60);

  // Borders
  range.setBorder(
    true, true, true, true, false, false,
    "#e2e8f0",
    SpreadsheetApp.BorderStyle.SOLID
  );

  // Style status cell immediately
  const statusCell = sheet.getRange(rowNumber, 11);
  colorStatusCell(statusCell, "New");

  // Bold the Name cell
  sheet.getRange(rowNumber, 2).setFontWeight("bold");

  // Email — clickable style
  sheet.getRange(rowNumber, 3).setFontColor("#3b82f6");

  // Message cell — slightly muted
  sheet.getRange(rowNumber, 10).setFontColor("#475569");
}

/**
 * Apply background/text colour to a Status cell based on the status value.
 * @param {GoogleAppsScript.Spreadsheet.Range} cell
 * @param {string} status
 */
function colorStatusCell(cell, status) {
  const colours = CONFIG.STATUS_COLORS[status];
  if (!colours) return;

  cell
    .setBackground(colours.bg)
    .setFontColor(colours.text)
    .setFontWeight("bold")
    .setHorizontalAlignment("center")
    .setFontSize(9);
}
