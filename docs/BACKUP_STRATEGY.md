# AGNES ACADEMIA - Backup & Recovery Strategy

## 1. Database Backup Strategy
**Supabase PITR (Point-in-Time Recovery)**
- **Daily Automated Backups**: Supabase takes daily logical backups of the entire PostgreSQL database automatically (enabled by default on paid plans).
- **Point-in-Time Recovery**: We recommend enabling PITR (WAL archiving) in the Supabase Dashboard, which allows recovering the database to *any exact second* within the retention window (e.g., 7 days or 30 days) in case of accidental drops or malicious corruption.

## 2. Storage Backup Strategy
**Supabase Storage S3 Buckets**
- Because Supabase Storage operates on top of AWS S3 / Cloudflare R2, objects are highly durable.
- **Manual Replication**: For extreme fault tolerance, implement a nightly GitHub Action or Cron Job using the Supabase CLI / AWS CLI to sync the contents of the `resources`, `question_papers`, and `avatars` buckets to an offline cold storage bucket (e.g., AWS S3 Glacier).

## 3. Migration Strategy
**Version Control**
- All schema changes are tracked strictly in `supabase/migrations/`.
- No changes should be made directly via the Supabase UI without generating a migration file via `supabase db pull` or `supabase db diff`.

## 4. Disaster Recovery Process
If the main Supabase project becomes severely compromised or irrecoverable:
1. **Spin up new Project**: Create a fresh Supabase project.
2. **Push Migrations**: Run `supabase db push` to instantly restore the full table structures, RLS policies, views, and functions.
3. **Restore Data**: Use Supabase Dashboard to restore the latest daily automated logical backup `.sql` file, or contact Supabase Support for a PITR restore.
4. **Restore Storage**: Resync buckets from the cold-storage AWS S3 Glacier backup.
5. **Update ENV**: Push the new `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_ANON_KEY` to the Vercel/production environment and restart the deployment.
