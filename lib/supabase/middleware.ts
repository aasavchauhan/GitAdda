import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { getSupabaseEnv } from './env'


export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
    })

    try {
        const { supabaseUrl, supabaseAnonKey } = getSupabaseEnv()

        const supabase = createServerClient(
            supabaseUrl,
            supabaseAnonKey,
            {
                cookies: {
                    getAll() {
                        return request.cookies.getAll()
                    },
                    setAll(cookiesToSet: { name: string; value: string; options: any }[]) {
                        cookiesToSet.forEach(({ name, value }) =>
                            request.cookies.set(name, value)
                        )
                        supabaseResponse = NextResponse.next({
                            request,
                        })
                        cookiesToSet.forEach(({ name, value, options }) =>
                            supabaseResponse.cookies.set(name, value, options)
                        )
                    },
                },
                auth: {
                    autoRefreshToken: false,
                    persistSession: true,
                    detectSessionInUrl: false,
                },
                realtime: {
                    transport: undefined,
                },
            }
        )

        // Refresh session if expired
        await supabase.auth.getUser()
    } catch (e) {
        console.error('Middleware error:', e instanceof Error ? e.message : e)
    }

    return supabaseResponse
}
