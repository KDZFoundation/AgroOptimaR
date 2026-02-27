export interface RedactionResult {
    redactedText: string;
    mapping: Record<string, string>;
}

/**
 * Redacts PII from text, replacing it with placeholders.
 * Targeted for ARiMR applications.
 */
export function redactPII(text: string): RedactionResult {
    const mapping: Record<string, string> = {};
    let redactedText = text;
    let counter = 0;

    /**
     * Gets or creates a placeholder for a given value.
     * Ensures the same value always gets the same placeholder to prevent deanonymization.
     */
    function getPlaceholder(value: string, label: string): string {
        const trimmed = value.trim();
        // Check if this exact value already has a placeholder
        for (const [key, val] of Object.entries(mapping)) {
            if (val === trimmed) return key;
        }

        const placeholder = `[${label}_${counter++}]`;
        mapping[placeholder] = trimmed;
        return placeholder;
    }

    // 1. Redact IDs with specific markers (to give LLM context)
    // EP: 9 digits
    const epRegex = /(01\.\s*Numer\s*identyfikacyjny\s*[\r\n]+\s*)((?:\d\s*){9})/gi;
    redactedText = redactedText.replace(epRegex, (match, p1, p2) => p1 + getPlaceholder(p2, 'EP'));

    // PESEL: 11 digits
    const peselRegex = /(05\.\s*Numer\s*PESEL\s*[\r\n]+\s*)((?:\d\s*){11})/gi;
    redactedText = redactedText.replace(peselRegex, (match, p1, p2) => p1 + getPlaceholder(p2, 'PESEL'));

    // NIP: 10 digits
    const nipRegex = /(06\.\s*Numer\s*identyfikacyjny\s*\(NIP\)\s*[\r\n]+\s*)((?:\d\s*){10})/gi;
    redactedText = redactedText.replace(nipRegex, (match, p1, p2) => p1 + getPlaceholder(p2, 'NIP'));

    // 2. Redact Names (often after specific markers in these forms)
    const nameMarkers = [
        /02\.\s*Nazwisko\s*\/\s*Nazwa\s*[^\r\n]+\s*[\r\n]+\s*([^\r\n]+)/gi,
        /03\.\s*Pierwsze\s*imi[^\s]+\s*\/\s*Nazwa\s*[^\r\n]+\s*[\r\n]+\s*([^\r\n]+)/gi,
        /Wnioskodawca:\s*([^\r\n]+)/gi
    ];

    nameMarkers.forEach(regex => {
        redactedText = redactedText.replace(regex, (match, p1) => {
            if (p1.trim().length > 0 && !p1.includes('[')) {
                const placeholder = getPlaceholder(p1, 'NAME');
                return match.replace(p1, placeholder);
            }
            return match;
        });
    });

    // 3. Redact Addresses
    const addressRegex = /(Adres\s*(?:zamieszkania|siedziby)?\s*[\r\n]+\s*)([^\r\n]+(?:[\r\n]+\s*[^\r\n]+){0,2})/gi;
    redactedText = redactedText.replace(addressRegex, (match, p1, p2) => {
        if (p2.trim().length > 0 && !p2.includes('[')) {
            const placeholder = getPlaceholder(p2, 'ADDRESS');
            return p1 + placeholder;
        }
        return match;
    });

    // 4. Generic IDs (any 9, 10, or 11 digit numbers that might be missed or appear without markers)
    // We do this last to catch remaining occurrences of already redacted IDs or new ones.
    const genericIdRegex = /\b(?:\d\s*){9,11}\b/g;
    redactedText = redactedText.replace(genericIdRegex, (match) => {
        if (match.includes('[') || match.includes(']')) return match;
        return getPlaceholder(match, 'ID');
    });

    return { redactedText, mapping };
}

/**
 * Restores PII in a JSON object (or string) using the provided mapping.
 */
export function restorePII(obj: any, mapping: Record<string, string>): any {
    if (typeof obj === 'string') {
        let restored = obj;
        // Sort placeholders by length descending to avoid partial replacements (e.g., [ID_10] vs [ID_1])
        const placeholders = Object.keys(mapping).sort((a, b) => b.length - a.length);
        for (const placeholder of placeholders) {
            restored = restored.split(placeholder).join(mapping[placeholder]);
        }
        return restored;
    } else if (Array.isArray(obj)) {
        return obj.map(item => restorePII(item, mapping));
    } else if (obj !== null && typeof obj === 'object') {
        const restoredObj: any = {};
        for (const [key, value] of Object.entries(obj)) {
            restoredObj[key] = restorePII(value, mapping);
        }
        return restoredObj;
    }
    return obj;
}
