import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// Polyfill __dirname for Edge Runtime compatibility
if (typeof __dirname === 'undefined') {
    (globalThis as any).__dirname = '/'
}
if (typeof __filename === 'undefined') {
    (globalThis as any).__filename = '/'
}


export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
    })

    try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

        if (!supabaseUrl || !supabaseAnonKey) {
            console.error('Missing Supabase env vars:', { supabaseUrl: !!supabaseUrl, supabaseAnonKey: !!supabaseAnonKey })
            return supabaseResponse
        }

        const supabase = createServerClient(
            supabaseUrl,
            supabaseAnonKey,
            {
                cookies: {
                    getAll() {
                        return request.cookies.getAll()
                    },
                    setAll(cookiesToSet) {
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
        console.error('Middleware error:', e)
    }

    return supabaseResponse
}

