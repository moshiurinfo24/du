# DU Employee ERP — Phase 4

Phase 4 adds:
- Full Employee Profile view
- Department/Office master directory
- Designation master directory
- Department + Designation mapping
- Father/Mother, DOB, masked NID, blood group, office/unit
- Profile Photo auto resize/compress to <= 50 KB in browser
- Search by employee/department/designation
- Mobile responsive profile view
- Role-protected master-data APIs
- Audit log entries

## IMPORTANT DATABASE STEP
Before testing Employee Management, run:
database/phase4_migration.sql
in Cloudflare D1 Console, one ALTER statement at a time if the console refuses a batch.

## GitHub files to upload/replace
- frontend/src/main.jsx
- frontend/src/styles.css
- frontend/src/rules.js
- worker/src/index.js
- database/phase4_migration.sql

Note:
For zero-cost simplicity in this phase, compressed profile photo data is stored in D1 as a small data URL.
This avoids requiring a separate R2 binding right now. Later, if desired, photo storage can be moved to R2 without changing the visible profile UI.
