export function getSupabaseEnv(
    context: 'server' | 'browser' | 'middleware' = 'server'
): { supabaseUrl: string; supabaseAnonKey: string } {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
        const missing: string[] = []
        if (!supabaseUrl) missing.push('NEXT_PUBLIC_SUPABASE_URL')
        if (!supabaseAnonKey) missing.push('NEXT_PUBLIC_SUPABASE_ANON_KEY')

        throw new Error(
            `Missing required Supabase environment variables (${context}): ${missing.join(', ')}`
        )
    }

    return { supabaseUrl, supabaseAnonKey }
}
