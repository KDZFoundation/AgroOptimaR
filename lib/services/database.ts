
import { SupabaseClient } from '@supabase/supabase-js'
import { WniosekPDF } from '@/types'

// Payload for inserting a new record. We omit auto-generated fields.
export type CreateWniosekPayload = Omit<WniosekPDF, 'id' | 'created_at'>

export class DatabaseService {
    constructor(private readonly supabase: SupabaseClient) {}

    /**
     * Creates a new WniosekPDF record in the database.
     */
    async createWniosek(payload: CreateWniosekPayload): Promise<void> {
        const { error } = await this.supabase
            .from('wnioski_pdf')
            .insert(payload)

        if (error) {
            console.error('DatabaseService createWniosek error:', error)
            throw new Error(`Failed to create application record: ${error.message}`)
        }
    }

    /**
     * Retrieves all WniosekPDF records for a specific user, ordered by campaign year descending.
     */
    async getWnioskiByUserId(userId: string): Promise<WniosekPDF[]> {
        const { data, error } = await this.supabase
            .from('wnioski_pdf')
            .select('*')
            .eq('rolnik_id', userId)
            .order('kampania_rok', { ascending: false })

        if (error) {
            console.error('DatabaseService getWnioskiByUserId error:', error)
            throw new Error(`Failed to fetch applications: ${error.message}`)
        }

        return data || []
    }
}
