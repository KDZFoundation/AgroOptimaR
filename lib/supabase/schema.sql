-- Tabele dla aplikacji AgroOptimaR

-- 1. Rolnicy (rozszerzony profil użytkownika)
CREATE TABLE IF NOT EXISTS public.rolnicy (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    numer_producenta VARCHAR(9) UNIQUE NOT NULL,
    imie TEXT,
    nazwisko TEXT,
    email TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Kampanie
CREATE TABLE IF NOT EXISTS public.kampanie (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    rok INTEGER UNIQUE NOT NULL,
    status TEXT CHECK (status IN ('zakonczona', 'w_toku', 'robocza')),
    data_od DATE,
    data_do DATE
);

-- 3. Uprawy
CREATE TABLE IF NOT EXISTS public.uprawy (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    kod TEXT UNIQUE NOT NULL,
    nazwa TEXT NOT NULL,
    kategoria TEXT
);

-- 4. Działki
CREATE TABLE IF NOT EXISTS public.dzialki (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    rolnik_id UUID REFERENCES public.rolnicy(id) ON DELETE CASCADE,
    numer_dzialki TEXT NOT NULL,
    obreb TEXT,
    gmina TEXT,
    powiat TEXT,
    powierzchnia_ha DECIMAL(12, 4) NOT NULL,
    klasa_bonitacyjna TEXT,
    uprawa_id UUID REFERENCES public.uprawy(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Stawki Płatności Bezpośrednich
CREATE TABLE IF NOT EXISTS public.platnosci_stawki (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    kampania_rok INTEGER REFERENCES public.kampanie(rok),
    rodzaj_platnosci TEXT NOT NULL,
    stawka_pln DECIMAL(12, 2) NOT NULL,
    jednostka TEXT DEFAULT 'ha'
);

-- 6. Stawki Ekoschematów
CREATE TABLE IF NOT EXISTS public.ekoschematy_stawki (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    kampania_rok INTEGER REFERENCES public.kampanie(rok),
    kod_ekoschematu TEXT NOT NULL,
    nazwa TEXT NOT NULL,
    stawka_pln_ha DECIMAL(12, 2),
    punkty_ha INTEGER,
    limit_ha INTEGER DEFAULT 300,
    typ_gruntu TEXT
);

-- 7. Wnioski PDF
CREATE TABLE IF NOT EXISTS public.wnioski_pdf (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    rolnik_id UUID REFERENCES public.rolnicy(id) ON DELETE CASCADE,
    kampania_rok INTEGER REFERENCES public.kampanie(rok),
    nazwa_pliku TEXT NOT NULL,
    status_parsowania TEXT DEFAULT 'oczekujacy',
    dane_json JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Kalkulacje i Symulacje
CREATE TABLE IF NOT EXISTS public.kalkulacje (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    rolnik_id UUID REFERENCES public.rolnicy(id) ON DELETE CASCADE,
    kampania_rok INTEGER REFERENCES public.kampanie(rok),
    dane_wejsciowe_json JSONB,
    wynik_json JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.symulacje (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    rolnik_id UUID REFERENCES public.rolnicy(id) ON DELETE CASCADE,
    kampania_rok INTEGER REFERENCES public.kampanie(rok),
    konfiguracja_json JSONB,
    wynik_json JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Rolnictwo Węglowe - Punkty
CREATE TABLE IF NOT EXISTS public.rolnictwo_weglowe_punkty (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    rolnik_id UUID REFERENCES public.rolnicy(id) ON DELETE CASCADE,
    kampania_rok INTEGER REFERENCES public.kampanie(rok),
    praktyka_kod TEXT NOT NULL,
    powierzchnia_ha DECIMAL(12, 4) NOT NULL,
    punkty DECIMAL(12, 2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS (Row Level Security) - Podstawowa konfiguracja
ALTER TABLE public.rolnicy ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dzialki ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wnioski_pdf ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kalkulacje ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.symulacje ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rolnictwo_weglowe_punkty ENABLE ROW LEVEL SECURITY;

-- Polityki dostępu
CREATE POLICY "Rolnicy mogą widzieć tylko swój profil" ON public.rolnicy FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Rolnicy mogą widzieć tylko swoje działki" ON public.dzialki FOR ALL USING (auth.uid() = rolnik_id);
CREATE POLICY "Rolnicy mogą widzieć tylko swoje wnioski" ON public.wnioski_pdf FOR ALL USING (auth.uid() = rolnik_id);
CREATE POLICY "Rolnicy mogą widzieć tylko swoje kalkulacje" ON public.kalkulacje FOR ALL USING (auth.uid() = rolnik_id);
CREATE POLICY "Rolnicy mogą widzieć tylko swoje symulacje" ON public.symulacje FOR ALL USING (auth.uid() = rolnik_id);
CREATE POLICY "Rolnicy mogą widzieć tylko swoje punkty RW" ON public.rolnictwo_weglowe_punkty FOR ALL USING (auth.uid() = rolnik_id);
