import { createClient } from '@supabase/supabase-js';
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function test() {
  const { data, error } = await supabase.from('departments').insert({ name: 'Test Dept', description: 'Test' }).select().single();
  if (error) {
    console.error('Insert Error:', error);
  } else {
    console.log('Inserted:', data);
  }
}
test();
