// ============================================================
// GENWEBZY CRM — CONFIG.gs
// ============================================================
// Edit ONLY this file when deploying or updating the system.
// Do NOT scatter config values throughout other files.
// ============================================================

const CONFIG = {

  // ── COMPANY ──────────────────────────────────────────────
  COMPANY_NAME:   "Genwebzy",
  TAGLINE:        "Building Websites That Work",

  // ── OWNER CONTACT ────────────────────────────────────────
  OWNER_EMAIL:    "contact.genwebzy@gmail.com",   // Notification emails are sent here
  OWNER_PHONE:    "919751574014",                  // Owner WhatsApp (digits only, with country code)
  OWNER_NAME:     "Genwebzy Team",

  // ── COMPANY LINKS ────────────────────────────────────────
  WEBSITE:        "https://gen-web-zy.vercel.app",  // Live Vercel deployment
  WHATSAPP_LINK:  "https://wa.me/919751574014",

  // ── GOOGLE SHEETS ────────────────────────────────────────
  SPREADSHEET_ID: "1fCDG3qobeM1K-ZQ6ppdg-T74ZoDSb10o5DsifEsVgWY",  // Genwebzy CRM Sheet
  SHEET_LEADS:    "Enquiries",
  SHEET_DASHBOARD:"Dashboard",

  // ── BRANDING COLOURS (used in HTML emails) ───────────────
  COLOR_BG:       "#0a0a0f",
  COLOR_CARD:     "#111118",
  COLOR_BORDER:   "#1e1e2e",
  COLOR_ACCENT:   "#6c63ff",
  COLOR_ACCENT2:  "#a78bfa",
  COLOR_TEXT:     "#e2e8f0",
  COLOR_MUTED:    "#94a3b8",
  COLOR_SUCCESS:  "#22c55e",
  COLOR_WARN:     "#f59e0b",

  // ── STATUS LABELS ────────────────────────────────────────
  STATUS_OPTIONS: ["New","Contacted","Qualified","Proposal Sent","Negotiation","Won","Completed","Lost"],
  STATUS_COLORS: {
    "New":           { bg: "#1e3a5f", text: "#60a5fa" },
    "Contacted":     { bg: "#1c3a2e", text: "#4ade80" },
    "Qualified":     { bg: "#2d2040", text: "#c084fc" },
    "Proposal Sent": { bg: "#3b2e10", text: "#fbbf24" },
    "Negotiation":   { bg: "#3b1f10", text: "#fb923c" },
    "Won":           { bg: "#14532d", text: "#86efac" },
    "Completed":     { bg: "#1e293b", text: "#94a3b8" },
    "Lost":          { bg: "#3b1515", text: "#f87171" },
  },

  // ── SHEET COLUMN HEADERS ─────────────────────────────────
  CRM_HEADERS: [
    "Timestamp","Name","Email","Phone","Company",
    "Service","Budget","Timeline","Start Date","Message",
    "Status","Source","WhatsApp Link","Notes"
  ],

  // ── DUPLICATE WINDOW (seconds) ───────────────────────────
  DEDUPE_WINDOW_SECONDS: 30,
};
