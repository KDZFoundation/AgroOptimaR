// Supabase Edge Function: claude-ai-proxy
// Bezpieczne proxy dla zapytań do Claude Opus 4.6
// Deploy: supabase functions deploy claude-ai-proxy --project-ref ppkfqjarvykgskqcompq

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        // Verify auth
        const authHeader = req.headers.get('Authorization')
        if (!authHeader) {
            return new Response(JSON.stringify({ error: 'Brak tokenu autoryzacji' }), {
                status: 401,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            })
        }

        const supabase = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_ANON_KEY') ?? '',
            { global: { headers: { Authorization: authHeader } } }
        )

        const { data: { user }, error: authError } = await supabase.auth.getUser()
        if (authError || !user) {
            return new Response(JSON.stringify({ error: 'Nieautoryzowany dostęp' }), {
                status: 401,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            })
        }

        const { action, payload } = await req.json()

        const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY')
        if (!ANTHROPIC_API_KEY) {
            return new Response(JSON.stringify({ error: 'Brak klucza API Claude' }), {
                status: 500,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            })
        }

        let systemPrompt = ''
        let userMessage = ''

        switch (action) {
            case 'chat':
                systemPrompt = `Jesteś ekspertem ds. dopłat bezpośrednich i ekoschematów w ramach Planu Strategicznego WPR 2023-2027 dla Polski. Odpowiadaj po polsku, krótko i merytorycznie. Podawaj numery artykułów i rozporządzeń, gdy to możliwe.`
                userMessage = payload.message
                break

            case 'optimize':
                systemPrompt = `Jesteś optymalizatorem ekoschematów dla polskiego rolnika. Na podstawie danych działek i upraw, zarekomenduj optymalny zestaw ekoschematów maksymalizujący dopłaty, z uwzględnieniem matrycy kompatybilności. Odpowiedz w formacie JSON z kluczami: rekomendacje (array), suma_punktow (number), szacowana_wartosc (number), uzasadnienie (string).`
                userMessage = JSON.stringify(payload)
                break

            case 'parse-pdf':
                systemPrompt = `Jesteś parserem wniosków z systemu eWniosekPlus ARiMR. Wyodrębnij ze ścianego tekstu dokumentu następujące dane i zwróć je jako JSON:
{
  "numer_producenta": "string (9 cyfr)",
  "imie": "string",
  "nazwisko": "string",
  "adres": "string",
  "dzialki": [{ "numer": "string", "obreb": "string", "powierzchnia_ha": number, "uprawa": "string" }],
  "ekoschematy": [{ "kod": "string", "nazwa": "string", "powierzchnia_ha": number }],
  "zwierzeta": { "bydlo": number, "owce": number, "kozy": number, "konie": number }
}
Jeśli jakieś pole nie występuje, wstaw null. Nie dodawaj żadnych komentarzy, zwróć czysty JSON.`
                userMessage = payload.text
                break

            default:
                return new Response(JSON.stringify({ error: `Nieznana akcja: ${action}` }), {
                    status: 400,
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                })
        }

        // Call Claude Opus 4.6
        const anthropicResponse = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': ANTHROPIC_API_KEY,
                'anthropic-version': '2023-06-01',
            },
            body: JSON.stringify({
                model: 'claude-opus-4-6',
                max_tokens: 8000,
                system: systemPrompt,
                messages: [{ role: 'user', content: userMessage }],
            }),
        })

        if (!anthropicResponse.ok) {
            const errorText = await anthropicResponse.text()
            console.error('Claude API error:', errorText)
            return new Response(JSON.stringify({ error: 'Błąd API Claude', details: errorText }), {
                status: 502,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            })
        }

        const claudeResult = await anthropicResponse.json()
        const content = claudeResult.content?.[0]?.text || ''

        // Save to Supabase depending on action
        if (action === 'chat') {
            // Optionally save chat message
        }

        return new Response(JSON.stringify({ result: content, usage: claudeResult.usage }), {
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
    } catch (error) {
        console.error('Edge Function error:', error)
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
    }
})
