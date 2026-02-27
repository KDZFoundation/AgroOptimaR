import test from 'node:test';
import assert from 'node:assert';
import {
    removeNonPrintable,
    extractJsonFromResponse,
    validateEP,
    normalizeParcelNumber
} from './text-utils.ts';

test('removeNonPrintable', async (t) => {
    await t.test('handles empty, null, and undefined', () => {
        assert.strictEqual(removeNonPrintable(""), "");
        // @ts-ignore
        assert.strictEqual(removeNonPrintable(null), "");
        // @ts-ignore
        assert.strictEqual(removeNonPrintable(undefined), "");
    });

    await t.test('preserves basic alphanumeric text', () => {
        assert.strictEqual(removeNonPrintable("Hello World 123"), "Hello World 123");
    });

    await t.test('normalizes Unicode characters (NFKC)', () => {
        // "e" + combining acute accent (\u0301) should become "é" (\u00E9)
        assert.strictEqual(removeNonPrintable("e\u0301"), "é");
    });

    await t.test('replaces special Unicode whitespace with regular space', () => {
        // \u2000 is EN QUAD
        assert.strictEqual(removeNonPrintable("A\u2000B"), "A B");
    });

    await t.test('replaces unusual line terminators with newline', () => {
        // \u2028 is LINE SEPARATOR, \u2029 is PARAGRAPH SEPARATOR, \r is Carriage Return
        assert.strictEqual(removeNonPrintable("line1\u2028line2\u2029line3\rline4"), "line1\nline2\nline3\nline4");
    });

    await t.test('replaces non-breaking spaces with regular spaces', () => {
        assert.strictEqual(removeNonPrintable("Hello\u00A0World"), "Hello World");
    });

    await t.test('removes control characters but keeps tabs and newlines', () => {
        assert.strictEqual(removeNonPrintable("Hello\x00World\x1F"), "HelloWorld");
        assert.strictEqual(removeNonPrintable("Line1\nLine2\tTab"), "Line1\nLine2\tTab");
    });

    await t.test('preserves extended Latin characters', () => {
        assert.strictEqual(removeNonPrintable("Zażółć gęślą jaźń"), "Zażółć gęślą jaźń");
    });

    await t.test('trims leading and trailing whitespace', () => {
        assert.strictEqual(removeNonPrintable("  Hello  "), "Hello");
    });
});

test('extractJsonFromResponse', async (t) => {
    await t.test('extracts basic JSON', () => {
        const result = extractJsonFromResponse('{"key": "value"}');
        assert.deepStrictEqual(result, { key: "value" });
    });

    await t.test('removes thinking tags', () => {
        const result = extractJsonFromResponse('<think>some thoughts</think>{"key": "value"}');
        assert.deepStrictEqual(result, { key: "value" });
    });

    await t.test('extracts JSON from markdown code blocks', () => {
        const result = extractJsonFromResponse('Here is the JSON:\n```json\n{"key": "value"}\n```');
        assert.deepStrictEqual(result, { key: "value" });
    });

    await t.test('handles malformed thinking tags', () => {
        const result = extractJsonFromResponse('some thoughts</think>{"key": "value"}');
        assert.deepStrictEqual(result, { key: "value" });
    });

    await t.test('returns null for invalid JSON', () => {
        assert.strictEqual(extractJsonFromResponse('not a json'), null);
        assert.strictEqual(extractJsonFromResponse(null as any), null);
    });
});

test('validateEP', async (t) => {
    await t.test('validates correct 9-digit producer numbers', () => {
        assert.strictEqual(validateEP("123456789"), true);
        assert.strictEqual(validateEP("123 456 789"), true);
    });

    await t.test('rejects invalid producer numbers', () => {
        assert.strictEqual(validateEP("12345678"), false); // Too short
        assert.strictEqual(validateEP("1234567890"), false); // Too long
        assert.strictEqual(validateEP("123A56789"), false); // Non-digit
    });
});

test('normalizeParcelNumber', async (t) => {
    await t.test('keeps only digits and slashes and trims', () => {
        assert.strictEqual(normalizeParcelNumber("123/45"), "123/45");
        assert.strictEqual(normalizeParcelNumber("nr 123/45 "), "123/45");
        assert.strictEqual(normalizeParcelNumber(" 123 / 45 "), "123/45");
        assert.strictEqual(normalizeParcelNumber("abc123def/45ghi"), "123/45");
    });
});
