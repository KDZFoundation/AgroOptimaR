export type KampaniaStatus = 'zakonczona' | 'w_toku' | 'robocza';
export type AppRole = 'rolnik' | 'doradca' | 'admin';

export interface Profile {
    id: string;
    role: AppRole;
    imie: string | null;
    nazwisko: string | null;
    numer_producenta: string | null;
    email?: string; // Optional, usually from auth
    created_at: string;
}

// Deprecated or alias for backward compatibility
export type Rolnik = Profile;

export interface Kampania {
    id: string;
    rok: number;
    status: KampaniaStatus;
    data_od: string;
    data_do: string;
}

export interface Dzialka {
    id: string;
    rolnik_id: string;
    numer_dzialki: string;
    obreb: string;
    gmina: string;
    powiat: string;
    powierzchnia_ha: number;
    klasa_bonitacyjna: string;
    uprawa_id?: string;
}

export interface Uprawa {
    id: string;
    kod: string;
    nazwa: string;
    kategoria: string;
}

export interface EkoschematStawka {
    id: string;
    kampania_rok: number;
    kod_ekoschematu: string;
    nazwa: string;
    stawka_pln_ha: number;
    punkty_ha?: number;
    limit_ha?: number;
    typ_gruntu: 'GO' | 'TUZ' | 'GO+TUZ';
}

export interface WniosekPDF {
    id: string;
    rolnik_id: string;
    kampania_rok: number;
    nazwa_pliku: string;
    plik_url: string;
    status_parsowania: 'oczekujacy' | 'sukces' | 'blad';
    dane_json: any;
    created_at: string;
}

export interface Kalkulacja {
    id: string;
    rolnik_id: string;
    kampania_rok: number;
    dane_wejsciowe_json: any;
    wynik_json: any;
    created_at: string;
}

export interface RolnictwoWeglowePunktacja {
    id: string;
    rolnik_id: string;
    kampania_rok: number;
    praktyka_kod: string;
    powierzchnia_ha: number;
    punkty: number;
}

// Parsed data types (moved from lib/rag/pdf-parser.ts)
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
