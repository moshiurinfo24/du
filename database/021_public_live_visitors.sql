-- V37: privacy-safe live visitor presence
CREATE TABLE IF NOT EXISTS public_live_visitors (
  visitor_hash TEXT PRIMARY KEY,
  section TEXT NOT NULL DEFAULT 'home',
  path TEXT NOT NULL DEFAULT '/',
  platform TEXT NOT NULL DEFAULT 'other',
  device TEXT NOT NULL DEFAULT 'desktop',
  mode TEXT NOT NULL DEFAULT 'browser',
  first_seen_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_seen_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_public_live_visitors_last_seen
  ON public_live_visitors(last_seen_at);
