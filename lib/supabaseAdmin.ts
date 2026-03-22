import { createClient } from '@supabase/supabase-js';

// Usa service role key solo si está correctamente configurada (no es placeholder)
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? '';
const anonKey    = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const apiKey     = serviceKey.length > 30 && !serviceKey.includes('...') ? serviceKey : anonKey;

export const db = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  apiKey,
);
