import { createClient } from '@supabase/supabase-js'
import type { Database } from './database.types'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Brak zmiennych VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY w pliku .env')
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)
