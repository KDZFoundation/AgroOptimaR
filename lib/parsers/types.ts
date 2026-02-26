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
