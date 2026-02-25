import { NextRequest, NextResponse } from 'next/server'
import { ApplicationParser } from '@/lib/parsers'
import { UploadFileSchema } from '@/lib/utils/validation'

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData()
        const file = formData.get('file') as File | null

        if (!file) {
            return NextResponse.json(
                { error: 'Nie przesłano pliku PDF.' },
                { status: 400 }
            )
        }

        // Validate file input (size, type) using Zod schema
        const validation = UploadFileSchema.safeParse({ file })
        if (!validation.success) {
            const firstError = validation.error.issues[0];
            return NextResponse.json(
                { error: firstError.message },
                { status: 400 }
            )
        }

        // Konwersja File -> Buffer
        const arrayBuffer = await file.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)

        // Parsowanie PDF z AI / Regex strategy
        const parser = new ApplicationParser()
        const parsedData = await parser.parse(buffer)

        return NextResponse.json({
            success: true,
            nazwa_pliku: file.name,
            rozmiar_bytes: file.size,
            dane: parsedData,
        })
    } catch (error) {
        console.error('Błąd w API /api/pdf:', error)

        const message = error instanceof Error ? error.message : 'Nieznany błąd serwera'

        return NextResponse.json(
            { error: `Błąd parsowania PDF: ${message}` },
            { status: 500 }
        )
    }
}
