-- Seed danych dla AgroOptimaR

-- Kampanie
INSERT INTO public.kampanie (rok, status, data_od, data_do) VALUES
(2021, 'zakonczona', '2021-03-15', '2022-03-14'),
(2022, 'zakonczona', '2022-03-15', '2023-03-14'),
(2023, 'zakonczona', '2023-03-15', '2024-03-14'),
(2024, 'zakonczona', '2024-03-15', '2025-03-14'),
(2025, 'w_toku', '2025-03-15', '2026-03-14'),
(2026, 'robocza', '2026-03-15', '2027-03-14')
ON CONFLICT (rok) DO NOTHING;

-- Stawki Płatności Bezpośrednich 2025
INSERT INTO public.platnosci_stawki (kampania_rok, rodzaj_platnosci, stawka_pln, jednostka) VALUES
(2025, 'Podstawowe wsparcie dochodów', 488.55, 'ha'),
(2025, 'Płatność redystrybucyjna', 176.84, 'ha'),
(2025, 'Płatność dla młodych rolników', 248.16, 'ha'),
(2025, 'Uzupełniająca płatność podstawowa', 55.95, 'ha')
ON CONFLICT DO NOTHING;

-- Stawki Ekoschematów 2025 (Rolnictwo Węglowe)
INSERT INTO public.ekoschematy_stawki (kampania_rok, kod_ekoschematu, nazwa, punkty_ha, typ_gruntu) VALUES
(2025, 'E_EKSTUZ', 'Ekstensywne TUZ z obsadą zwierząt', 5, 'TUZ'),
(2025, 'E_MPW', 'Międzyplony ozime lub wsiewki śródplonowe', 5, 'GO'),
(2025, 'E_OPN_P', 'Plan nawożenia - wariant podstawowy', 1, 'GO+TUZ'),
(2025, 'E_OPN_W', 'Plan nawożenia - wariant z wapnowaniem', 3, 'GO+TUZ'),
(2025, 'E_ZSU', 'Zróżnicowana struktura upraw', 3, 'GO'),
(2025, 'E_OBR', 'Wymieszanie obornika 12h', 2, 'GO'),
(2025, 'E_PN', 'Nawozy płynne inne niż rozbryzgowo', 3, 'GO+TUZ'),
(2025, 'E_USU', 'Uproszczone systemy uprawy', 3, 'GO'),
(2025, 'E_WSG', 'Wymieszanie słomy z glebą', 1, 'GO')
ON CONFLICT DO NOTHING;

-- Inne Ekoschematy 2025
INSERT INTO public.ekoschematy_stawki (kampania_rok, kod_ekoschematu, nazwa, stawka_pln_ha, typ_gruntu) VALUES
(2025, 'E_MIO', 'Obszary z roślinami miododajnymi', 931.07, 'GO'),
(2025, 'E_IPR_sad', 'Integrowana produkcja sadownicza', 1185.24, 'GO'),
(2025, 'E_IPR_jag', 'Integrowana produkcja jagodowa', 1069.41, 'GO'),
(2025, 'E_IPR_rol', 'Integrowana produkcja rolnicza', 505.18, 'GO'),
(2025, 'E_IPR_war', 'Integrowana produkcja warzywna', 1069.41, 'GO'),
(2025, 'E_BIO_mikro', 'Biologiczna - mikrobiologiczne ŚOR', 310.88, 'GO+TUZ'),
(2025, 'E_BIO_naw', 'Biologiczna - nawozowe mikrobiologiczne', 87.52, 'GO+TUZ'),
(2025, 'E_RET', 'Retencjonowanie wody TUZ', 245.98, 'TUZ'),
(2025, 'E_GWP', 'Grunty wyłączone z produkcji', 437.57, 'GO'),
(2025, 'E_SIE_zb', 'Materiał siewny - zboża', 103.75, 'GO'),
(2025, 'E_SIE_str', 'Materiał siewny - strączkowe', 168.27, 'GO'),
(2025, 'E_SIE_ziem', 'Materiał siewny - ziemniaki', 435.06, 'GO')
ON CONFLICT DO NOTHING;
