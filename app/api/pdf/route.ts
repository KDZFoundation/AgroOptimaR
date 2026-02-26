import { NextRequest, NextResponse } from 'next/server'
import { parsePdfApplication } from '@/lib/parsers'

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

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

        // Walidacja typu pliku
        if (!file.name.toLowerCase().endsWith('.pdf') && file.type !== 'application/pdf') {
            return NextResponse.json(
                { error: 'Przesłany plik nie jest plikiem PDF.' },
                { status: 400 }
            )
        }

        // Walidacja rozmiaru
        if (file.size > MAX_FILE_SIZE) {
            return NextResponse.json(
                { error: `Plik jest za duży. Maksymalny rozmiar: ${MAX_FILE_SIZE / 1024 / 1024}MB.` },
                { status: 400 }
            )
        }

        // Konwersja File -> Buffer
        const arrayBuffer = await file.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)

        // Parsowanie PDF z AI
        const parsedData = await parsePdfApplication(buffer)

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
