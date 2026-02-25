
import Anthropic from '@anthropic-ai/sdk';
import { ParsedWniosek } from '@/types';
import { extractJsonFromResponse } from '@/lib/rag/text-utils';
import { redactPii } from '@/lib/utils/pii';

export class AiApplicationParser {
    private anthropic: Anthropic;

    constructor(apiKey?: string) {
        this.anthropic = new Anthropic({
            apiKey: apiKey || process.env.ANTHROPIC_API_KEY || '',
        });
    }

    /**
     * Parses the application text using Anthropic's Claude model.
     * Returns null if API key is missing or parsing fails.
     */
    async parse(text: string): Promise<ParsedWniosek | null> {
        // If no API key is set (and wasn't provided in constructor), we can't use AI.
        // The SDK might throw on instantiation if key is missing, but we handle it gracefully.
        if (!this.anthropic.apiKey) {
            console.warn('AiApplicationParser: No API Key provided, skipping AI parsing.');
            return null;
        }

        try {
            // Apply PII redaction before sending to LLM
            const safeText = redactPii(text);

            const response = await this.anthropic.messages.create({
                model: 'claude-3-5-sonnet-20241022',
                max_tokens: 4000,
                system: `Jesteś systemem analizy wniosków ARiMR. Ekstrahuj dane do JSON:
                {
                    "kampania_rok": number,
                    "podmiot": { "ep": string, "nazwa": string, "adres": string },
                    "dzialki": [{ "nr_dzialki": string, "pow_dzialki_ha": number, "uprawa": string, "kod_uprawy": string, "platnosci": string[] }],
                    "ekoschematy_ogolne": string[]
                }`,
                messages: [{ role: 'user', content: safeText }]
            });

            const contentBlock = response.content[0];
            const aiText = contentBlock.type === 'text' ? contentBlock.text : '';

            const aiData = extractJsonFromResponse(aiText);

            if (aiData) {
                // Calculate summary logic
                const summary = {
                    liczba_dzialek: Array.isArray(aiData.dzialki) ? aiData.dzialki.length : 0,
                    calkowita_powierzchnia_ha: Array.isArray(aiData.dzialki)
                        ? Math.round(aiData.dzialki.reduce((sum: number, d: any) => sum + (Number(d.pow_dzialki_ha) || 0), 0) * 100) / 100
                        : 0
                };

                return {
                    ...aiData,
                    podsumowanie: summary
                } as ParsedWniosek;
            }

            return null;
        } catch (error) {
            console.error('AiApplicationParser error:', error);
            // We return null to allow the fallback strategy (Regex) to take over
            return null;
        }
    }
}
