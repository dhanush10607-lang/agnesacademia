CREATE TABLE IF NOT EXISTS public.deleted_account_archives (
    user_id UUID PRIMARY KEY,
    email TEXT,
    deleted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    account_data JSONB NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.deleted_account_archives ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Administrators can view deleted account archives"
    ON public.deleted_account_archives;
CREATE POLICY "Administrators can view deleted account archives"
    ON public.deleted_account_archives
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1
            FROM public.profiles
            WHERE id = auth.uid()
              AND role = 'administrator'
        )
    );

REVOKE ALL ON public.deleted_account_archives FROM anon;
GRANT SELECT ON public.deleted_account_archives TO authenticated;
GRANT ALL ON public.deleted_account_archives TO service_role;

CREATE OR REPLACE FUNCTION public.archive_deleted_account(p_user_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, auth
AS $$
DECLARE
    v_user JSONB;
    v_public_records JSONB := '{}'::JSONB;
    v_table RECORD;
    v_filter TEXT;
    v_rows JSONB;
BEGIN
    IF auth.role() IS DISTINCT FROM 'service_role' THEN
        RAISE EXCEPTION 'Only the service role can archive deleted accounts';
    END IF;

    SELECT jsonb_build_object(
        'id', id,
        'email', email,
        'phone', phone,
        'created_at', created_at,
        'updated_at', updated_at,
        'last_sign_in_at', last_sign_in_at,
        'email_confirmed_at', email_confirmed_at,
        'phone_confirmed_at', phone_confirmed_at,
        'user_metadata', raw_user_meta_data,
        'app_metadata', raw_app_meta_data,
        'is_anonymous', is_anonymous
    )
    INTO v_user
    FROM auth.users
    WHERE id = p_user_id;

    IF v_user IS NULL THEN
        RAISE EXCEPTION 'The account to archive does not exist';
    END IF;

    FOR v_table IN
        SELECT
            table_ns.nspname AS schema_name,
            table_class.relname AS table_name,
            array_agg(DISTINCT table_column.attname ORDER BY table_column.attname) AS user_columns
        FROM pg_catalog.pg_constraint AS foreign_key
        JOIN pg_catalog.pg_class AS table_class
            ON table_class.oid = foreign_key.conrelid
        JOIN pg_catalog.pg_namespace AS table_ns
            ON table_ns.oid = table_class.relnamespace
        JOIN pg_catalog.pg_class AS referenced_class
            ON referenced_class.oid = foreign_key.confrelid
        JOIN pg_catalog.pg_namespace AS referenced_ns
            ON referenced_ns.oid = referenced_class.relnamespace
        JOIN LATERAL unnest(foreign_key.conkey) WITH ORDINALITY AS table_key(attnum, position)
            ON TRUE
        JOIN LATERAL unnest(foreign_key.confkey) WITH ORDINALITY AS referenced_key(attnum, position)
            ON referenced_key.position = table_key.position
        JOIN pg_catalog.pg_attribute AS table_column
            ON table_column.attrelid = table_class.oid
           AND table_column.attnum = table_key.attnum
        JOIN pg_catalog.pg_attribute AS referenced_column
            ON referenced_column.attrelid = referenced_class.oid
           AND referenced_column.attnum = referenced_key.attnum
        WHERE foreign_key.contype = 'f'
          AND cardinality(foreign_key.conkey) = 1
          AND table_ns.nspname = 'public'
          AND (
              (referenced_ns.nspname = 'public'
               AND referenced_class.relname = 'profiles'
               AND referenced_column.attname = 'id')
              OR
              (referenced_ns.nspname = 'auth'
               AND referenced_class.relname = 'users'
               AND referenced_column.attname = 'id')
          )
        GROUP BY table_ns.nspname, table_class.relname
    LOOP
        SELECT string_agg(format('%I = $1', user_column), ' OR ')
        INTO v_filter
        FROM unnest(v_table.user_columns) AS columns_to_match(user_column);

        EXECUTE format(
            'SELECT COALESCE(jsonb_agg(to_jsonb(account_row) - %L), ''[]''::JSONB)
             FROM %I.%I AS account_row
             WHERE %s',
            'registration_token',
            v_table.schema_name,
            v_table.table_name,
            v_filter
        )
        INTO v_rows
        USING p_user_id;

        v_public_records := v_public_records || jsonb_build_object(
            format('%I.%I', v_table.schema_name, v_table.table_name),
            v_rows
        );
    END LOOP;

    INSERT INTO public.deleted_account_archives (user_id, email, account_data)
    VALUES (
        p_user_id,
        v_user ->> 'email',
        jsonb_build_object(
            'auth_user', v_user,
            'public_records', v_public_records
        )
    )
    ON CONFLICT (user_id) DO UPDATE
    SET email = EXCLUDED.email,
        deleted_at = NOW(),
        account_data = EXCLUDED.account_data;
END;
$$;

REVOKE ALL ON FUNCTION public.archive_deleted_account(UUID) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.archive_deleted_account(UUID) TO service_role;
