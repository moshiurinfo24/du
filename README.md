# DU Employee ERP — Zero-Cost Phase 1

স্বেচ্ছাসেবী/ব্যক্তিগত উদ্যোগ। কোনো অফিসিয়াল ঢাকা বিশ্ববিদ্যালয় ERP নয়।

## Stack
- React + Vite
- Cloudflare Workers
- Cloudflare D1
- GitHub
- Browser-side PDF later
- R2 only if profile photo is enabled

## Phase 1
- Secure login foundation
- Roles: super_admin, admin, department_admin, editor, employee
- Employee profile schema
- Admin foundation
- Promotion + Salary modules-এর migration-ready structure

## Deploy
1. GitHub repo তৈরি করুন।
2. `database/schema.sql` D1-এ apply করুন।
3. `worker/wrangler.toml`-এ D1 database_id বসান।
4. Worker deploy করুন।
5. Frontend `.env`-এ `VITE_API_BASE` দিন।
6. Frontend build করে Cloudflare Pages-এ deploy করুন।

সব service free-tier first ধরে তৈরি।
