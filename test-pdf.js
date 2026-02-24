const fs = require('fs');
const pdf = require('pdf-parse');

async function test() {
    try {
        console.log('Keys of pdf:', Object.keys(pdf));
        let parseResult;

        // Próba 1: Jeśli to jest funkcja bezpośrednia (v1 style)
        if (typeof pdf === 'function') {
            console.log('Using pdf(buffer)');
            parseResult = await pdf(fs.readFileSync('050237165-PLA-25-0002.pdf'));
        }
        // Próba 2: Jeśli to jest v2 z klasą PDFParse
        else if (pdf.PDFParse) {
            console.log('Using new pdf.PDFParse().parse(buffer)');
            const parser = new pdf.PDFParse();
            parseResult = await parser.parse(fs.readFileSync('050237165-PLA-25-0002.pdf'));
        }
        // Próba 3: Jeśli to jest v2 z metodą statyczną
        else if (pdf.parse) {
            console.log('Using pdf.parse(buffer)');
            parseResult = await pdf.parse(fs.readFileSync('050237165-PLA-25-0002.pdf'));
        }

        if (parseResult) {
            console.log('--- EXTRACTED TEXT ---');
            console.log(parseResult.text || parseResult);
        } else {
            console.log('Could not find a valid parse method.');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

test();
