-- Phase 36: user-defined year-wise leave entitlements
-- No official entitlement values are seeded.
CREATE TABLE IF NOT EXISTS personal_leave_entitlement_settings (
  user_id INTEGER NOT NULL,
  year INTEGER NOT NULL,
  entitlements_json TEXT NOT NULL DEFAULT '{}',
  source_note TEXT,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, year)
);

CREATE INDEX IF NOT EXISTS idx_leave_entitlement_user_year
  ON personal_leave_entitlement_settings(user_id, year);
