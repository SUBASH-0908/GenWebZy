// ============================================================
// GENWEBZY CRM — DASHBOARD.gs
// Auto-builds and refreshes the Dashboard sheet.
// ============================================================

/**
 * RESET — clears ALL lead data from Enquiries sheet + rebuilds Dashboard.
 * Run this from the Apps Script editor to start completely fresh.
 */
function resetDashboard() {
  const ss = getOrCreateSpreadsheet();

  // ── Step 1: Clear all leads (keep header row) ────────────
  const leads   = ss.getSheetByName(CONFIG.SHEET_LEADS);
  if (leads) {
    const lastRow = leads.getLastRow();
    if (lastRow > 1) {
      leads.getRange(2, 1, lastRow - 1, leads.getLastColumn()).clearContent();
      Logger.log("✅ All lead data cleared. Header kept.");
    } else {
      Logger.log("Enquiries sheet already empty.");
    }
  }

  // ── Step 2: Delete and rebuild Dashboard ─────────────────
  const dash = ss.getSheetByName(CONFIG.SHEET_DASHBOARD);
  if (dash) ss.deleteSheet(dash);
  Logger.log("Dashboard deleted. Rebuilding...");
  updateDashboard();

  // ── Step 3: Rebuild Analytics ─────────────────────────────
  buildAnalyticsSheet();

  Logger.log("✅ Full reset complete — all data cleared, dashboard rebuilt.");
}

/**
 * ONE-CLICK FULL SETUP — run this once after first deployment.
 * Creates all sheets, dashboard, analytics, and installs all triggers.
 */
function setupFullCRM() {
  Logger.log("Starting full CRM setup...");
  updateDashboard();
  buildAnalyticsSheet();
  setupAllTriggers();
  Logger.log("✅ Genwebzy CRM fully set up. All sheets and triggers are ready.");
}


/**
 * Main entry — build or refresh the entire Dashboard sheet.
 */
function updateDashboard() {
  const ss     = getOrCreateSpreadsheet();
  const leads  = findSheet(ss, CONFIG.SHEET_LEADS);
  const dash   = findSheet(ss, CONFIG.SHEET_DASHBOARD);

  dash.clearContents();
  dash.clearFormats();

  // Remove any existing embedded charts from dashboard
  const existingCharts = dash.getCharts();
  for (const chart of existingCharts) {
    dash.removeChart(chart);
  }

  // ── Read lead data ────────────────────────────────────
  const lastRow = leads.getLastRow();
  const data    = lastRow > 1
    ? leads.getRange(2, 1, lastRow - 1, CONFIG.CRM_HEADERS.length).getValues()
    : [];

  // ── Compute KPIs ──────────────────────────────────────
  const kpi = computeKPIs(data);

  // ── Layout Dashboard ──────────────────────────────────
  layoutDashboardHeader(dash);
  layoutKPISection(dash, kpi);
  layoutRecentLeads(dash, data);
  layoutCharts(dash, data, leads);
  formatDashboard(dash);

  Logger.log("Dashboard updated. " + data.length + " leads.");
}

/**
 * Compute all KPI values from raw lead rows.
 * @param {Array[]} data
 * @returns {Object}
 */
function computeKPIs(data) {
  const now   = new Date();
  const month = now.getMonth();
  const year  = now.getFullYear();

  let total      = data.length;
  let newLeads   = 0;
  let thisMonth  = 0;
  let qualified  = 0;
  let proposals  = 0;
  let won        = 0;

  for (const row of data) {
    const status    = String(row[10] || "").trim();
    const timestamp = String(row[0]  || "");

    if (status === "New")           newLeads++;
    if (status === "Qualified")     qualified++;
    if (status === "Proposal Sent") proposals++;
    if (status === "Won")           won++;

    // Check month
    try {
      const parts = timestamp.split(" ")[0].split("-");
      if (parts.length === 3) {
        const d = new Date(parts[2], parseInt(parts[1],10)-1, parseInt(parts[0],10));
        if (d.getMonth() === month && d.getFullYear() === year) {
          thisMonth++;
        }
      }
    } catch(e) { /* ignore */ }
  }

  const conversion = total > 0 ? ((won / total) * 100).toFixed(1) + "%" : "0%";

  return { total, newLeads, thisMonth, qualified, proposals, won, conversion };
}

/**
 * Write the dashboard header.
 */
function layoutDashboardHeader(dash) {
  dash.getRange("A1:J1").merge()
    .setValue("GENWEBZY — CRM DASHBOARD")
    .setBackground("#0f172a")
    .setFontColor("#6c63ff")
    .setFontWeight("bold")
    .setFontSize(16)
    .setFontFamily("Google Sans")
    .setHorizontalAlignment("center")
    .setVerticalAlignment("middle");
  dash.setRowHeight(1, 50);

  dash.getRange("A2:J2").merge()
    .setValue("Last updated: " + formattedDateTime())
    .setBackground("#0f172a")
    .setFontColor("#475569")
    .setFontSize(9)
    .setHorizontalAlignment("center");
  dash.setRowHeight(2, 24);
}

/**
 * Write KPI cards in a 7-column layout.
 */
function layoutKPISection(dash, kpi) {
  const labels = [
    "TOTAL LEADS", "NEW LEADS", "THIS MONTH",
    "QUALIFIED", "PROPOSALS", "WON", "CONVERSION"
  ];
  const values = [
    kpi.total, kpi.newLeads, kpi.thisMonth,
    kpi.qualified, kpi.proposals, kpi.won, kpi.conversion
  ];
  const colours = [
    "#3b82f6","#60a5fa","#a78bfa",
    "#c084fc","#fbbf24","#4ade80","#6c63ff"
  ];

  dash.setRowHeight(3, 24);
  dash.setRowHeight(4, 50);
  dash.setRowHeight(5, 30);
  dash.setRowHeight(6, 18);

  // Row 3 — spacer
  dash.getRange("A3:G3").setBackground("#1e293b");

  for (let i = 0; i < 7; i++) {
    const col = i + 1;

    // KPI label
    const labelCell = dash.getRange(4, col);
    labelCell
      .setValue(labels[i])
      .setBackground("#111827")
      .setFontColor("#64748b")
      .setFontSize(8)
      .setFontWeight("bold")
      .setHorizontalAlignment("center")
      .setVerticalAlignment("bottom");

    // KPI value
    const valCell = dash.getRange(5, col);
    valCell
      .setValue(values[i])
      .setBackground("#111827")
      .setFontColor(colours[i])
      .setFontSize(22)
      .setFontWeight("bold")
      .setHorizontalAlignment("center")
      .setVerticalAlignment("top");

    // Bottom border accent
    const borderCell = dash.getRange(6, col);
    borderCell
      .setBackground("#111827")
      .setBorder(false, false, true, false, false, false, colours[i], SpreadsheetApp.BorderStyle.SOLID_THICK);

    dash.setColumnWidth(col, 100);
  }
}

/**
 * Write the Recent Leads table.
 * @param {GoogleAppsScript.Spreadsheet.Sheet} dash
 * @param {Array[]} data
 */
function layoutRecentLeads(dash, data) {
  const startRow = 8;

  // Section header
  dash.getRange(startRow, 1, 1, 6).merge()
    .setValue("RECENT ENQUIRIES")
    .setBackground("#0f172a")
    .setFontColor("#a78bfa")
    .setFontWeight("bold")
    .setFontSize(10)
    .setHorizontalAlignment("left")
    .setVerticalAlignment("middle")
    .setNumberFormat("@");
  dash.setRowHeight(startRow, 32);

  // Column headers
  const headers = ["DATE", "NAME", "COMPANY", "SERVICE", "BUDGET", "STATUS"];
  const hdrRow  = dash.getRange(startRow + 1, 1, 1, 6);
  hdrRow.setValues([headers])
    .setBackground("#1e293b")
    .setFontColor("#94a3b8")
    .setFontWeight("bold")
    .setFontSize(8)
    .setHorizontalAlignment("center");
  dash.setRowHeight(startRow + 1, 28);

  // Recent 10 leads (reversed — newest first)
  const recent = data.slice(-10).reverse();
  for (let i = 0; i < recent.length; i++) {
    const row    = recent[i];
    const r      = startRow + 2 + i;
    const status = String(row[10] || "New").trim();
    const bg     = i % 2 === 0 ? "#0f172a" : "#111827";

    dash.getRange(r, 1).setValue(String(row[0]).split(" ")[0]).setBackground(bg).setFontColor("#94a3b8").setFontSize(9).setHorizontalAlignment("center");
    dash.getRange(r, 2).setValue(row[1]).setBackground(bg).setFontColor("#f1f5f9").setFontSize(9).setFontWeight("bold");
    dash.getRange(r, 3).setValue(row[4] || "—").setBackground(bg).setFontColor("#94a3b8").setFontSize(9);
    dash.getRange(r, 4).setValue(row[5]).setBackground(bg).setFontColor("#e2e8f0").setFontSize(9);
    dash.getRange(r, 5).setValue(row[6] || "—").setBackground(bg).setFontColor("#fbbf24").setFontSize(9);

    const statusCell = dash.getRange(r, 6);
    const sc         = CONFIG.STATUS_COLORS[status] || { bg: "#1e293b", text: "#94a3b8" };
    statusCell.setValue(status)
      .setBackground(sc.bg)
      .setFontColor(sc.text)
      .setFontWeight("bold")
      .setFontSize(8)
      .setHorizontalAlignment("center");

    dash.setRowHeight(r, 28);
  }
}

/**
 * Create embedded charts in the Dashboard sheet.
 * @param {GoogleAppsScript.Spreadsheet.Sheet} dash
 * @param {Array[]} data
 * @param {GoogleAppsScript.Spreadsheet.Sheet} leads
 */
function layoutCharts(dash, data, leads) {
  if (data.length === 0) return;

  try {
    buildServiceDistributionChart(dash, data);
  } catch(e) { Logger.log("Service chart error: " + e.message); }

  try {
    buildStatusPipelineChart(dash, data);
  } catch(e) { Logger.log("Pipeline chart error: " + e.message); }

  try {
    buildBudgetDistributionChart(dash, data);
  } catch(e) { Logger.log("Budget chart error: " + e.message); }
}

/**
 * Build a Pie chart of service distribution using a temp data range.
 */
function buildServiceDistributionChart(dash, data) {
  // Count services
  const counts = {};
  for (const row of data) {
    const svc = String(row[5] || "Other").trim();
    counts[svc] = (counts[svc] || 0) + 1;
  }

  // Write temp data to a far-right area
  const tempCol  = 9;
  const tempStart= 8;
  let   r        = tempStart;

  dash.getRange(r, tempCol).setValue("Service").setFontWeight("bold");
  dash.getRange(r, tempCol + 1).setValue("Count").setFontWeight("bold");
  r++;

  for (const [svc, cnt] of Object.entries(counts)) {
    dash.getRange(r, tempCol).setValue(svc);
    dash.getRange(r, tempCol + 1).setValue(cnt);
    r++;
  }

  const dataRange = dash.getRange(tempStart, tempCol, r - tempStart, 2);

  const chart = dash.newChart()
    .setChartType(Charts.ChartType.PIE)
    .addRange(dataRange)
    .setPosition(25, 1, 0, 0)
    .setOption("title", "Service Distribution")
    .setOption("legend", { position: "right" })
    .setOption("width",  420)
    .setOption("height", 260)
    .setOption("backgroundColor", "#111827")
    .setOption("titleTextStyle", { color: "#e2e8f0", fontSize: 13 })
    .setOption("legendTextStyle", { color: "#94a3b8" })
    .build();

  dash.insertChart(chart);
}

/**
 * Build a Bar chart of the lead pipeline (status counts).
 */
function buildStatusPipelineChart(dash, data) {
  const counts = {};
  for (const s of CONFIG.STATUS_OPTIONS) counts[s] = 0;
  for (const row of data) {
    const s = String(row[10] || "New").trim();
    if (s in counts) counts[s]++;
  }

  const tempCol  = 12;
  const tempStart= 8;
  let   r        = tempStart;

  dash.getRange(r, tempCol).setValue("Status").setFontWeight("bold");
  dash.getRange(r, tempCol + 1).setValue("Leads").setFontWeight("bold");
  r++;

  for (const [status, count] of Object.entries(counts)) {
    dash.getRange(r, tempCol).setValue(status);
    dash.getRange(r, tempCol + 1).setValue(count);
    r++;
  }

  const dataRange = dash.getRange(tempStart, tempCol, r - tempStart, 2);

  const chart = dash.newChart()
    .setChartType(Charts.ChartType.BAR)
    .addRange(dataRange)
    .setPosition(25, 5, 0, 0)
    .setOption("title", "Lead Pipeline")
    .setOption("width",  420)
    .setOption("height", 260)
    .setOption("backgroundColor", "#111827")
    .setOption("titleTextStyle", { color: "#e2e8f0", fontSize: 13 })
    .setOption("hAxis", { textStyle: { color: "#94a3b8" }, gridlines: { color: "#1e293b" } })
    .setOption("vAxis", { textStyle: { color: "#94a3b8" } })
    .setOption("colors", ["#6c63ff"])
    .build();

  dash.insertChart(chart);
}

/**
 * Build a Pie chart of budget distribution.
 */
function buildBudgetDistributionChart(dash, data) {
  const counts = {};
  for (const row of data) {
    const b = String(row[6] || "Not specified").trim();
    counts[b] = (counts[b] || 0) + 1;
  }

  const tempCol  = 15;
  const tempStart= 8;
  let   r        = tempStart;

  dash.getRange(r, tempCol).setValue("Budget").setFontWeight("bold");
  dash.getRange(r, tempCol + 1).setValue("Count").setFontWeight("bold");
  r++;

  for (const [budget, count] of Object.entries(counts)) {
    dash.getRange(r, tempCol).setValue(budget);
    dash.getRange(r, tempCol + 1).setValue(count);
    r++;
  }

  const dataRange = dash.getRange(tempStart, tempCol, r - tempStart, 2);

  const chart = dash.newChart()
    .setChartType(Charts.ChartType.COLUMN)
    .addRange(dataRange)
    .setPosition(40, 1, 0, 0)
    .setOption("title", "Budget Distribution")
    .setOption("width",  500)
    .setOption("height", 260)
    .setOption("backgroundColor", "#111827")
    .setOption("titleTextStyle", { color: "#e2e8f0", fontSize: 13 })
    .setOption("hAxis", { textStyle: { color: "#94a3b8" }, gridlines: { color: "#1e293b" } })
    .setOption("vAxis", { textStyle: { color: "#94a3b8" } })
    .setOption("colors", ["#a78bfa"])
    .build();

  dash.insertChart(chart);
}

/**
 * Apply final formatting to the Dashboard sheet.
 */
function formatDashboard(dash) {
  // Set overall dark background
  dash.getRange(1, 1, 100, 20).setBackground("#0d1117");
  dash.setTabColor("#6c63ff");
  dash.setName(CONFIG.SHEET_DASHBOARD);
  dash.setFrozenRows(2);
}
