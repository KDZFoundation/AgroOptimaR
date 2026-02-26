import { ApplicationParser } from './BaseParser'
import { ParsedWniosek } from './types'
import Anthropic from '@anthropic-ai/sdk'
import { extractJsonFromResponse } from '@/lib/rag/text-utils'

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY || '',
})

export class AiApplicationParser extends ApplicationParser {
    async parse(text: string): Promise<ParsedWniosek> {
        if (!process.env.ANTHROPIC_API_KEY) {
            throw new Error('Missing ANTHROPIC_API_KEY')
        }

        const response = await anthropic.messages.create({
            model: 'claude-3-5-sonnet-20241022',
            max_tokens: 4000,
            system: `Jesteś systemem analizy wniosków ARiMR. Ekstrahuj dane do JSON:
            {
                "kampania_rok": number,
                "podmiot": { "ep": string, "nazwa": string, "adres": string },
                "dzialki": [{ "nr_dzialki": string, "pow_dzialki_ha": number, "uprawa": string, "kod_uprawy": string, "platnosci": string[] }],
                "ekoschematy_ogolne": string[]
            }`,
            messages: [{ role: 'user', content: text }]
        })

        const aiData = extractJsonFromResponse(response.content[0].type === 'text' ? response.content[0].text : '')

        if (!aiData) {
            throw new Error('AI failed to return valid JSON')
        }

        return {
            ...aiData,
            podsumowanie: {
                liczba_dzialek: aiData.dzialki?.length || 0,
                calkowita_powierzchnia_ha: Math.round((aiData.dzialki || []).reduce((sum: number, d: any) => sum + d.pow_dzialki_ha, 0) * 100) / 100
            }
        } as ParsedWniosek
    }
}
