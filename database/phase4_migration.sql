-- DU Employee ERP Phase 4 migration
-- Run once in Cloudflare D1 Console.

CREATE TABLE IF NOT EXISTS designations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name_bn TEXT NOT NULL,
  name_en TEXT,
  grade INTEGER,
  is_active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE employees ADD COLUMN father_name TEXT;
ALTER TABLE employees ADD COLUMN mother_name TEXT;
ALTER TABLE employees ADD COLUMN nid_masked TEXT;
ALTER TABLE employees ADD COLUMN blood_group TEXT;
ALTER TABLE employees ADD COLUMN office_name TEXT;
ALTER TABLE employees ADD COLUMN designation_id INTEGER;
ALTER TABLE employees ADD COLUMN photo_data TEXT;

CREATE INDEX IF NOT EXISTS idx_employees_designation_id ON employees(designation_id);
CREATE INDEX IF NOT EXISTS idx_designations_active ON designations(is_active);
