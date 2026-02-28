import { updateSession } from '@/lib/supabase/middleware'

// Polyfill __dirname for Edge Runtime compatibility
if (typeof __dirname === 'undefined') {
    (globalThis as any).__dirname = '/'
}
if (typeof __filename === 'undefined') {
    (globalThis as any).__filename = '/'
}

export async function middleware(request: NextRequest) {
    return await updateSession(request)
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
