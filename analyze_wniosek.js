
const fs = require('fs');
const pdfParseModule = require('pdf-parse');
const pdf = typeof pdfParseModule === 'function' ? pdfParseModule : pdfParseModule.default;

(async () => {
    try {
        const buffer = fs.readFileSync('dokumenty/wniosek.pdf');
        const data = await pdf(buffer);
        console.log(data.text);
    } catch (e) {
        console.error(e);
    }
})();
