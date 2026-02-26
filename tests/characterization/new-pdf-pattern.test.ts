
import { test, describe, afterEach, mock } from 'node:test';
import assert from 'node:assert';

// Mock pdf-parse
const mockPdfText = `
Agencja Restrukturyzacji i Modernizacji Rolnictwa
Numer dokumentu: 069630174-PLA-25-0001
Znak sprawy ONW
WNIOSEK O PRZYZNANIE PŁATNOŚCI NA ROK 2025
`;

// Mock ApplicationParser dependencies if needed, or we test the RegexParser directly
// Let's test the RegexParser directly as it's the logic unit

// We need to import the class. Since we are in a test file, we can import relative to the project root
// assuming tsx handles it.
import { RegexApplicationParser } from '../../lib/parsers/regex-parser';

describe('New PDF Pattern Characterization', () => {
  test('should extract EP and Year from Application Number pattern', () => {
    const parser = new RegexApplicationParser();
    const result = parser.parse(mockPdfText);

    assert.strictEqual(result.podmiot.ep, '069630174');
    assert.strictEqual(result.kampania_rok, 2025);
  });
});
