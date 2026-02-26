import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        response.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    const { data: { user } } = await supabase.auth.getUser()

    // Ochrona tras /(dashboard)/
    const publicPaths = ['/login', '/rejestracja', '/auth/callback']
    const isPublicPath = publicPaths.some(path => request.nextUrl.pathname.startsWith(path))

    if (!user && !isPublicPath && request.nextUrl.pathname !== '/') {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    if (user && isPublicPath) {
        return NextResponse.redirect(new URL('/pulpit', request.url))
    }

    // Ochrona tras admina
    if (user && request.nextUrl.pathname.startsWith('/admin')) {
         const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single()

         if (!profile || profile.role !== 'admin') {
             return NextResponse.redirect(new URL('/pulpit', request.url))
         }
    }

    return response
}
