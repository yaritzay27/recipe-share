import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'YOUR_SUPABASE_URL'
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY'

const hasRealSupabaseUrl =
  /^https?:\/\//.test(supabaseUrl) && !supabaseUrl.includes('YOUR_SUPABASE_URL')

export const isSupabaseConfigured =
  hasRealSupabaseUrl && supabaseAnonKey !== 'YOUR_SUPABASE_ANON_KEY'

export const supabase = createClient(
  hasRealSupabaseUrl ? supabaseUrl : 'https://placeholder.supabase.co',
  supabaseAnonKey,
)

