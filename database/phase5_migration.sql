-- DU Employee ERP Phase 5 migration
ALTER TABLE service_history ADD COLUMN from_designation TEXT;
ALTER TABLE service_history ADD COLUMN to_designation TEXT;
ALTER TABLE service_history ADD COLUMN from_grade INTEGER;
ALTER TABLE service_history ADD COLUMN to_grade INTEGER;
ALTER TABLE service_history ADD COLUMN department_id INTEGER;
ALTER TABLE service_history ADD COLUMN office_name TEXT;
ALTER TABLE service_history ADD COLUMN reference_no TEXT;
ALTER TABLE service_history ADD COLUMN created_by INTEGER;
CREATE INDEX IF NOT EXISTS idx_service_history_event_date ON service_history(event_date);
CREATE INDEX IF NOT EXISTS idx_service_history_type ON service_history(event_type);
