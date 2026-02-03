import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
    const supabase = await createClient()

    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
            redirectTo: `${request.nextUrl.origin}/auth/callback`,
        },
    })

    if (error) {
        return redirect('/login?error=auth_failed')
    }

    if (data.url) {
        return redirect(data.url)
    }

    return redirect('/login')
}
