
'use server'

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'

import { StorageService } from '@/lib/services/storage'
import { DatabaseService } from '@/lib/services/database'
import { ApplicationParser } from '@/lib/parsers' // index.ts exports ApplicationParser class
import { UploadFileSchema } from '@/lib/utils/validation'

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
                        // Ignored
                    }
                },
            },
        }
    )

    const file = formData.get('file') as File | null
    if (!file) {
        return { error: 'No file provided' }
    }

    // Validate file input (size, type)
    const validation = UploadFileSchema.safeParse({ file })
    if (!validation.success) {
        // Use .issues property directly
        const firstError = validation.error.issues[0];
        return { error: firstError.message }
    }

    // 1. Authenticate user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
        return { error: 'Unauthorized' }
    }

    try {
        const buffer = Buffer.from(await file.arrayBuffer())

        // Initialize Services
        // Ideally dependency injection, but here we construct them with the request-scoped dependencies
        const parser = new ApplicationParser()
        const storageService = new StorageService(supabase)
        const dbService = new DatabaseService(supabase)

        // 3. Parse PDF
        const parsedData = await parser.parse(buffer)
        const campaignYear = parsedData.kampania_rok

        if (!campaignYear) {
            return { error: 'Nie udało się odczytać roku kampanii z pliku.' }
        }

        // 4. Upload to Storage
        const filePath = await storageService.uploadPdf(file, user.id, campaignYear)

        // 5. Save Metadata
        await dbService.createWniosek({
            rolnik_id: user.id,
            kampania_rok: campaignYear,
            nazwa_pliku: file.name,
            plik_url: filePath,
            status_parsowania: parsedData ? 'sukces' : 'blad',
            dane_json: parsedData || {},
        })

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

    // Use Service logic for consistency
    const dbService = new DatabaseService(supabase)
    try {
        return await dbService.getWnioskiByUserId(user.id)
    } catch (error) {
        console.error('getWnioski error:', error)
        return []
    }
}
