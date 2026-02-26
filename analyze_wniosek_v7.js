
const fs = require('fs');
const pdf = require('pdf-parse');

(async () => {
    try {
        const buffer = fs.readFileSync('dokumenty/wniosek.pdf');

        let pdfFunc;
        // Check for default export
        if (pdf.default && typeof pdf.default === 'function') {
            pdfFunc = pdf.default;
        } else if (typeof pdf === 'function') {
             pdfFunc = pdf;
        } else {
             console.log('Keys:', Object.keys(pdf));
             return;
        }

        const data = await pdfFunc(buffer);
        console.log(data.text);

    } catch (e) {
        console.error('Error:', e);
    }
})();
