import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
dotenv.config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkTriggers() {
  const { data, error } = await supabase.rpc('run_sql', { sql: `
    SELECT trigger_name 
    FROM information_schema.triggers 
    WHERE event_object_table = 'notifications';
  `});
  console.log("RPC Error (expected if not defined):", error);
}

checkTriggers();
