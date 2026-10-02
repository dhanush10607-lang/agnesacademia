-- This script will TRUNCATE (empty) all tables in the public schema.
-- WARNING: This will permanently delete all data in the database, including users, resources, departments, etc.
-- It uses CASCADE to automatically truncate tables that have foreign key references.

DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
        EXECUTE 'TRUNCATE TABLE public.' || quote_ident(r.tablename) || ' CASCADE;';
    END LOOP;
END $$;
