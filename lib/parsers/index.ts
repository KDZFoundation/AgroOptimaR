
// Use require for pdf-parse compatibility
// eslint-disable-next-line @typescript-eslint/no-require-imports
const pdfParseModule = require('pdf-parse');
// pdf-parse might return { default: fn } in ESM/Turbopack environments
const pdf = typeof pdfParseModule === 'function' ? pdfParseModule : pdfParseModule.default;

import { removeNonPrintable } from '@/lib/rag/text-utils';
import { AiApplicationParser } from './ai-parser';
import { RegexApplicationParser } from './regex-parser';
import { ParsedWniosek } from '@/types';

export class ApplicationParser {
    private aiParser: AiApplicationParser;
    private regexParser: RegexApplicationParser;

    constructor() {
        this.aiParser = new AiApplicationParser();
        this.regexParser = new RegexApplicationParser();
    }

    /**
     * Parses the PDF buffer. Tries AI first, falls back to Regex.
     */
    async parse(buffer: Buffer): Promise<ParsedWniosek> {
        let text = '';

        try {
            const data = await pdf(buffer);
            text = removeNonPrintable(data.text);
        } catch (error: any) {
            throw new Error(`Failed to extract text from PDF: ${error.message}`);
        }

        if (!text || text.length < 50) {
            throw new Error('Wyodrębniony tekst jest zbyt krótki lub pusty.');
        }

        // Try AI Parsing
        try {
            const aiResult = await this.aiParser.parse(text);
            if (aiResult) {
                return aiResult;
            }
        } catch (error) {
            console.warn('AI Parser encountered an error, falling back to Regex:', error);
            // Continue to fallback
        }

        // Fallback to Regex Parsing
        try {
            console.info('Using Regex parser fallback.');
            return this.regexParser.parse(text);
        } catch (error: any) {
             throw new Error(`Regex parsing failed: ${error.message}`);
        }
    }
}

// Export a singleton or factory function for easier usage if needed
export const parsePdfApplication = async (buffer: Buffer) => {
    const parser = new ApplicationParser();
    return parser.parse(buffer);
};
