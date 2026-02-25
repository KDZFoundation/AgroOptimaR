# AgroOptimaR — Instrukcja Wdrożenia

## 1. Wymagane zmienne środowiskowe

### Frontend (`.env`)
```
VITE_SUPABASE_URL=https://ppkfqjarvykgskqcompq.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_...
```

### Supabase Edge Function (Secrets)
```bash
supabase secrets set ANTHROPIC_API_KEY=sk-ant-...
```

## 2. Deploy frontendu

### Opcja A: Lovable Cloud
1. Zaimportuj repozytorium na [lovable.dev](https://lovable.dev)
2. Ustaw zmienne środowiskowe w ustawieniach projektu
3. Kliknij **Publish**

### Opcja B: Netlify
1. Połącz repozytorium GitHub z [netlify.com](https://netlify.com)
2. Ustawienia buildu: `npm run build`, publish dir: `dist`
3. Dodaj zmienne środowiskowe w **Site settings → Environment**
4. Deploy zostanie uruchomiony automatycznie

### Opcja C: Vercel
1. Importuj projekt na [vercel.com](https://vercel.com)
2. Framework preset: **Vite**
3. Ustaw zmienne środowiskowe

## 3. Deploy Edge Function

```bash
# Zainstaluj Supabase CLI
npm install -g supabase

# Zaloguj się
supabase login

# Deploy
supabase functions deploy claude-ai-proxy --project-ref ppkfqjarvykgskqcompq

# Ustaw sekret API key
supabase secrets set ANTHROPIC_API_KEY=sk-ant-... --project-ref ppkfqjarvykgskqcompq
```

## 4. Schema bazy danych

```bash
# Jeśli tabele nie istnieją jeszcze
supabase db push --project-ref ppkfqjarvykgskqcompq
```

Schemat jest w `supabase/schema.sql`, dane seedowe w `supabase/seed.sql`.

## 5. Checklist przed publikacją

- [ ] Zmienne `VITE_SUPABASE_*` ustawione
- [ ] Edge Function `claude-ai-proxy` wdrożona
- [ ] `ANTHROPIC_API_KEY` secret ustawiony
- [ ] Schema + seed załadowane do Supabase
- [ ] Favicon widoczny w przeglądarce
- [ ] Routing SPA działa (F5 na `/pulpit` nie daje 404)
