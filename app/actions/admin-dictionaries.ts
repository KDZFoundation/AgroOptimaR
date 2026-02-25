'use server'

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'

export async function addUprawa(formData: FormData) {
    const cookieStore = await cookies()
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll()
                },
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookieStore.set(name, value, options)
                        )
                    } catch {}
                },
            },
        }
    )

    // Check permissions
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Unauthorized' }

    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
    if (profile?.role !== 'admin') return { error: 'Forbidden' }

    // Parse data
    const kod = formData.get('kod') as string
    const nazwa = formData.get('nazwa') as string
    const grupa = formData.get('grupa') as string
    const czy_wspierana = formData.get('czy_wspierana') === 'on'

    if (!kod || !nazwa) return { error: 'Missing fields' }

    const { error } = await supabase.from('slownik_uprawy').insert({
        kod,
        nazwa,
        grupa,
        czy_wspierana
    })

    if (error) return { error: error.message }

    revalidatePath('/admin/slowniki/uprawy')
    return { success: true }
}

export async function getUprawy() {
    const cookieStore = await cookies()
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() { return cookieStore.getAll() },
                setAll(cookiesToSet) { try { cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options)) } catch {} }
            }
        }
    )

    const { data } = await supabase.from('slownik_uprawy').select('*').order('kod')
    return data || []
}

export async function deleteUprawa(id: string) {
    const cookieStore = await cookies()
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() { return cookieStore.getAll() },
                setAll(cookiesToSet) { try { cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options)) } catch {} }
            }
        }
    )

     // Check permissions
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Unauthorized' }

    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
    if (profile?.role !== 'admin') return { error: 'Forbidden' }

    const { error } = await supabase.from('slownik_uprawy').delete().eq('id', id)
    if (error) return { error: error.message }

    revalidatePath('/admin/slowniki/uprawy')
    return { success: true }
}
