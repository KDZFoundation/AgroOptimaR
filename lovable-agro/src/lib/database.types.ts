// Auto-generated TypeScript types matching Supabase schema
// Regenerate with: npx supabase gen types typescript --project-id ppkfqjarvykgskqcompq > src/lib/database.types.ts

export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            rolnicy: {
                Row: {
                    id: string
                    numer_producenta: string
                    imie: string | null
                    nazwisko: string | null
                    email: string | null
                    created_at: string
                }
                Insert: {
                    id: string
                    numer_producenta: string
                    imie?: string | null
                    nazwisko?: string | null
                    email?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    numer_producenta?: string
                    imie?: string | null
                    nazwisko?: string | null
                    email?: string | null
                    created_at?: string
                }
            }
            kampanie: {
                Row: {
                    id: string
                    rok: number
                    status: 'zakonczona' | 'w_toku' | 'robocza'
                    data_od: string | null
                    data_do: string | null
                }
                Insert: {
                    id?: string
                    rok: number
                    status: 'zakonczona' | 'w_toku' | 'robocza'
                    data_od?: string | null
                    data_do?: string | null
                }
                Update: {
                    id?: string
                    rok?: number
                    status?: 'zakonczona' | 'w_toku' | 'robocza'
                    data_od?: string | null
                    data_do?: string | null
                }
            }
            uprawy: {
                Row: {
                    id: string
                    kod: string
                    nazwa: string
                    kategoria: string | null
                }
                Insert: {
                    id?: string
                    kod: string
                    nazwa: string
                    kategoria?: string | null
                }
                Update: {
                    id?: string
                    kod?: string
                    nazwa?: string
                    kategoria?: string | null
                }
            }
            dzialki: {
                Row: {
                    id: string
                    rolnik_id: string
                    numer_dzialki: string
                    obreb: string | null
                    gmina: string | null
                    powiat: string | null
                    powierzchnia_ha: number
                    klasa_bonitacyjna: string | null
                    uprawa_id: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    rolnik_id: string
                    numer_dzialki: string
                    obreb?: string | null
                    gmina?: string | null
                    powiat?: string | null
                    powierzchnia_ha: number
                    klasa_bonitacyjna?: string | null
                    uprawa_id?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    rolnik_id?: string
                    numer_dzialki?: string
                    obreb?: string | null
                    gmina?: string | null
                    powiat?: string | null
                    powierzchnia_ha?: number
                    klasa_bonitacyjna?: string | null
                    uprawa_id?: string | null
                    created_at?: string
                }
            }
            platnosci_stawki: {
                Row: {
                    id: string
                    kampania_rok: number
                    rodzaj_platnosci: string
                    stawka_pln: number
                    jednostka: string
                }
                Insert: {
                    id?: string
                    kampania_rok: number
                    rodzaj_platnosci: string
                    stawka_pln: number
                    jednostka?: string
                }
                Update: {
                    id?: string
                    kampania_rok?: number
                    rodzaj_platnosci?: string
                    stawka_pln?: number
                    jednostka?: string
                }
            }
            ekoschematy_stawki: {
                Row: {
                    id: string
                    kampania_rok: number
                    kod_ekoschematu: string
                    nazwa: string
                    stawka_pln_ha: number | null
                    punkty_ha: number | null
                    limit_ha: number
                    typ_gruntu: string | null
                }
                Insert: {
                    id?: string
                    kampania_rok: number
                    kod_ekoschematu: string
                    nazwa: string
                    stawka_pln_ha?: number | null
                    punkty_ha?: number | null
                    limit_ha?: number
                    typ_gruntu?: string | null
                }
                Update: {
                    id?: string
                    kampania_rok?: number
                    kod_ekoschematu?: string
                    nazwa?: string
                    stawka_pln_ha?: number | null
                    punkty_ha?: number | null
                    limit_ha?: number
                    typ_gruntu?: string | null
                }
            }
            wnioski_pdf: {
                Row: {
                    id: string
                    rolnik_id: string
                    kampania_rok: number
                    nazwa_pliku: string
                    status_parsowania: string
                    dane_json: Json | null
                    storage_path: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    rolnik_id: string
                    kampania_rok: number
                    nazwa_pliku: string
                    status_parsowania?: string
                    dane_json?: Json | null
                    storage_path?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    rolnik_id?: string
                    kampania_rok?: number
                    nazwa_pliku?: string
                    status_parsowania?: string
                    dane_json?: Json | null
                    storage_path?: string | null
                    created_at?: string
                }
            }
            kalkulacje: {
                Row: {
                    id: string
                    rolnik_id: string
                    kampania_rok: number
                    dane_wejsciowe_json: Json | null
                    wynik_json: Json | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    rolnik_id: string
                    kampania_rok: number
                    dane_wejsciowe_json?: Json | null
                    wynik_json?: Json | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    rolnik_id?: string
                    kampania_rok?: number
                    dane_wejsciowe_json?: Json | null
                    wynik_json?: Json | null
                    created_at?: string
                }
            }
            symulacje: {
                Row: {
                    id: string
                    rolnik_id: string
                    kampania_rok: number
                    konfiguracja_json: Json | null
                    wynik_json: Json | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    rolnik_id: string
                    kampania_rok: number
                    konfiguracja_json?: Json | null
                    wynik_json?: Json | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    rolnik_id?: string
                    kampania_rok?: number
                    konfiguracja_json?: Json | null
                    wynik_json?: Json | null
                    created_at?: string
                }
            }
            rolnictwo_weglowe_punkty: {
                Row: {
                    id: string
                    rolnik_id: string
                    kampania_rok: number
                    praktyka_kod: string
                    powierzchnia_ha: number
                    punkty: number
                    created_at: string
                }
                Insert: {
                    id?: string
                    rolnik_id: string
                    kampania_rok: number
                    praktyka_kod: string
                    powierzchnia_ha: number
                    punkty: number
                    created_at?: string
                }
                Update: {
                    id?: string
                    rolnik_id?: string
                    kampania_rok?: number
                    praktyka_kod?: string
                    powierzchnia_ha?: number
                    punkty?: number
                    created_at?: string
                }
            }
            chat_historia: {
                Row: {
                    id: string
                    rolnik_id: string
                    tytul: string | null
                    wiadomosci: Json
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    rolnik_id: string
                    tytul?: string | null
                    wiadomosci?: Json
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    rolnik_id?: string
                    tytul?: string | null
                    wiadomosci?: Json
                    created_at?: string
                    updated_at?: string
                }
            }
            optymalizacje: {
                Row: {
                    id: string
                    rolnik_id: string
                    kampania_rok: number
                    konfiguracja_wejsciowa: Json | null
                    rekomendacja_json: Json | null
                    uzasadnienie: string | null
                    status: string
                    created_at: string
                }
                Insert: {
                    id?: string
                    rolnik_id: string
                    kampania_rok: number
                    konfiguracja_wejsciowa?: Json | null
                    rekomendacja_json?: Json | null
                    uzasadnienie?: string | null
                    status?: string
                    created_at?: string
                }
                Update: {
                    id?: string
                    rolnik_id?: string
                    kampania_rok?: number
                    konfiguracja_wejsciowa?: Json | null
                    rekomendacja_json?: Json | null
                    uzasadnienie?: string | null
                    status?: string
                    created_at?: string
                }
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            [_ in never]: never
        }
        Enums: {
            [_ in never]: never
        }
    }
}

// Helper types for convenience
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type InsertDTO<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type UpdateDTO<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']
