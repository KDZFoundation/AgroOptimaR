// eslint-disable-next-line @typescript-eslint/no-require-imports
const pdf = require('pdf-parse')
import Anthropic from '@anthropic-ai/sdk'
import { removeNonPrintable, extractJsonFromResponse, normalizeParcelNumber } from './text-utils'

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY || '',
})


// ─── Typy ────────────────────────────────────────────────────────

export interface ParsedDzialka {
    nr_dzialki: string
    pow_dzialki_ha: number
    uprawa: string
    kod_uprawy: string
    platnosci: string[]
}

export interface ParsedPodmiot {
    ep: string
    nazwa: string
    adres: string
}

export interface ParsedWniosek {
    kampania_rok?: number
    podmiot: ParsedPodmiot
    dzialki: ParsedDzialka[]
    ekoschematy_ogolne: string[]
    podsumowanie: {
        liczba_dzialek: number
        calkowita_powierzchnia_ha: number
    }
}


// ─── Stałe / Regexy ─────────────────────────────────────────────

/** Litery A-K używane jako kody upraw we wnioskach ARiMR */
const CROP_LETTER_REGEX = /^([A-K])\s+([a-zA-ZĄĆĘŁŃÓŚŹŻąćęłńóśźż\s]+?)(?:\s+(NIE|TAK))?$/

/** Nagłówek sekcji uprawy: "C owies zwyczajny" */
const SECTION_HEADER_REGEX = /^([A-K])\s+([a-zA-ZĄĆĘŁŃÓŚŹŻąćęłńóśźż\s]+)$/

/** Numer działki: "126/55" lub ".126/55" */
const PARCEL_NUMBER_REGEX = /^\.?(\d+\/\d+)$/

/** Powierzchnia + kody płatności: "16 35  ONW, PWD, UPP, E_IPR" */
const AREA_PAYMENTS_REGEX = /^(\d+\s+\d+)\s+([A-Z_,\s]+)$/

/** Numer EP (9 cyfr) */
const EP_REGEX = /\b(\d{9})\b/

/** Ekoschematy (E_XXX) */
const ECOSCHEME_REGEX = /\bE_[A-Z]{2,5}\b/g

// ─── Główna funkcja ─────────────────────────────────────────────

/**
 * Parsuje bufor PDF wniosku ARiMR i zwraca ustrukturyzowane dane.
 * Próbuje najpierw wywołać AI (Claude), a w przypadku błędu lub braku klucza
 * przechodzi na lokalny silnik Regex.
 */
export async function parsePdfApplication(buffer: Buffer): Promise<ParsedWniosek> {
    try {
        const data = await pdf(buffer)
        const cleanText = removeNonPrintable(data.text)

        if (!cleanText || cleanText.length < 50) {
            throw new Error('Wyodrębniony tekst jest zbyt krótki lub pusty.')
        }

        // Próba z AI (jeśli klucz jest dostępny)
        if (process.env.ANTHROPIC_API_KEY) {
            try {
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
                    messages: [{ role: 'user', content: cleanText }]
                })

                const aiData = extractJsonFromResponse(response.content[0].type === 'text' ? response.content[0].text : '')
                if (aiData) {
                    return {
                        ...aiData,
                        podsumowanie: {
                            liczba_dzialek: aiData.dzialki.length,
                            calkowita_powierzchnia_ha: Math.round(aiData.dzialki.reduce((sum: number, d: any) => sum + d.pow_dzialki_ha, 0) * 100) / 100
                        }
                    }
                }
            } catch (aiError) {
                console.error('Błąd AI, przełączanie na Regex:', aiError)
            }
        }

        // Fallback: Lokalny silnik Regex
        const lines = cleanText.split('\n').map(l => l.trim()).filter(l => l.length > 0)
        const podmiot = extractPodmiot(lines)
        const cropMap = buildCropMap(lines)
        const dzialki = extractDzialki(lines, cropMap)
        const ekoschematy = extractEkoschematy(cleanText)
        const calkowitaPowierzchnia = dzialki.reduce((sum, d) => sum + d.pow_dzialki_ha, 0)

        return {
            podmiot,
            dzialki,
            ekoschematy_ogolne: ekoschematy,
            podsumowanie: {
                liczba_dzialek: dzialki.length,
                calkowita_powierzchnia_ha: Math.round(calkowitaPowierzchnia * 100) / 100,
            },
        }
    } catch (error) {
        console.error('Krytyczny błąd parsowania:', error)
        throw error
    }
}

// ─── Ekstrakcja podmiotu ─────────────────────────────────────────

function extractPodmiot(lines: string[]): ParsedPodmiot {
    let ep = ''
    let nazwa = ''
    let adres = ''

    for (let i = 0; i < Math.min(lines.length, 100); i++) {
        const line = lines[i]

        // Szukaj 9-cyfrowego numeru EP
        if (!ep) {
            const epMatch = line.match(EP_REGEX)
            if (epMatch) {
                ep = epMatch[1]
            }
        }

        // Szukaj nazwy/imienia po typowych nagłówkach
        if (!nazwa && /^(Imię|Nazwisko|Nazwa|Wnioskodawca|Producent)/i.test(line)) {
            // Nazwa może być w tej samej linii lub w następnej
            const afterColon = line.split(/[:\-]/)[1]?.trim()
            if (afterColon && afterColon.length > 2) {
                nazwa = afterColon
            } else if (i + 1 < lines.length) {
                nazwa = lines[i + 1]
            }
        }

        // Szukaj adresu
        if (!adres && /^(Adres|Miejscowość|Ulica|Kod pocztowy)/i.test(line)) {
            const afterColon = line.split(/[:\-]/)[1]?.trim()
            if (afterColon && afterColon.length > 2) {
                adres = afterColon
            } else if (i + 1 < lines.length) {
                adres = lines[i + 1]
            }
        }
    }

    return { ep, nazwa, adres }
}

// ─── Budowanie mapy upraw ────────────────────────────────────────

function buildCropMap(lines: string[]): Record<string, string> {
    const cropMap: Record<string, string> = {}

    // Szukamy wzorców: "A pszenica zwyczajna ozima  NIE/TAK"
    lines.forEach(line => {
        const match = line.match(CROP_LETTER_REGEX)
        if (match) {
            const letter = match[1]
            const crop = match[2].trim()
            if (crop.length > 2) {
                cropMap[letter] = crop
            }
        }
    })

    return cropMap
}

// ─── Ekstrakcja działek ──────────────────────────────────────────

function extractDzialki(lines: string[], cropMap: Record<string, string>): ParsedDzialka[] {
    let currentLetter = ''
    let currentCrop = ''
    const results: ParsedDzialka[] = []

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i]

        // Wykrywanie nagłówka sekcji: "C owies zwyczajny"
        const headerMatch = line.match(SECTION_HEADER_REGEX)
        if (headerMatch && headerMatch[2].length > 2) {
            currentLetter = headerMatch[1]
            currentCrop = cropMap[currentLetter] || headerMatch[2].trim()
            continue
        }

        // Wykrywanie litery w oddzielnej linii, z nazwą uprawy w następnej
        if (line.length === 1 && line >= 'A' && line <= 'K') {
            if (i + 1 < lines.length && /^[a-ząćęłńóśźż]+/i.test(lines[i + 1])) {
                currentLetter = line
                currentCrop = cropMap[currentLetter] || lines[i + 1].trim()
                i++
                continue
            }
        }

        // Wykrywanie numeru działki
        const parcelMatch = line.match(PARCEL_NUMBER_REGEX)
        if (parcelMatch && currentLetter) {
            const parcelNumber = normalizeParcelNumber(parcelMatch[1])

            // Szukamy danych w następnych liniach (max 5)
            for (let j = 1; j <= 5; j++) {
                if (i + j >= lines.length) break
                const nextLine = lines[i + j]

                const dataMatch = nextLine.match(AREA_PAYMENTS_REGEX)
                if (dataMatch) {
                    const areaStr = dataMatch[1].replace(' ', '.')
                    const paymentsStr = dataMatch[2].trim()

                    const area = parseFloat(areaStr)
                    const platnosci = paymentsStr
                        .split(/[,\s]+/)
                        .map(p => p.trim())
                        .filter(p => p.length > 0)

                    results.push({
                        nr_dzialki: parcelNumber,
                        pow_dzialki_ha: isNaN(area) ? 0 : area,
                        uprawa: currentCrop,
                        kod_uprawy: currentLetter,
                        platnosci,
                    })
                    break
                }
            }
        }
    }

    return results
}

// ─── Ekstrakcja ekoschematów ─────────────────────────────────────

function extractEkoschematy(text: string): string[] {
    const matches = text.match(ECOSCHEME_REGEX)
    if (!matches) return []
    return [...new Set(matches)].sort()
}
