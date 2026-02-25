
import { SupabaseClient } from '@supabase/supabase-js'

export class StorageService {
    constructor(private readonly supabase: SupabaseClient) {}

    /**
     * Uploads the application PDF to 'wnioski' bucket.
     * Returns the storage path.
     */
    async uploadPdf(file: File, userId: string, year: number): Promise<string> {
        // Construct a safe filename to prevent path traversal or weird char issues
        // Keep alphanumeric, dots, hyphens. Replace others with underscore.
        const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
        const fileName = `${userId}/${year}_${Date.now()}_${safeName}`;

        const { data, error } = await this.supabase
            .storage
            .from('wnioski')
            .upload(fileName, file, {
                contentType: 'application/pdf',
                upsert: false
            });

        if (error) {
            // Log the error securely (avoid logging sensitive file content if any)
            console.error('StorageService upload error:', error);
            throw new Error(`Failed to upload file to storage: ${error.message}`);
        }

        if (!data?.path) {
            throw new Error('Upload successful but returned no path');
        }

        return data.path;
    }
}
