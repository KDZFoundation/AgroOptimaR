// @ts-ignore
import * as pdf from 'pdf-parse'
import Anthropic from '@anthropic-ai/sdk'
import { removeNonPrintable, extractJsonFromResponse } from './text-utils'

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY || '',
})

export async function parsePdfApplication(buffer: Buffer) {
    try {
        // @ts-ignore
        const data = await pdf(buffer)

        // Czyszczenie tekstu wyodrębnionego z PDF
        const cleanText = removeNonPrintable(data.text)

        if (!cleanText || cleanText.length < 100) {
            throw new Error('Wyodrębniony tekst jest zbyt krótki lub pusty. Możliwy błąd odczytu PDF.')
        }

        // Prompt dla Claude do ekstrakcji ustrukturyzowanych danych
        const response = await anthropic.messages.create({
            model: 'claude-opus-4-6',
            max_tokens: 8000,
            system: `Jesteś zaawansowanym systemem analizy wniosków o dopłaty bezpośrednie ARiMR.
Twoim zadaniem jest dokładna ekstrakcja danych z tekstu wniosku do ustrukturyzowanego formatu JSON.

WYMAGANA STRUKTURA JSON:
{
  "podmiot": {
    "ep": "9-cyfrowy numer",
    "nazwa": "Nazwa gospodarstwa/rolnika",
    "adres": "Pełny adres"
  },
  "dzialki": [
    {
      "nr_dzialki": "np. 123/4",
      "pow_dzialki_ha": 1.23,
      "uprawa": "np. pszenica ozima",
      "kod_uprawy": "A",
      "platnosci": ["JPO", "E_WSG"]
    }
  ],
  "ekoschematy_ogolne": ["KOD1", "KOD2"],
  "podsumowanie": {
    "liczba_dzialek": 0,
    "calkowita_powierzchnia_ha": 0.0
  }
}

ZASADY:
1. EP: Numer Producenta musi mieć 9 cyfr.
2. Powierzchnia: Zawsze jako liczba (float), nie tekst.
3. Kody płatności: Wyciągnij kody takie jak JPO, uzupełniająca, ekoschematy (E_...).
4. Jeśli dana wartość jest niepewna, pomiń ją lub zostaw null, nie zmyślaj danych.

Zwróć TYLKO i WYŁĄCZNIE obiekt JSON.`,
            messages: [
                {
                    role: 'user',
                    content: `Przeanalizuj poniższy tekst wniosku i wyodrębnij dane zgodnie ze schematem:\n\n${cleanText}`
                }
            ]
        })

        const content = response.content[0].type === 'text' ? response.content[0].text : ''
        const parsedData = extractJsonFromResponse(content)

        if (!parsedData) {
            console.error('Nie udało się sparować JSON z odpowiedzi Claude:', content)
            return { raw_content: content, error: 'Błąd formatowania odpowiedzi AI' }
        }

        // Post-processing dla lepszej poprawności (inspirowane Open Notebook/AgroOptima)
        if (parsedData.podmiot?.ep) {
            parsedData.podmiot.ep = parsedData.podmiot.ep.toString().replace(/\s/g, '')
        }

        if (Array.isArray(parsedData.dzialki)) {
            parsedData.dzialki = parsedData.dzialki.map((d: any) => ({
                ...d,
                nr_dzialki: typeof d.nr_dzialki === 'string' ? d.nr_dzialki.replace(/\s/g, '') : d.nr_dzialki,
                pow_dzialki_ha: typeof d.pow_dzialki_ha === 'string' ? parseFloat(d.pow_dzialki_ha.replace(',', '.')) : d.pow_dzialki_ha
            }))
        }

        return parsedData
    } catch (error) {
        console.error('Błąd podczas procesowania wniosku PDF:', error)
        throw error
    }
}

