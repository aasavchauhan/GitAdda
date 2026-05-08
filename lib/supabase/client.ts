import { createBrowserClient } from '@supabase/ssr'
import { getSupabaseEnv } from './env'

export function createClient() {
    const { supabaseUrl, supabaseAnonKey } = getSupabaseEnv('browser')

    return createBrowserClient(
        supabaseUrl,
        supabaseAnonKey
    )
}
