import { supabase } from './supabase'

interface ClaudeResponse {
    result: string
    usage?: {
        input_tokens: number
        output_tokens: number
    }
}

/**
 * Proxy do Claude Opus 4.6 przez Supabase Edge Function.
 * Klucz API Claude nigdy nie jest eksponowany po stronie klienta.
 */
async function callClaude(action: 'chat' | 'optimize' | 'parse-pdf', payload: Record<string, unknown>): Promise<ClaudeResponse> {
    const { data, error } = await supabase.functions.invoke('claude-ai-proxy', {
        body: { action, payload },
    })

    if (error) {
        throw new Error(`Błąd Edge Function: ${error.message}`)
    }

    return data as ClaudeResponse
}

/**
 * Wyślij wiadomość do Asystenta AI
 */
export async function sendChatMessage(message: string): Promise<string> {
    const response = await callClaude('chat', { message })
    return response.result
}

/**
 * Uruchom optymalizację ekoschematów
 */
export async function runOptimization(dzialki: unknown[], uprawy: unknown[], kampaniaRok: number): Promise<{
    rekomendacje: unknown[]
    suma_punktow: number
    szacowana_wartosc: number
    uzasadnienie: string
}> {
    const response = await callClaude('optimize', { dzialki, uprawy, kampania_rok: kampaniaRok })
    return JSON.parse(response.result)
}

/**
 * Parsuj tekst z PDF wniosku
 */
export async function parsePdfText(text: string): Promise<unknown> {
    const response = await callClaude('parse-pdf', { text })
    return JSON.parse(response.result)
}
