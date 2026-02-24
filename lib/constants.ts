export const STAWKI_2025 = {
  // PŁATNOŚCI BEZPOŚREDNIE
  bws: 488.55,           // Podstawowe wsparcie dochodów (zł/ha)
  redystrybucyjna: 176.84, // Płatność redystrybucyjna (do 30 ha) (zł/ha)
  mlody_rolnik: 248.16,   // Płatność dla młodych rolników (zł/ha)
  upp: 55.95,             // Uzupełniająca płatność podstawowa (zł/ha)

  // EKOSCHEMATY OBSZAROWE - ROLNICTWO WĘGLOWE (Punkty)
  // Przelicznik: 1 pkt = ok. 87.18 zł (szacunkowo 2025)
  pkt_wartosc: 87.18,

  // PRAKTYKI ROLNICTWA WĘGLOWEGO
  E_EKSTUZ: 5,  // Ekstensywne TUZ z obsadą zwierząt
  E_MPW: 5,     // Międzyplony ozime/wsiewki
  E_OPN_P: 1,   // Plan nawożenia - wariant podstawowy
  E_OPN_W: 3,   // Plan nawożenia - wariant z wapnowaniem
  E_ZSU: 3,     // Zróżnicowana struktura upraw
  E_OBR: 2,     // Wymieszanie obornika (12h)
  E_PN: 3,      // Nawozy płynne (nie rozbryzgowo)
  E_USU: 3,     // Uproszczone systemy uprawy (Audyt: zredukowane z 4 do 3)
  E_WSG: 1,     // Wymieszanie słomy z glebą (Audyt: zredukowane z 2 do 1)

  // INNE EKOSCHEMATY OBSZAROWE (zł/ha)
  E_MIOD: 931.07,     // Obszary z roślinami miododajnymi
  E_IPR_sad: 1185.24, // Integrowana produkcja sadownicza
  E_IPR_jag: 1069.41, // Integrowana produkcja jagodowa
  E_IPR_rol: 505.18,  // Integrowana produkcja rolnicza
  E_IPR_war: 1069.41, // Integrowana produkcja warzywna
  E_BIO_mikro: 310.88, // Biologiczna - mikrobiologiczne ŚOR (89.89 EUR)
  E_BIO_naw: 87.52,   // Biologiczna - nawozowe mikrobiologiczne (22.47 EUR)
  E_RET: 245.98,      // Retencjonowanie wody TUZ (63.15 EUR)
  E_GWP: 437.57,      // Grunty wyłączone z produkcji (126.52 EUR)
  
  // MATERIAŁ SIEWNY (zł/ha)
  E_SIE_zb: 103.75,   // Materiał siewny - zboża
  E_SIE_str: 168.27,  // Materiał siewny - strączkowe
  E_SIE_ziem: 435.06, // Materiał siewny - ziemniaki
};

export const ZASADY_2025 = {
  LIMIT_EKOSCHEMATY_HA: 300,
  MAX_EKOSCHEMATY_NA_DZIALKE: 2,
  CARBON_FARMING_THRESHOLD_MULTIPLIER: 1.25, // Punkty = UR_ha * 1.25
};

export const KAMPANIE = [
  { rok: 2021, status: 'zakonczona', data_od: '2021-03-15', data_do: '2022-03-14' },
  { rok: 2022, status: 'zakonczona', data_od: '2022-03-15', data_do: '2023-03-14' },
  { rok: 2023, status: 'zakonczona', data_od: '2023-03-15', data_do: '2024-03-14' },
  { rok: 2024, status: 'zakonczona', data_od: '2024-03-15', data_do: '2025-03-14' },
  { rok: 2025, status: 'w_toku', data_od: '2025-03-15', data_do: '2026-03-14' },
  { rok: 2026, status: 'robocza', data_od: '2026-03-15', data_do: '2027-03-14' },
];
