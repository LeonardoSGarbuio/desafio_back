import { createClient, SupabaseClient } from '@supabase/supabase-js';

const rawSupabaseUrl = process.env.SUPABASE_URL?.trim();
const supabaseUrl = rawSupabaseUrl?.replace(/\/rest\/v1\/?$/, '').replace(/\/+$/, '');
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

export const SUPABASE_BUCKET = process.env.SUPABASE_BUCKET?.trim() || 'course-thumbnails';

// Só instancia o cliente do Supabase se as variáveis estiverem preenchidas no .env
export const supabase: SupabaseClient | null =
  supabaseUrl && supabaseKey
    ? createClient(supabaseUrl, supabaseKey)
    : null;
