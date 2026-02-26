import { ApplicationParser } from './BaseParser'
import { ParsedWniosek, ParsedDzialka, ParsedPodmiot } from './types'
import { normalizeParcelNumber } from '@/lib/rag/text-utils'

const CROP_LETTER_REGEX = /^([A-K])\s+([a-zA-ZĄĆĘŁŃÓŚŹŻąćęłńóśźż\s]+?)(?:\s+(NIE|TAK))?$/
const SECTION_HEADER_REGEX = /^([A-K])\s+([a-zA-ZĄĆĘŁŃÓŚŹŻąćęłńóśźż\s]+)$/
const PARCEL_NUMBER_REGEX = /^\.?(\d+\/\d+)$/
const AREA_PAYMENTS_REGEX = /^(\d+\s+\d+)\s+([A-Z_,\s]+)$/
const EP_REGEX = /\b(\d{9})\b/
const ECOSCHEME_REGEX = /\bE_[A-Z]{2,5}\b/g

export class RegexApplicationParser extends ApplicationParser {
    async parse(text: string): Promise<ParsedWniosek> {
        const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0)
        const podmiot = this.extractPodmiot(lines)
        const cropMap = this.buildCropMap(lines)
        const dzialki = this.extractDzialki(lines, cropMap)
        const ekoschematy_ogolne = this.extractEkoschematy(text)
        const calkowitaPowierzchnia = dzialki.reduce((sum, d) => sum + d.pow_dzialki_ha, 0)

        return {
            podmiot,
            dzialki,
            ekoschematy_ogolne,
            podsumowanie: {
                liczba_dzialek: dzialki.length,
                calkowita_powierzchnia_ha: Math.round(calkowitaPowierzchnia * 100) / 100,
            },
        }
    }

    private extractPodmiot(lines: string[]): ParsedPodmiot {
        let ep = ''
        let nazwa = ''
        let adres = ''

        for (let i = 0; i < Math.min(lines.length, 100); i++) {
            const line = lines[i]

            if (!ep) {
                const epMatch = line.match(EP_REGEX)
                if (epMatch) {
                    ep = epMatch[1]
                }
            }

            if (!nazwa && /^(Imię|Nazwisko|Nazwa|Wnioskodawca|Producent)/i.test(line)) {
                const afterColon = line.split(/[:\-]/)[1]?.trim()
                if (afterColon && afterColon.length > 2) {
                    nazwa = afterColon
                } else if (i + 1 < lines.length) {
                    nazwa = lines[i + 1]
                }
            }

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

    private buildCropMap(lines: string[]): Record<string, string> {
        const cropMap: Record<string, string> = {}
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

    private extractDzialki(lines: string[], cropMap: Record<string, string>): ParsedDzialka[] {
        let currentLetter = ''
        let currentCrop = ''
        const results: ParsedDzialka[] = []

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i]

            const headerMatch = line.match(SECTION_HEADER_REGEX)
            if (headerMatch && headerMatch[2].length > 2) {
                currentLetter = headerMatch[1]
                currentCrop = cropMap[currentLetter] || headerMatch[2].trim()
                continue
            }

            if (line.length === 1 && line >= 'A' && line <= 'K') {
                if (i + 1 < lines.length && /^[a-ząćęłńóśźż]+/i.test(lines[i + 1])) {
                    currentLetter = line
                    currentCrop = cropMap[currentLetter] || lines[i + 1].trim()
                    i++
                    continue
                }
            }

            const parcelMatch = line.match(PARCEL_NUMBER_REGEX)
            if (parcelMatch && currentLetter) {
                const parcelNumber = normalizeParcelNumber(parcelMatch[1])

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

    private extractEkoschematy(text: string): string[] {
        const matches = text.match(ECOSCHEME_REGEX)
        if (!matches) return []
        return [...new Set(matches)].sort()
    }
}
