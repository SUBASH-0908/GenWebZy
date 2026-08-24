// ============================================================
// GENWEBZY CRM — ANALYTICS.gs
// Builds the Analytics sheet with formula-driven tables.
// ============================================================

/**
 * Build or refresh the full Analytics sheet.
 * Uses Google Sheets formulas — no hardcoded data.
 */
function buildAnalyticsSheet() {
  const ss      = getOrCreateSpreadsheet();
  const sheet   = findSheet(ss, "Analytics");

  sheet.clearContents();
  sheet.clearFormats();
  sheet.setTabColor("#a78bfa");

  const leadsSheetName = CONFIG.SHEET_LEADS;

  // ── Title ────────────────────────────────────────────────
  sheet.getRange("A1:L1").merge()
    .setValue("GENWEBZY — ANALYTICS")
    .setBackground("#0f172a").setFontColor("#a78bfa")
    .setFontWeight("bold").setFontSize(16)
    .setHorizontalAlignment("center").setVerticalAlignment("middle");
  sheet.setRowHeight(1, 50);

  sheet.getRange("A2:L2").merge()
    .setValue("Live data pulled from " + leadsSheetName + " sheet — refreshes automatically")
    .setBackground("#111827").setFontColor("#475569").setFontSize(9)
    .setHorizontalAlignment("center");
  sheet.setRowHeight(2, 22);

  // ── Section 1: Status Summary ─────────────────────────────
  let r = 4;
  sectionHeader(sheet, r, 1, 5, "STATUS SUMMARY", "#6c63ff");
  r++;
  tableHeaders(sheet, r, 1, ["STATUS","LEADS","% OF TOTAL"]);
  r++;
  CONFIG.STATUS_OPTIONS.forEach((status, i) => {
    const sc = CONFIG.STATUS_COLORS[status] || { bg: "#1e293b", text: "#94a3b8" };
    const bg = i % 2 === 0 ? "#111827" : "#0a0f1e";
    sheet.getRange(r, 1).setValue(status).setBackground(sc.bg).setFontColor(sc.text).setFontWeight("bold").setFontSize(9).setHorizontalAlignment("center");
    sheet.getRange(r, 2).setFormula(`=COUNTIF(${leadsSheetName}!K:K,"${status}")`).setBackground(bg).setFontColor("#e2e8f0").setFontSize(10).setFontWeight("bold").setHorizontalAlignment("center");
    sheet.getRange(r, 3).setFormula(`=IFERROR(B${r}/COUNTA(${leadsSheetName}!B2:B),0)`).setNumberFormat("0.0%").setBackground(bg).setFontColor("#94a3b8").setFontSize(9).setHorizontalAlignment("center");
    sheet.setRowHeight(r, 24);
    r++;
  });

  // ── Section 2: Service Summary ────────────────────────────
  r += 2;
  sectionHeader(sheet, r, 1, 5, "SERVICE BREAKDOWN", "#4ade80");
  r++;
  tableHeaders(sheet, r, 1, ["SERVICE","LEADS","WON","CONVERSION"]);
  r++;
  const services = ["Business Website","Portfolio Website","Landing Page","E-Commerce Website","Web Application","Website Redesign","Custom Web Development","Maintenance & Support","Other"];
  services.forEach((svc, i) => {
    const bg = i % 2 === 0 ? "#111827" : "#0a0f1e";
    sheet.getRange(r, 1).setValue(svc).setBackground(bg).setFontColor("#e2e8f0").setFontSize(9);
    sheet.getRange(r, 2).setFormula(`=COUNTIF(${leadsSheetName}!F:F,"${svc}")`).setBackground(bg).setFontColor("#60a5fa").setFontWeight("bold").setFontSize(10).setHorizontalAlignment("center");
    sheet.getRange(r, 3).setFormula(`=COUNTIFS(${leadsSheetName}!F:F,"${svc}",${leadsSheetName}!K:K,"Won")`).setBackground(bg).setFontColor("#4ade80").setFontSize(10).setHorizontalAlignment("center");
    sheet.getRange(r, 4).setFormula(`=IFERROR(C${r}/B${r},0)`).setNumberFormat("0%").setBackground(bg).setFontColor("#a78bfa").setFontSize(9).setHorizontalAlignment("center");
    sheet.setRowHeight(r, 24);
    r++;
  });

  // ── Section 3: Budget Distribution ───────────────────────
  r += 2;
  sectionHeader(sheet, r, 1, 4, "BUDGET DISTRIBUTION", "#fbbf24");
  r++;
  tableHeaders(sheet, r, 1, ["BUDGET RANGE","LEADS","WON"]);
  r++;
  const budgets = ["Under ₹10,000","₹10,000 – ₹25,000","₹25,000 – ₹50,000","₹50,000 – ₹1,00,000","₹1,00,000+","Not Sure"];
  budgets.forEach((b, i) => {
    const bg = i % 2 === 0 ? "#111827" : "#0a0f1e";
    sheet.getRange(r, 1).setValue(b).setBackground(bg).setFontColor("#e2e8f0").setFontSize(9);
    sheet.getRange(r, 2).setFormula(`=COUNTIF(${leadsSheetName}!G:G,"${b}")`).setBackground(bg).setFontColor("#fbbf24").setFontWeight("bold").setFontSize(10).setHorizontalAlignment("center");
    sheet.getRange(r, 3).setFormula(`=COUNTIFS(${leadsSheetName}!G:G,"${b}",${leadsSheetName}!K:K,"Won")`).setBackground(bg).setFontColor("#4ade80").setFontSize(9).setHorizontalAlignment("center");
    sheet.setRowHeight(r, 24);
    r++;
  });

  // ── Section 4: Monthly Trend (right column) ───────────────
  r = 4;
  sectionHeader(sheet, r, 7, 5, "MONTHLY TREND (Last 12 months)", "#60a5fa");
  r++;
  tableHeaders(sheet, r, 7, ["MONTH","LEADS","WON","CONVERSION"]);
  r++;

  const now = new Date();
  for (let m = 11; m >= 0; m--) {
    const d = new Date(now.getFullYear(), now.getMonth() - m, 1);
    const monthLabel = Utilities.formatDate(d, "Asia/Kolkata", "MMM yyyy");
    const mm = (d.getMonth() + 1).toString().padStart(2, "0");
    const yyyy = d.getFullYear();
    const bg = m % 2 === 0 ? "#111827" : "#0a0f1e";

    sheet.getRange(r, 7).setValue(monthLabel).setBackground(bg).setFontColor("#e2e8f0").setFontSize(9);
    // Count rows where timestamp starts with dd-mm-yyyy matching the month/year
    sheet.getRange(r, 8).setFormula(
      `=COUNTIFS(${leadsSheetName}!A:A,"*-${mm}-${yyyy}*")`
    ).setBackground(bg).setFontColor("#60a5fa").setFontWeight("bold").setFontSize(10).setHorizontalAlignment("center");
    sheet.getRange(r, 9).setFormula(
      `=COUNTIFS(${leadsSheetName}!A:A,"*-${mm}-${yyyy}*",${leadsSheetName}!K:K,"Won")`
    ).setBackground(bg).setFontColor("#4ade80").setFontSize(9).setHorizontalAlignment("center");
    sheet.getRange(r, 10).setFormula(`=IFERROR(I${r}/H${r},0)`).setNumberFormat("0%").setBackground(bg).setFontColor("#a78bfa").setFontSize(9).setHorizontalAlignment("center");
    sheet.setRowHeight(r, 24);
    r++;
  }

  // ── Section 5: Quick Totals ───────────────────────────────
  r += 2;
  sectionHeader(sheet, r, 7, 4, "ALL-TIME TOTALS", "#f87171");
  r++;
  const totalMetrics = [
    ["Total Enquiries", `=COUNTA(${leadsSheetName}!B2:B)`],
    ["Total Won",       `=COUNTIF(${leadsSheetName}!K:K,"Won")`],
    ["Total Lost",      `=COUNTIF(${leadsSheetName}!K:K,"Lost")`],
    ["Still Active",    `=COUNTA(${leadsSheetName}!B2:B)-COUNTIF(${leadsSheetName}!K:K,"Won")-COUNTIF(${leadsSheetName}!K:K,"Lost")-COUNTIF(${leadsSheetName}!K:K,"Completed")`],
    ["Conversion Rate", `=IFERROR(COUNTIF(${leadsSheetName}!K:K,"Won")/COUNTA(${leadsSheetName}!B2:B),0)`],
  ];
  totalMetrics.forEach(([label, formula], i) => {
    const bg = i % 2 === 0 ? "#111827" : "#0a0f1e";
    sheet.getRange(r, 7).setValue(label).setBackground(bg).setFontColor("#94a3b8").setFontSize(9);
    const valCell = sheet.getRange(r, 8);
    valCell.setFormula(formula).setBackground(bg).setFontColor("#f1f5f9").setFontWeight("bold").setFontSize(11).setHorizontalAlignment("center");
    if (label === "Conversion Rate") valCell.setNumberFormat("0.0%");
    sheet.setRowHeight(r, 26);
    r++;
  });

  // ── Column widths ─────────────────────────────────────────
  [1,2,3,4].forEach(c => sheet.setColumnWidth(c, 170));
  sheet.setColumnWidth(5, 30);
  sheet.setColumnWidth(6, 30);
  [7,8,9,10].forEach(c => sheet.setColumnWidth(c, 130));

  sheet.setFrozenRows(3);
  Logger.log("Analytics sheet built.");
}

// ── HELPERS ───────────────────────────────────────────────────

function sectionHeader(sheet, row, col, span, title, color) {
  sheet.getRange(row, col, 1, span).merge()
    .setValue(title)
    .setBackground("#0f172a")
    .setFontColor(color)
    .setFontWeight("bold")
    .setFontSize(10)
    .setVerticalAlignment("middle");
  sheet.setRowHeight(row, 30);
}

function tableHeaders(sheet, row, col, headers) {
  headers.forEach((h, i) => {
    sheet.getRange(row, col + i)
      .setValue(h)
      .setBackground("#1e293b")
      .setFontColor("#94a3b8")
      .setFontWeight("bold")
      .setFontSize(8)
      .setHorizontalAlignment("center");
  });
  sheet.setRowHeight(row, 26);
}
