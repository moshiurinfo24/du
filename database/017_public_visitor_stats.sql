-- Public traffic analytics (privacy-safe)
CREATE TABLE IF NOT EXISTS public_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  visitor_hash TEXT NOT NULL,
  event TEXT NOT NULL DEFAULT 'page_view',
  section TEXT NOT NULL DEFAULT 'home',
  path TEXT,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_public_events_created_at ON public_events(created_at);
CREATE INDEX IF NOT EXISTS idx_public_events_visitor_hash ON public_events(visitor_hash);
CREATE INDEX IF NOT EXISTS idx_public_events_event_section ON public_events(event, section);
