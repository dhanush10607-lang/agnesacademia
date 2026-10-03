-- 1. Ensure the pg_net extension is enabled
create extension if not exists "pg_net";

-- 2. Create the missing schema that the Supabase Dashboard relies on
create schema if not exists "supabase_functions";

-- 3. Create the webhook wrapper function (fixes the dashboard bug)
create or replace function supabase_functions.http_request()
returns trigger as $$
  declare
    request_id bigint;
    payload jsonb;
    url text := TG_ARGV[0]::text;
    method text := TG_ARGV[1]::text;
    headers jsonb := coalesce(TG_ARGV[2]::jsonb, '{}'::jsonb);
    params jsonb := coalesce(TG_ARGV[3]::jsonb, '{}'::jsonb);
    timeout_ms integer := coalesce(TG_ARGV[4]::integer, 1000);
  begin
    payload := jsonb_build_object(
      'old_record', old,
      'record', new,
      'type', TG_OP,
      'table', TG_TABLE_NAME,
      'schema', TG_TABLE_SCHEMA
    );

    select net.http_post(
      url := url,
      body := payload,
      headers := headers,
      timeout_milliseconds := timeout_ms
    ) into request_id;

    return null;
  end;
$$ language plpgsql security definer;

-- 4. Automatically create the Webhook Trigger for Push Notifications
drop trigger if exists trigger_push_notifications on public.notifications;
create trigger trigger_push_notifications
  after insert on public.notifications
  for each row
  execute function supabase_functions.http_request(
    'https://kaufdgodohnzrydjkxsc.supabase.co/functions/v1/push-notifications', 
    'POST', 
    '{"Content-type":"application/json"}', 
    '{}', 
    '5000'
  );
