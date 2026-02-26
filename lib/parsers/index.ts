// eslint-disable-next-line @typescript-eslint/no-require-imports
const pdfParseModule = require('pdf-parse')

import { ParsedWniosek } from './types'
import { AiApplicationParser } from './AiApplicationParser'
import { RegexApplicationParser } from './RegexApplicationParser'
import { removeNonPrintable } from '@/lib/rag/text-utils'

const aiParser = new AiApplicationParser()
const regexParser = new RegexApplicationParser()

export async function parsePdfApplication(buffer: Buffer): Promise<ParsedWniosek> {
    try {
        let text = ''

        // Handle pdf-parse v2 (class based)
        if (pdfParseModule.PDFParse) {
             const parser = new pdfParseModule.PDFParse(new Uint8Array(buffer))
             const result = await parser.getText()
             text = result.text
        }
        // Handle pdf-parse v1 (function based)
        else if (typeof pdfParseModule === 'function') {
             const data = await pdfParseModule(buffer)
             text = data.text
        }
        else if (pdfParseModule.default && typeof pdfParseModule.default === 'function') {
             const data = await pdfParseModule.default(buffer)
             text = data.text
        }
        else {
             throw new Error('Unsupported pdf-parse version or import')
        }

        const cleanText = removeNonPrintable(text)

        if (!cleanText || cleanText.length < 50) {
            throw new Error('Wyodrębniony tekst jest zbyt krótki lub pusty.')
        }

        try {
            console.log('Attempting AI parsing...')
            return await aiParser.parse(cleanText)
        } catch (aiError) {
            console.warn('AI parsing failed, falling back to Regex:', aiError)
        }

        console.log('Attempting Regex parsing...')
        return await regexParser.parse(cleanText)
    } catch (error) {
        console.error('Krytyczny błąd parsowania:', error)
        throw error
    }
}

export * from './types'
export * from './BaseParser'
export * from './AiApplicationParser'
export * from './RegexApplicationParser'
