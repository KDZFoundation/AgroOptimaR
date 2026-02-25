
import { test, describe, before, after, mock } from 'node:test';
import assert from 'node:assert';
import { createRequire } from 'module';
import nock from 'nock';

const require = createRequire(import.meta.url);

// Mock 'pdf-parse'
const mockPath = require.resolve('pdf-parse');
require.cache[mockPath] = {
    id: mockPath,
    filename: mockPath,
    loaded: true,
    exports: async () => ({
        text: `
Imię i Nazwisko: Jan Kowalski
Adres: Polna 1, 00-001 Warszawa
Numer EP: 062867623
A pszenica zwyczajna ozima
C owies zwyczajny
123/45
10 50 ONW
        `
    })
};

let parsePdfApplication: any;
const originalEnv = process.env;

describe('PDF Parser Characterization', () => {
    before(async () => {
        // Set API key BEFORE import so Anthropic client initializes with it
        process.env.ANTHROPIC_API_KEY = 'dummy-key';

        // Dynamic import
        // Using the new refactored parser
        const mod = await import('../../lib/parsers/index.ts');
        parsePdfApplication = mod.parsePdfApplication;
    });

    after(() => {
        process.env = originalEnv;
        nock.cleanAll();
    });

    test('should parse using AI (mocked via nock)', async () => {
        // Ensure key is present
        process.env.ANTHROPIC_API_KEY = 'dummy-key';

        // Mock Anthropic API response
        const scope = nock('https://api.anthropic.com')
            .post('/v1/messages')
            .reply(200, {
                content: [{
                    type: 'text',
                    text: JSON.stringify({
                        kampania_rok: 2024,
                        podmiot: { ep: "062867623", nazwa: "Jan Kowalski", adres: "Polna 1, 00-001 Warszawa" },
                        dzialki: [
                            { nr_dzialki: "123/45", pow_dzialki_ha: 10.5, uprawa: "pszenica", kod_uprawy: "A", platnosci: ["ONW"] }
                        ],
                        ekoschematy_ogolne: []
                    })
                }]
            });

        const result = await parsePdfApplication(Buffer.from('dummy'));

        assert.strictEqual(result.kampania_rok, 2024);
        assert.strictEqual(result.podmiot.ep, "062867623");
        assert.strictEqual(result.dzialki.length, 1);

        scope.done();
    });

    test('should fallback to Regex parsing when AI fails/no key', async () => {
        // Force fallback by removing key
        delete process.env.ANTHROPIC_API_KEY;

        const result = await parsePdfApplication(Buffer.from('dummy'));

        assert.strictEqual(result.podmiot.ep, "062867623");
        assert.strictEqual(result.dzialki.length, 1);
        assert.strictEqual(result.dzialki[0].nr_dzialki, "123/45");

        // Restore for cleanup (optional)
        process.env.ANTHROPIC_API_KEY = 'dummy-key';
    });
});
