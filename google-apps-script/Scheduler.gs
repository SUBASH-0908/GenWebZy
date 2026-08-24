// ============================================================
// GENWEBZY CRM — SCHEDULER.gs
// One-time setup for automatic weekly/monthly report emails.
// Run each function ONCE manually from the Apps Script editor.
// ============================================================

/**
 * Install weekly report trigger — runs every Monday at 8 AM IST.
 * Run this function ONCE from the Apps Script editor.
 */
function setupWeeklyReportTrigger() {
  deleteTrigger_("emailWeeklyReport");
  ScriptApp.newTrigger("emailWeeklyReport")
    .timeBased()
    .onWeekDay(ScriptApp.WeekDay.MONDAY)
    .atHour(8)
    .create();
  Logger.log("✅ Weekly report trigger set: every Monday at 8 AM IST");
}

/**
 * Install monthly report trigger — runs on the 1st of every month at 9 AM.
 * Run this function ONCE from the Apps Script editor.
 */
function setupMonthlyReportTrigger() {
  deleteTrigger_("emailMonthlyReport");
  ScriptApp.newTrigger("emailMonthlyReport")
    .timeBased()
    .onMonthDay(1)
    .atHour(9)
    .create();
  Logger.log("✅ Monthly report trigger set: 1st of every month at 9 AM IST");
}

/**
 * Install daily dashboard refresh trigger — runs every day at 7 AM.
 * Optional — keeps dashboard always up to date.
 */
function setupDailyDashboardTrigger() {
  deleteTrigger_("updateDashboard");
  ScriptApp.newTrigger("updateDashboard")
    .timeBased()
    .everyDays(1)
    .atHour(7)
    .create();
  Logger.log("✅ Daily dashboard refresh set: every day at 7 AM IST");
}

/**
 * Remove ALL triggers installed by this project.
 * Use to cleanly reset trigger configuration.
 */
function removeAllTriggers() {
  const triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(t => ScriptApp.deleteTrigger(t));
  Logger.log("All triggers removed (" + triggers.length + " deleted).");
}

/**
 * List all currently active triggers to the log.
 */
function listAllTriggers() {
  const triggers = ScriptApp.getProjectTriggers();
  if (triggers.length === 0) {
    Logger.log("No triggers installed.");
    return;
  }
  triggers.forEach(t => {
    Logger.log("► " + t.getHandlerFunction() + " | " + t.getTriggerSource() + " | " + t.getEventType());
  });
}

/**
 * Run ALL setup in one go — installs all triggers.
 * Run this once after deploying the project.
 */
function setupAllTriggers() {
  createOnEditTrigger();
  setupWeeklyReportTrigger();
  setupMonthlyReportTrigger();
  setupDailyDashboardTrigger();
  Logger.log("✅ All triggers installed successfully.");
}

// ── PRIVATE ───────────────────────────────────────────────────

/**
 * Delete existing trigger with a given handler function name (prevents duplicates).
 * @param {string} fnName
 */
function deleteTrigger_(fnName) {
  ScriptApp.getProjectTriggers()
    .filter(t => t.getHandlerFunction() === fnName)
    .forEach(t => ScriptApp.deleteTrigger(t));
}
