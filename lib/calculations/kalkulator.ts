import { STAWKI_2025, ZASADY_2025 } from '../constants'

export interface FarmData {
    ur_ha: number
    tuz_ha: number
    mlody_rolnik: boolean
    ekoschematy: {
        kod: string
        ha: number
    }[]
    zwierzeta: {
        rodzaj: 'bydlo' | 'krowy' | 'owce' | 'kozy'
        sztuk: number
    }[]
}

export interface CalculationResult {
    platnosci_bezposrednie: {
        bws: number
        redystrybucyjna: number
        mlody_rolnik: number
        upp: number
        suma: number
    }
    ekoschematy: {
        kod: string
        nazwa: string
        punkty: number
        powierzchnia: number
        wartosc: number
    }[]
    carbon_farming: {
        punkty_suma: number
        prog_minimalny: number
        spelniono: boolean
        wartosc_total: number
    }
    suma_calkowita: number
}

export function obliczSubscydia(dane: FarmData): CalculationResult {
    const { ur_ha, mlody_rolnik, ekoschematy, zwierzeta } = dane

    // 1. Płatności Bezpośrednie
    const bws = ur_ha * STAWKI_2025.bws
    const redystrybucyjna = Math.min(ur_ha, 30) * STAWKI_2025.redystrybucyjna
    const mlody = mlody_rolnik ? ur_ha * STAWKI_2025.mlody_rolnik : 0
    const upp = ur_ha * STAWKI_2025.upp
    const suma_bezposrednie = bws + redystrybucyjna + mlody + upp

    // 2. Ekoschematy i Rolnictwo Węglowe
    let carbon_points = 0
    const ekoschematy_wyniki: any[] = []

    // Limit 300 ha dla ekoschematów
    const pow_efektywna = Math.min(ur_ha, ZASADY_2025.LIMIT_EKOSCHEMATY_HA)

    for (const eko of ekoschematy) {
        const stawka_info = (STAWKI_2025 as any)[eko.kod]
        const pow_eko = Math.min(eko.ha, pow_efektywna)

        if (typeof stawka_info === 'number') {
            // Jeśli to są punkty (Carbon Farming)
            if (eko.kod.startsWith('E_')) {
                carbon_points += stawka_info * pow_eko
                ekoschematy_wyniki.push({
                    kod: eko.kod,
                    nazwa: 'Praktyka RW',
                    punkty: stawka_info,
                    powierzchnia: pow_eko,
                    wartosc: 0 // Zostanie policzone w carbon_farming
                })
            } else {
                // Inne ekoschematy obszarowe
                ekoschematy_wyniki.push({
                    kod: eko.kod,
                    nazwa: 'Ekoschemat',
                    punkty: 0,
                    powierzchnia: pow_eko,
                    wartosc: pow_eko * stawka_info
                })
            }
        }
    }

    const prog_min = ur_ha * ZASADY_2025.CARBON_FARMING_THRESHOLD_MULTIPLIER
    const spelniono_rw = carbon_points >= prog_min
    const wartosc_rw = spelniono_rw ? carbon_points * STAWKI_2025.pkt_wartosc : 0

    const suma_ekoschematy = ekoschematy_wyniki.reduce((acc, e) => acc + e.wartosc, 0) + wartosc_rw

    return {
        platnosci_bezposrednie: {
            bws,
            redystrybucyjna,
            mlody_rolnik: mlody,
            upp,
            suma: suma_bezposrednie
        },
        ekoschematy: ekoschematy_wyniki,
        carbon_farming: {
            punkty_suma: carbon_points,
            prog_minimalny: prog_min,
            spelniono: spelniono_rw,
            wartosc_total: wartosc_rw
        },
        suma_calkowita: suma_bezposrednie + suma_ekoschematy
    }
}
