/**
 * Text utilities for AgroOptimaR, inspired by Open Notebook.
 */

/**
 * Removes non-printable characters and normalizes whitespace.
 */
export function removeNonPrintable(text: string): string {
    if (!text) return "";

    // Normalize Unicode characters (NFKC)
    text = text.normalize('NFKC');

    // Replace special Unicode whitespace with regular space
    text = text.replace(/[\u2000-\u200B\u202F\u205F\u3000]/g, " ");

    // Replace unusual line terminators with single newline
    text = text.replace(/[\u2028\u2029\r]/g, "\n");

    // Replace non-breaking spaces with regular spaces
    text = text.replace(/\xa0/g, " ");

    // Remove control characters except newlines and tabs
    // eslint-disable-next-line no-control-regex
    text = text.replace(/[^\x20-\x7E\x0A\x0D\x09\u00A0-\u00FF\u0100-\u017F\u0180-\u024F\u1E00-\u1EFF]/g, "");

    return text.trim();
}

/**
 * Extracts JSON content from AI response, handling potential markdown blocks or thinking tags.
 */
export function extractJsonFromResponse<T = any>(content: string): T | null {
    if (!content) return null;

    // Remove thinking tags if present
    content = content.replace(/<think>[\s\S]*?<\/think>/g, "").trim();
    content = content.replace(/^[\s\S]*?<\/think>/g, "").trim(); // Malformed opening tag

    // Look for JSON markdown block
    const jsonBlockMatch = content.match(/```json\s*([\s\S]*?)\s*```/);
    if (jsonBlockMatch) {
        content = jsonBlockMatch[1];
    } else {
        // Look for any { ... } block
        const firstBrace = content.indexOf('{');
        const lastBrace = content.lastIndexOf('}');
        if (firstBrace !== -1 && lastBrace !== -1) {
            content = content.substring(firstBrace, lastBrace + 1);
        }
    }

    try {
        return JSON.parse(content) as T;
    } catch (e) {
        console.error("Failed to parse JSON from AI response:", e);
        return null;
    }
}

/**
 * Validates a Producer Number (EP). Must be exactly 9 digits.
 */
export function validateEP(ep: string): boolean {
    return /^\d{9}$/.test(ep.replace(/\s/g, ''));
}

/**
 * Normalizes a parcel number (nr działki).
 */
export function normalizeParcelNumber(nr: string): string {
    return nr.replace(/[^\d/]/g, '').trim();
}

