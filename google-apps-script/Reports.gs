// ============================================================
// GENWEBZY CRM — REPORTS.gs
// Monthly report, weekly report, PDF export, email delivery.
// ============================================================

// ── MONTHLY REPORT ────────────────────────────────────────────

/**
 * Build the Monthly Report sheet and return its name.
 * @returns {string} sheet name
 */
function generateMonthlyReport() {
  const ss      = getOrCreateSpreadsheet();
  const now     = new Date();
  const month   = Utilities.formatDate(now, "Asia/Kolkata", "MMMM yyyy");
  const sheetName = "Report — " + month;

  // Remove existing report sheet for this month if present
  const existing = ss.getSheetByName(sheetName);
  if (existing) ss.deleteSheet(existing);

  const sheet = ss.insertSheet(sheetName);

  // Collect lead data for current month
  const leadsData = getLeadsForPeriod("month");
  buildReportSheet(sheet, "Monthly Report", month, leadsData, now);

  Logger.log("Monthly report generated: " + sheetName);
  return sheetName;
}

/**
 * Build the Weekly Report sheet and return its name.
 * @returns {string} sheet name
 */
function generateWeeklyReport() {
  const ss    = getOrCreateSpreadsheet();
  const now   = new Date();

  // Get week start (Monday)
  const day     = now.getDay();
  const diff    = day === 0 ? -6 : 1 - day;
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() + diff);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);

  const wStart  = Utilities.formatDate(weekStart, "Asia/Kolkata", "dd MMM");
  const wEnd    = Utilities.formatDate(weekEnd,   "Asia/Kolkata", "dd MMM yyyy");
  const label   = wStart + " – " + wEnd;
  const sheetName = "Report — Week " + wStart;

  const existing = ss.getSheetByName(sheetName);
  if (existing) ss.deleteSheet(existing);

  const sheet = ss.insertSheet(sheetName);
  const leadsData = getLeadsForPeriod("week");
  buildReportSheet(sheet, "Weekly Report", label, leadsData, now);

  Logger.log("Weekly report generated: " + sheetName);
  return sheetName;
}

// ── REPORT SHEET BUILDER ──────────────────────────────────────

/**
 * Build a styled report sheet.
 * @param {GoogleAppsScript.Spreadsheet.Sheet} sheet
 * @param {string} reportType  "Monthly Report" | "Weekly Report"
 * @param {string} period      e.g. "August 2026" or "18 Aug – 24 Aug 2026"
 * @param {Array[]} leads      filtered lead rows
 * @param {Date}   generated   timestamp
 */
function buildReportSheet(sheet, reportType, period, leads, generated) {
  const genDate = Utilities.formatDate(generated, "Asia/Kolkata", "dd MMM yyyy 'at' hh:mm a");

  // ── Title block ──────────────────────────────────────────
  sheet.getRange("A1:N1").merge()
    .setValue("GENWEBZY")
    .setBackground("#0f172a")
    .setFontColor("#6c63ff")
    .setFontWeight("bold")
    .setFontSize(18)
    .setFontFamily("Google Sans")
    .setHorizontalAlignment("center")
    .setVerticalAlignment("middle");
  sheet.setRowHeight(1, 52);

  sheet.getRange("A2:N2").merge()
    .setValue(reportType.toUpperCase() + "  |  " + period)
    .setBackground("#111827")
    .setFontColor("#a78bfa")
    .setFontWeight("bold")
    .setFontSize(12)
    .setHorizontalAlignment("center")
    .setVerticalAlignment("middle");
  sheet.setRowHeight(2, 36);

  sheet.getRange("A3:N3").merge()
    .setValue("Generated: " + genDate + "  |  contact.genwebzy@gmail.com  |  gen-web-zy.vercel.app")
    .setBackground("#111827")
    .setFontColor("#475569")
    .setFontSize(9)
    .setHorizontalAlignment("center");
  sheet.setRowHeight(3, 24);

  // ── KPI row ───────────────────────────────────────────────
  const kpi = computeKPIsFromRows(leads);
  sheet.setRowHeight(4, 20); // spacer

  const kpiLabels = ["TOTAL LEADS","NEW","CONTACTED","QUALIFIED","PROPOSALS","WON","LOST","CONVERSION"];
  const kpiValues = [
    kpi.total, kpi.newLeads, kpi.contacted, kpi.qualified,
    kpi.proposals, kpi.won, kpi.lost, kpi.conversion
  ];
  const kpiColors = ["#3b82f6","#60a5fa","#4ade80","#a78bfa","#fbbf24","#22c55e","#f87171","#6c63ff"];

  for (let i = 0; i < 8; i++) {
    sheet.getRange(5, i + 1)
      .setValue(kpiLabels[i])
      .setBackground("#111827")
      .setFontColor("#64748b")
      .setFontSize(8)
      .setFontWeight("bold")
      .setHorizontalAlignment("center")
      .setVerticalAlignment("bottom");
    sheet.setRowHeight(5, 32);

    sheet.getRange(6, i + 1)
      .setValue(kpiValues[i])
      .setBackground("#111827")
      .setFontColor(kpiColors[i])
      .setFontSize(20)
      .setFontWeight("bold")
      .setHorizontalAlignment("center")
      .setVerticalAlignment("top");
    sheet.setRowHeight(6, 38);

    sheet.getRange(7, i + 1)
      .setBackground("#111827")
      .setBorder(false, false, true, false, false, false,
        kpiColors[i], SpreadsheetApp.BorderStyle.SOLID_THICK);
    sheet.setRowHeight(7, 10);
  }

  sheet.setRowHeight(8, 20); // spacer

  // ── Leads table header ────────────────────────────────────
  const tableHeaders = ["DATE","NAME","EMAIL","PHONE","COMPANY","SERVICE","BUDGET","TIMELINE","START DATE","MESSAGE","STATUS","SOURCE","WHATSAPP"];
  const hdrRow = sheet.getRange(9, 1, 1, tableHeaders.length);
  hdrRow.setValues([tableHeaders])
    .setBackground("#0f172a")
    .setFontColor("#94a3b8")
    .setFontWeight("bold")
    .setFontSize(8)
    .setHorizontalAlignment("center")
    .setVerticalAlignment("middle");
  sheet.setRowHeight(9, 30);

  // ── Lead rows ─────────────────────────────────────────────
  if (leads.length === 0) {
    sheet.getRange(10, 1, 1, tableHeaders.length).merge()
      .setValue("No leads found for this period.")
      .setBackground("#111827")
      .setFontColor("#475569")
      .setFontSize(10)
      .setHorizontalAlignment("center")
      .setVerticalAlignment("middle");
    sheet.setRowHeight(10, 40);
  } else {
    for (let i = 0; i < leads.length; i++) {
      const row    = leads[i];
      const r      = 10 + i;
      const status = String(row[10] || "New").trim();
      const bg     = i % 2 === 0 ? "#0a0f1e" : "#0f172a";

      const rowData = [
        String(row[0]).split(" ")[0],  // Date only
        row[1], row[2], row[3], row[4] || "—",
        row[5], row[6] || "—", row[7] || "—",
        row[8] || "—",
        String(row[9] || "—").substring(0, 60) + (String(row[9]).length > 60 ? "…" : ""),
        status, row[11] || "—", "WhatsApp"
      ];

      const range = sheet.getRange(r, 1, 1, rowData.length);
      range.setValues([rowData])
        .setBackground(bg)
        .setFontColor("#e2e8f0")
        .setFontSize(8)
        .setVerticalAlignment("middle")
        .setWrap(false);
      sheet.setRowHeight(r, 26);

      // Status cell color
      const sc = CONFIG.STATUS_COLORS[status] || { bg: "#1e293b", text: "#94a3b8" };
      sheet.getRange(r, 11)
        .setBackground(sc.bg)
        .setFontColor(sc.text)
        .setFontWeight("bold")
        .setHorizontalAlignment("center");
    }
  }

  // ── Service breakdown table ───────────────────────────────
  const nextRow = 11 + leads.length + 1;
  buildServiceBreakdown(sheet, nextRow, leads);

  // ── Status breakdown table ────────────────────────────────
  buildStatusBreakdown(sheet, nextRow, leads, 10);

  // ── Column widths ─────────────────────────────────────────
  const colWidths = [90,120,160,110,130,140,120,100,100,200,100,110,90];
  colWidths.forEach((w, i) => sheet.setColumnWidth(i + 1, w));

  // ── Tab styling ───────────────────────────────────────────
  sheet.setTabColor("#6c63ff");
  sheet.setFrozenRows(9);
  SpreadsheetApp.flush();
}

/**
 * Service breakdown table in the report.
 */
function buildServiceBreakdown(sheet, startRow, leads) {
  sheet.setRowHeight(startRow, 20);
  const r = startRow + 1;

  sheet.getRange(r, 1, 1, 4).merge()
    .setValue("SERVICE BREAKDOWN")
    .setBackground("#0f172a")
    .setFontColor("#a78bfa")
    .setFontWeight("bold")
    .setFontSize(9)
    .setHorizontalAlignment("left")
    .setVerticalAlignment("middle");
  sheet.setRowHeight(r, 28);

  const counts = {};
  leads.forEach(row => {
    const svc = String(row[5] || "Other").trim();
    counts[svc] = (counts[svc] || 0) + 1;
  });

  let row = r + 1;
  const total = leads.length || 1;
  for (const [svc, cnt] of Object.entries(counts)) {
    const bg = row % 2 === 0 ? "#111827" : "#0f172a";
    sheet.getRange(row, 1).setValue(svc).setBackground(bg).setFontColor("#e2e8f0").setFontSize(9);
    sheet.getRange(row, 2).setValue(cnt).setBackground(bg).setFontColor("#60a5fa").setFontWeight("bold").setFontSize(9).setHorizontalAlignment("center");
    sheet.getRange(row, 3).setValue(((cnt/total)*100).toFixed(1) + "%").setBackground(bg).setFontColor("#94a3b8").setFontSize(9).setHorizontalAlignment("center");
    sheet.setRowHeight(row, 22);
    row++;
  }
}

/**
 * Status breakdown table in the report.
 */
function buildStatusBreakdown(sheet, startRow, leads, colOffset) {
  const r = startRow + 1;

  sheet.getRange(r, colOffset + 1, 1, 4).merge()
    .setValue("STATUS BREAKDOWN")
    .setBackground("#0f172a")
    .setFontColor("#a78bfa")
    .setFontWeight("bold")
    .setFontSize(9);
  sheet.setRowHeight(r, 28);

  let row = r + 1;
  for (const status of CONFIG.STATUS_OPTIONS) {
    const cnt = leads.filter(l => String(l[10]).trim() === status).length;
    const sc  = CONFIG.STATUS_COLORS[status] || { bg: "#1e293b", text: "#94a3b8" };
    const bg  = row % 2 === 0 ? "#111827" : "#0f172a";

    sheet.getRange(row, colOffset + 1).setValue(status).setBackground(sc.bg).setFontColor(sc.text).setFontSize(9).setFontWeight("bold").setHorizontalAlignment("center");
    sheet.getRange(row, colOffset + 2).setValue(cnt).setBackground(bg).setFontColor("#e2e8f0").setFontSize(9).setHorizontalAlignment("center");
    sheet.setRowHeight(row, 22);
    row++;
  }
}

// ── DATA FILTERS ──────────────────────────────────────────────

/**
 * Get lead rows filtered to the current month or week.
 * @param {"month"|"week"} period
 * @returns {Array[]}
 */
function getLeadsForPeriod(period) {
  const ss      = getOrCreateSpreadsheet();
  const leads   = findSheet(ss, CONFIG.SHEET_LEADS);
  const lastRow = leads.getLastRow();
  if (lastRow <= 1) return [];

  const allRows = leads.getRange(2, 1, lastRow - 1, CONFIG.CRM_HEADERS.length).getValues();
  const now     = new Date();

  return allRows.filter(row => {
    const ts = String(row[0] || "");
    try {
      const parts = ts.split(" ")[0].split("-"); // dd-MM-yyyy
      if (parts.length < 3) return false;
      const d = new Date(parts[2], parseInt(parts[1], 10) - 1, parseInt(parts[0], 10));

      if (period === "month") {
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
      }
      if (period === "week") {
        const startOfWeek = new Date(now);
        const day = now.getDay();
        startOfWeek.setDate(now.getDate() - (day === 0 ? 6 : day - 1));
        startOfWeek.setHours(0, 0, 0, 0);
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        endOfWeek.setHours(23, 59, 59, 999);
        return d >= startOfWeek && d <= endOfWeek;
      }
    } catch (e) { /* skip */ }
    return false;
  });
}

/**
 * Compute KPI metrics from a set of lead rows.
 * @param {Array[]} rows
 * @returns {Object}
 */
function computeKPIsFromRows(rows) {
  let newLeads=0, contacted=0, qualified=0, proposals=0, won=0, lost=0;
  rows.forEach(row => {
    const s = String(row[10] || "").trim();
    if (s === "New")           newLeads++;
    if (s === "Contacted")     contacted++;
    if (s === "Qualified")     qualified++;
    if (s === "Proposal Sent") proposals++;
    if (s === "Won")           won++;
    if (s === "Lost")          lost++;
  });
  const total = rows.length;
  return {
    total, newLeads, contacted, qualified, proposals, won, lost,
    conversion: total > 0 ? ((won / total) * 100).toFixed(1) + "%" : "0%"
  };
}

// ── PDF EXPORT ────────────────────────────────────────────────

/**
 * Export a named sheet as a PDF blob.
 * @param {string} sheetName
 * @returns {Blob}
 */
function exportSheetAsPdf(sheetName) {
  const ss      = getOrCreateSpreadsheet();
  const sheet   = ss.getSheetByName(sheetName);
  if (!sheet) throw new Error("Sheet not found: " + sheetName);

  const ssId    = ss.getId();
  const sheetId = sheet.getSheetId();

  const url =
    "https://docs.google.com/spreadsheets/d/" + ssId + "/export?" +
    "exportFormat=pdf&format=pdf" +
    "&size=A4&portrait=false&fitw=true" +
    "&sheetnames=false&printtitle=false&pagenumbers=false" +
    "&gridlines=false&fzr=false" +
    "&gid=" + sheetId;

  const token    = ScriptApp.getOAuthToken();
  const response = UrlFetchApp.fetch(url, {
    headers: { "Authorization": "Bearer " + token },
    muteHttpExceptions: true,
  });

  if (response.getResponseCode() !== 200) {
    throw new Error("PDF export failed: " + response.getContentText());
  }

  return response.getBlob().setName(sheetName + ".pdf");
}

// ── EMAIL REPORT DELIVERY ─────────────────────────────────────

/**
 * Generate monthly report sheet + export PDF + email to owner.
 */
function emailMonthlyReport() {
  try {
    const sheetName = generateMonthlyReport();
    const pdf       = exportSheetAsPdf(sheetName);
    const now       = Utilities.formatDate(new Date(), "Asia/Kolkata", "MMMM yyyy");

    MailApp.sendEmail({
      to:          CONFIG.OWNER_EMAIL,
      subject:     "Genwebzy Monthly Report — " + now,
      htmlBody:    buildReportEmailHtml("Monthly Report", now, pdf.getName()),
      attachments: [pdf],
    });

    Logger.log("✅ Monthly report emailed: " + sheetName);
  } catch (err) {
    Logger.log("❌ Monthly report error: " + err.message);
  }
}

/**
 * Generate weekly report sheet + export PDF + email to owner.
 */
function emailWeeklyReport() {
  try {
    const sheetName = generateWeeklyReport();
    const pdf       = exportSheetAsPdf(sheetName);
    const now       = Utilities.formatDate(new Date(), "Asia/Kolkata", "dd MMM yyyy");

    MailApp.sendEmail({
      to:          CONFIG.OWNER_EMAIL,
      subject:     "Genwebzy Weekly Report — w/e " + now,
      htmlBody:    buildReportEmailHtml("Weekly Report", "Week ending " + now, pdf.getName()),
      attachments: [pdf],
    });

    Logger.log("✅ Weekly report emailed: " + sheetName);
  } catch (err) {
    Logger.log("❌ Weekly report error: " + err.message);
  }
}

/**
 * Simple HTML email body for report delivery.
 */
function buildReportEmailHtml(type, period, filename) {
  return `<!DOCTYPE html>
<html><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:32px 16px;">
<tr><td align="center">
<table width="540" cellpadding="0" cellspacing="0" style="max-width:540px;width:100%;">
  <tr><td style="background:#0f172a;border-radius:12px 12px 0 0;padding:28px 32px;">
    <p style="margin:0;font-size:18px;font-weight:800;letter-spacing:0.12em;color:#6c63ff;text-transform:uppercase;">GENWEBZY</p>
    <p style="margin:4px 0 0;font-size:10px;color:rgba(255,255,255,0.3);letter-spacing:0.2em;text-transform:uppercase;">${type}</p>
  </td></tr>
  <tr><td style="background:linear-gradient(135deg,#6c63ff,#a78bfa);padding:28px 32px;">
    <p style="margin:0 0 6px;font-size:11px;color:rgba(255,255,255,0.65);font-weight:600;letter-spacing:0.15em;text-transform:uppercase;">Period</p>
    <p style="margin:0;font-size:22px;font-weight:800;color:#fff;">${period}</p>
  </td></tr>
  <tr><td style="background:#fff;padding:28px 32px;">
    <p style="margin:0 0 16px;font-size:14px;color:#374151;line-height:1.6;">
      Your <strong>${type}</strong> for <strong>${period}</strong> is attached as a PDF.<br/>
      Open it to view your lead summary, KPIs, and service breakdown.
    </p>
    <p style="margin:0;font-size:12px;color:#94a3b8;">📎 Attached: <strong>${filename}</strong></p>
  </td></tr>
  <tr><td style="background:#0f172a;border-radius:0 0 12px 12px;padding:16px 32px;">
    <p style="margin:0;font-size:10px;color:#334155;">Genwebzy CRM — Automated Report</p>
  </td></tr>
</table>
</td></tr>
</table>
</body></html>`;
}
