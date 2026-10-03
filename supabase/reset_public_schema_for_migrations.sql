-- DESTRUCTIVE: reset the application schema so timestamped migrations can
-- be replayed with `supabase db push --linked`.
--
-- This removes every table and other application object in the public schema,
-- along with all rows in those tables, and clears the migration-history rows
-- for the timestamped migrations currently in this repository.
--
-- It deliberately preserves Supabase-managed auth users, Storage buckets and
-- files, extensions, and schemas other than public. Storage policies created
-- by this application's migrations are removed so those migrations can
-- recreate them.
--
-- IMPORTANT: versions 20261003000002 and 20261003000004 are recorded in the
-- linked database but their migration files are currently absent locally.
-- Restore those files before running this reset if their curricula and
-- subject-link changes must be recreated by `supabase db push`.
--
-- Back up the database and verify the linked Supabase project before running.
-- Run manually in the Supabase SQL Editor. This file is not a migration.

BEGIN;

-- Drop materialized views and views first. CASCADE handles dependencies
-- between views; all objects in public are treated as application-owned.
DO $$
DECLARE
    object_row RECORD;
BEGIN
    FOR object_row IN
        SELECT schemaname, matviewname AS object_name
        FROM pg_matviews
        WHERE schemaname = 'public'
    LOOP
        EXECUTE format(
            'DROP MATERIALIZED VIEW IF EXISTS %I.%I CASCADE',
            object_row.schemaname,
            object_row.object_name
        );
    END LOOP;

    FOR object_row IN
        SELECT schemaname, viewname AS object_name
        FROM pg_views
        WHERE schemaname = 'public'
    LOOP
        EXECUTE format(
            'DROP VIEW IF EXISTS %I.%I CASCADE',
            object_row.schemaname,
            object_row.object_name
        );
    END LOOP;
END;
$$;

-- Drop all public tables, including their data, policies, triggers, and
-- dependent objects. This includes tables not known when this script was made.
DO $$
DECLARE
    object_row RECORD;
BEGIN
    FOR object_row IN
        SELECT tablename
        FROM pg_tables
        WHERE schemaname = 'public'
    LOOP
        EXECUTE format('DROP TABLE IF EXISTS public.%I CASCADE', object_row.tablename);
    END LOOP;
END;
$$;

-- Remove remaining public routines and custom types.
DO $$
DECLARE
    object_row RECORD;
    routine_kind TEXT;
BEGIN
    FOR object_row IN
        SELECT p.oid, p.prokind, p.proname,
               pg_get_function_identity_arguments(p.oid) AS identity_arguments
        FROM pg_proc p
        JOIN pg_namespace n ON n.oid = p.pronamespace
        WHERE n.nspname = 'public'
    LOOP
        routine_kind := CASE
            WHEN object_row.prokind = 'p' THEN 'PROCEDURE'
            WHEN object_row.prokind = 'a' THEN 'AGGREGATE'
            ELSE 'FUNCTION'
        END;
        EXECUTE format(
            'DROP %s IF EXISTS public.%I(%s) CASCADE',
            routine_kind,
            object_row.proname,
            object_row.identity_arguments
        );
    END LOOP;

    FOR object_row IN
        SELECT t.typname, t.typtype
        FROM pg_type t
        JOIN pg_namespace n ON n.oid = t.typnamespace
        WHERE n.nspname = 'public'
          AND (
              t.typtype IN ('d', 'e')
              OR (t.typtype = 'c' AND t.typrelid = 0)
          )
    LOOP
        IF object_row.typtype = 'd' THEN
            EXECUTE format('DROP DOMAIN IF EXISTS public.%I CASCADE', object_row.typname);
        ELSE
            EXECUTE format('DROP TYPE IF EXISTS public.%I CASCADE', object_row.typname);
        END IF;
    END LOOP;
END;
$$;

-- Remove sequences that are not already removed with their owning tables.
DO $$
DECLARE
    object_row RECORD;
BEGIN
    FOR object_row IN
        SELECT sequence_name
        FROM information_schema.sequences
        WHERE sequence_schema = 'public'
    LOOP
        EXECUTE format('DROP SEQUENCE IF EXISTS public.%I CASCADE', object_row.sequence_name);
    END LOOP;
END;
$$;

-- Remove only policies previously created by this application's migrations.
DROP POLICY IF EXISTS "Anyone can read published resources files" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload resource files" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own resource files" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own resource files" ON storage.objects;
DROP POLICY IF EXISTS "Public Download Resources" ON storage.objects;
DROP POLICY IF EXISTS "Auth Upload Resources" ON storage.objects;
DROP POLICY IF EXISTS "Owner Delete Resources" ON storage.objects;
DROP POLICY IF EXISTS "Public Download QPs" ON storage.objects;
DROP POLICY IF EXISTS "Auth Upload QPs" ON storage.objects;
DROP POLICY IF EXISTS "Owner Delete QPs" ON storage.objects;

-- Clear migration tracking for every local timestamped migration and the two
-- migration versions previously applied to the linked database but now absent
-- from the local migration directory.
DELETE FROM supabase_migrations.schema_migrations
WHERE version IN (
    '20240101000000', '20240102000000', '20240103000000',
    '20240104000000', '20240105000000', '20240106000000',
    '20240107000000', '20240108000000', '20240109000000',
    '20240110000000', '20240111000000', '20240112000000',
    '20240112000001', '20240112000002', '20240112000003',
    '20240112000004', '20240113000000', '20240114000000',
    '20240116000000', '20240117000000', '20240118000000',
    '20240118000001', '20240118000002', '20240119000000',
    '20240119000001', '20240119000002', '20240119000003',
    '20240119000004', '20240120000000', '20240120000001',
    '20240120000003', '20240120000004', '20261003000000',
    '20261003000001', '20261003000002', '20261003000003',
    '20261003000004'
);

-- OPTIONAL, PERMANENT STORAGE FILE DELETION:
-- Uncomment only if you also intend to delete all uploaded files in these
-- buckets. The buckets themselves are kept so migrations can reuse them.
--
-- DELETE FROM storage.objects
-- WHERE bucket_id IN ('resources', 'avatars', 'question_papers');

COMMIT;

NOTIFY pgrst, 'reload schema';
