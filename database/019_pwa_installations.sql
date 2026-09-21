-- PWA install analytics
-- Counts unique anonymous installation IDs only; no device fingerprinting or personal data.
CREATE TABLE IF NOT EXISTS pwa_installations(
  install_hash TEXT PRIMARY KEY,
  platform TEXT NOT NULL DEFAULT 'unknown',
  install_source TEXT NOT NULL DEFAULT 'browser',
  installed_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_seen_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_pwa_installations_installed_at ON pwa_installations(installed_at);
