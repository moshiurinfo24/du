-- Public share links for generated reports
CREATE TABLE IF NOT EXISTS public_shared_reports (
  token TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  report_html TEXT NOT NULL,
  filename TEXT NOT NULL,
  summary TEXT,
  lang TEXT NOT NULL DEFAULT 'bn',
  views INTEGER NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  expires_at DATETIME NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_public_shared_reports_expires_at ON public_shared_reports(expires_at);
