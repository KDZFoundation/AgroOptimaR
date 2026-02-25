
/**
 * Utility functions for PII (Personally Identifiable Information) redaction.
 */

export function redactPii(text: string): string {
    if (!text) return text;

    // Redact PESEL (11 digits)
    // We use word boundaries to avoid matching inside longer numbers (though 11 is long)
    text = text.replace(/\b\d{11}\b/g, '[PESEL_REDACTED]');

    // Redact Email addresses
    // Simple regex for email
    text = text.replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, '[EMAIL_REDACTED]');

    // Note: We deliberately do NOT redact 9-digit numbers as they correspond to EP (Producer Number)
    // which is required for the application logic.
    // NIP (10 digits) might be redacted if needed, but often appears in business context.
    // For now, PESEL is the critical PII for individuals.

    return text;
}
