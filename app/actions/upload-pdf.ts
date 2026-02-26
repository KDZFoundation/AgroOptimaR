'use server'

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { parsePdfApplication } from '@/lib/parsers'
import { revalidatePath } from 'next/cache'

export async function uploadPdf(formData: FormData) {
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
                    } catch {
                        // The `setAll` method was called from a Server Component.
                        // This can be ignored if you have middleware refreshing
                        // user sessions.
                    }
                },
            },
        }
    )

    const file = formData.get('file') as File | null
    if (!file) {
        return { error: 'No file provided' }
    }

    // 1. Authenticate user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
        return { error: 'Unauthorized' }
    }

    // 2. Validate file type
    if (file.type !== 'application/pdf') {
        return { error: 'Only PDF files are allowed' }
    }

    try {
        const buffer = Buffer.from(await file.arrayBuffer())

        // 3. Parse PDF to get metadata (especially Campaign Year)
        const parsedData = await parsePdfApplication(buffer)
        const campaignYear = parsedData?.kampania_rok

        if (!campaignYear) {
            return { error: 'Nie udało się odczytać roku kampanii z pliku.' }
        }

        // 4. Upload to Supabase Storage
        const fileName = `${user.id}/${campaignYear}_${Date.now()}_${file.name}`
        const { data: uploadData, error: uploadError } = await supabase
            .storage
            .from('wnioski')
            .upload(fileName, file)

        if (uploadError) {
            console.error('Upload error:', uploadError)
            return { error: 'Failed to upload file to storage' }
        }

        // 5. Save metadata to Database
        const { error: dbError } = await supabase
            .from('wnioski_pdf')
            .insert({
                rolnik_id: user.id,
                kampania_rok: campaignYear,
                nazwa_pliku: file.name,
                plik_url: uploadData.path,
                status_parsowania: parsedData ? 'sukces' : 'blad',
                dane_json: parsedData || {},
            })

        if (dbError) {
            console.error('Database error:', dbError)
            return { error: 'Failed to save application metadata' }
        }

        revalidatePath('/wnioski-pdf')
        return { success: true, year: campaignYear, dane: parsedData }
    } catch (error: any) {
        console.error('Process error:', error)
        return { error: error.message || 'An unexpected error occurred' }
    }
}

export async function getWnioski() {
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
                    } catch { }
                },
            },
        }
    )

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return []

    const { data, error } = await supabase
        .from('wnioski_pdf')
        .select('*')
        .eq('rolnik_id', user.id)
        .order('kampania_rok', { ascending: false })

    if (error) {
        console.error('Fetch error:', error)
        return []
    }

    return data
}
