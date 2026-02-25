import { createServerClient, type CookieOptions } from '@supabase/ssr'
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
                get(name: string) {
                    return request.cookies.get(name)?.value
                },
                set(name: string, value: string, options: CookieOptions) {
                    request.cookies.set({
                        name,
                        value,
                        ...options,
                    })
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    })
                    response.cookies.set({
                        name,
                        value,
                        ...options,
                    })
                },
                remove(name: string, options: CookieOptions) {
                    request.cookies.set({
                        name,
                        value: '',
                        ...options,
                    })
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    })
                    response.cookies.set({
                        name,
                        value: '',
                        ...options,
                    })
                },
            },
        }
    )

    const { data: { user } } = await supabase.auth.getUser()

    // Ochrona tras /(dashboard)/
    // Zakładamy, że trasy dashboardu nie mają prefixu /dashboard, ale są w grupach tras
    // Jednak w App Routerze grupy tras /() nie pojawiają się w URL.
    // Musimy sprawdzić po konkretnych ścieżkach lub wykluczyć /login i /rejestracja.

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

         // Jeśli nie ma profilu lub rola nie jest admin, przekieruj
         // W rzeczywistości warto to cachować lub trzymać w metadanych użytkownika (custom claims)
         // dla wydajności, ale na start zapytanie DB wystarczy.
         if (!profile || profile.role !== 'admin') {
             return NextResponse.redirect(new URL('/pulpit', request.url))
         }
    }

    return response
}
