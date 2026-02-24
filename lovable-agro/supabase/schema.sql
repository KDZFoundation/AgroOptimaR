-- ============================================================
-- Schema dla AgroOptimaR (lovable.dev + Supabase)
-- Projekt: https://ppkfqjarvykgskqcompq.supabase.co
-- ============================================================

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

-- 7. Wnioski PDF (z referencją do Storage)
CREATE TABLE IF NOT EXISTS public.wnioski_pdf (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    rolnik_id UUID REFERENCES public.rolnicy(id) ON DELETE CASCADE,
    kampania_rok INTEGER REFERENCES public.kampanie(rok),
    nazwa_pliku TEXT NOT NULL,
    status_parsowania TEXT DEFAULT 'oczekujacy',
    dane_json JSONB,
    storage_path TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Kalkulacje
CREATE TABLE IF NOT EXISTS public.kalkulacje (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    rolnik_id UUID REFERENCES public.rolnicy(id) ON DELETE CASCADE,
    kampania_rok INTEGER REFERENCES public.kampanie(rok),
    dane_wejsciowe_json JSONB,
    wynik_json JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Symulacje
CREATE TABLE IF NOT EXISTS public.symulacje (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    rolnik_id UUID REFERENCES public.rolnicy(id) ON DELETE CASCADE,
    kampania_rok INTEGER REFERENCES public.kampanie(rok),
    konfiguracja_json JSONB,
    wynik_json JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Rolnictwo Węglowe - Punkty
CREATE TABLE IF NOT EXISTS public.rolnictwo_weglowe_punkty (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    rolnik_id UUID REFERENCES public.rolnicy(id) ON DELETE CASCADE,
    kampania_rok INTEGER REFERENCES public.kampanie(rok),
    praktyka_kod TEXT NOT NULL,
    powierzchnia_ha DECIMAL(12, 4) NOT NULL,
    punkty DECIMAL(12, 2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- NOWE TABELE
-- ============================================================

-- 11. Historia czatu AI (Asystent)
CREATE TABLE IF NOT EXISTS public.chat_historia (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    rolnik_id UUID REFERENCES public.rolnicy(id) ON DELETE CASCADE,
    tytul TEXT,
    wiadomosci JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. Optymalizacje AI (Optymalizator)
CREATE TABLE IF NOT EXISTS public.optymalizacje (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    rolnik_id UUID REFERENCES public.rolnicy(id) ON DELETE CASCADE,
    kampania_rok INTEGER REFERENCES public.kampanie(rok),
    konfiguracja_wejsciowa JSONB,
    rekomendacja_json JSONB,
    uzasadnienie TEXT,
    status TEXT DEFAULT 'nowa' CHECK (status IN ('nowa', 'w_trakcie', 'zakonczona', 'blad')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- STORAGE BUCKET (pliki PDF)
-- ============================================================

-- Uwaga: bucket tworzy się przez Dashboard lub CLI:
--   supabase storage create wnioski-pdf --public=false
-- Poniżej polityka dostępu do bucketa:

INSERT INTO storage.buckets (id, name, public) 
VALUES ('wnioski-pdf', 'wnioski-pdf', false)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Rolnicy mogą uploadować swoje pliki PDF"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'wnioski-pdf' 
    AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Rolnicy mogą odczytywać swoje pliki PDF"
ON storage.objects FOR SELECT
USING (
    bucket_id = 'wnioski-pdf' 
    AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Rolnicy mogą usuwać swoje pliki PDF"
ON storage.objects FOR DELETE
USING (
    bucket_id = 'wnioski-pdf' 
    AND auth.uid()::text = (storage.foldername(name))[1]
);

-- ============================================================
-- RLS (Row Level Security)
-- ============================================================

ALTER TABLE public.rolnicy ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dzialki ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wnioski_pdf ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kalkulacje ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.symulacje ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rolnictwo_weglowe_punkty ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_historia ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.optymalizacje ENABLE ROW LEVEL SECURITY;

-- Polityki dostępu
CREATE POLICY "Rolnicy mogą widzieć tylko swój profil" ON public.rolnicy FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Rolnicy mogą aktualizować swój profil" ON public.rolnicy FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Rolnicy mogą widzieć tylko swoje działki" ON public.dzialki FOR ALL USING (auth.uid() = rolnik_id);
CREATE POLICY "Rolnicy mogą widzieć tylko swoje wnioski" ON public.wnioski_pdf FOR ALL USING (auth.uid() = rolnik_id);
CREATE POLICY "Rolnicy mogą widzieć tylko swoje kalkulacje" ON public.kalkulacje FOR ALL USING (auth.uid() = rolnik_id);
CREATE POLICY "Rolnicy mogą widzieć tylko swoje symulacje" ON public.symulacje FOR ALL USING (auth.uid() = rolnik_id);
CREATE POLICY "Rolnicy mogą widzieć tylko swoje punkty RW" ON public.rolnictwo_weglowe_punkty FOR ALL USING (auth.uid() = rolnik_id);
CREATE POLICY "Rolnicy mogą widzieć tylko swój chat" ON public.chat_historia FOR ALL USING (auth.uid() = rolnik_id);
CREATE POLICY "Rolnicy mogą widzieć tylko swoje optymalizacje" ON public.optymalizacje FOR ALL USING (auth.uid() = rolnik_id);

-- Tabele publiczne (słowniki) - dostęp dla uwierzytelnionych
CREATE POLICY "Kampanie publiczne" ON public.kampanie FOR SELECT TO authenticated USING (true);
CREATE POLICY "Uprawy publiczne" ON public.uprawy FOR SELECT TO authenticated USING (true);
CREATE POLICY "Stawki publiczne" ON public.platnosci_stawki FOR SELECT TO authenticated USING (true);
CREATE POLICY "Ekoschematy publiczne" ON public.ekoschematy_stawki FOR SELECT TO authenticated USING (true);

ALTER TABLE public.kampanie ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.uprawy ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platnosci_stawki ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ekoschematy_stawki ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- INDEKSY
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_dzialki_rolnik ON public.dzialki(rolnik_id);
CREATE INDEX IF NOT EXISTS idx_wnioski_rolnik ON public.wnioski_pdf(rolnik_id);
CREATE INDEX IF NOT EXISTS idx_kalkulacje_rolnik ON public.kalkulacje(rolnik_id);
CREATE INDEX IF NOT EXISTS idx_symulacje_rolnik ON public.symulacje(rolnik_id);
CREATE INDEX IF NOT EXISTS idx_rw_punkty_rolnik ON public.rolnictwo_weglowe_punkty(rolnik_id);
CREATE INDEX IF NOT EXISTS idx_chat_rolnik ON public.chat_historia(rolnik_id);
CREATE INDEX IF NOT EXISTS idx_optymalizacje_rolnik ON public.optymalizacje(rolnik_id);
CREATE INDEX IF NOT EXISTS idx_platnosci_rok ON public.platnosci_stawki(kampania_rok);
CREATE INDEX IF NOT EXISTS idx_ekoschematy_rok ON public.ekoschematy_stawki(kampania_rok);
