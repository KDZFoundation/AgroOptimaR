
import { test, describe, before, after, mock } from 'node:test';
import assert from 'node:assert';
import { createRequire } from 'module';
import path from 'path';

const require = createRequire(import.meta.url);

// --- Mock external dependencies ---

// 1. next/headers
const headersPath = require.resolve('next/headers');
require.cache[headersPath] = {
    id: headersPath,
    filename: headersPath,
    loaded: true,
    exports: {
        cookies: async () => ({
            getAll: () => [],
            set: () => {}
        })
    }
};

// 2. @supabase/ssr
const ssrPath = require.resolve('@supabase/ssr');
const mockSupabase = {
    auth: {
        getUser: async () => ({ data: { user: { id: 'mock-user-id' } }, error: null })
    },
    storage: {
        from: () => ({
            upload: async () => ({ data: { path: 'mock/path/file.pdf' }, error: null })
        })
    },
    from: (table) => ({
        insert: async (data) => ({ error: null }),
        select: () => ({
            eq: () => ({
                order: async () => ({ data: [], error: null })
            })
        })
    })
};

require.cache[ssrPath] = {
    id: ssrPath,
    filename: ssrPath,
    loaded: true,
    exports: {
        createServerClient: () => mockSupabase
    }
};

// 3. next/cache
const cachePath = require.resolve('next/cache');
require.cache[cachePath] = {
    id: cachePath,
    filename: cachePath,
    loaded: true,
    exports: {
        revalidatePath: () => {}
    }
};

// 4. @/lib/parsers/index.ts (Mock new parser logic)
// We need to mock the ApplicationParser class export
const parserIndexPath = path.resolve(process.cwd(), 'lib/parsers/index.ts');
class MockApplicationParser {
    async parse(buffer: Buffer) {
        return {
            kampania_rok: 2024,
            podmiot: { ep: '123456789' },
            dzialki: []
        };
    }
}

require.cache[parserIndexPath] = {
    id: parserIndexPath,
    filename: parserIndexPath,
    loaded: true,
    exports: {
        ApplicationParser: MockApplicationParser
    }
};


// --- Test Suite ---

let uploadPdf;

describe('Upload Action Characterization', () => {
    before(async () => {
        // Import action under test
        const mod = await import('../../app/actions/upload-pdf.ts');
        uploadPdf = mod.uploadPdf;
    });

    test('should upload PDF successfully', async () => {
        const formData = new FormData();
        // Node's File constructor needs specific global check or polyfill if failing
        // Try standard File
        const file = new File(['mock pdf content'], 'test.pdf', { type: 'application/pdf' });
        formData.append('file', file);

        const result = await uploadPdf(formData);

        assert.strictEqual(result.success, true);
        assert.strictEqual(result.year, 2024);
    });

    test('should fail if file is missing', async () => {
        const formData = new FormData();
        const result = await uploadPdf(formData);
        assert.strictEqual(result.error, 'No file provided');
    });

    test('should fail if file is not PDF', async () => {
        const formData = new FormData();
        const file = new File(['content'], 'test.txt', { type: 'text/plain' });
        formData.append('file', file);

        const result = await uploadPdf(formData);
        // Expect period as Zod validation adds it or I defined it that way
        assert.strictEqual(result.error, 'Only PDF files are allowed.');
    });
});
