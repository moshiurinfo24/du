-- V39: Browser/PWA usage split from 2026-09-22 onward.
CREATE TABLE IF NOT EXISTS public_mode_visitors (
  visitor_hash TEXT NOT NULL,
  mode TEXT NOT NULL,
  device TEXT NOT NULL DEFAULT 'desktop',
  platform TEXT NOT NULL DEFAULT 'other',
  first_seen_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_seen_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (visitor_hash, mode)
);

CREATE INDEX IF NOT EXISTS idx_public_mode_visitors_last_seen
  ON public_mode_visitors(last_seen_at);
