const fs = require('fs');
const buffer = fs.readFileSync('extracted_text.txt');
const content = buffer.toString('utf16le').replace(/\0/g, '');

const lines = content.split('\n').map(l => l.trim()).filter(l => l.length > 0);

console.log('--- RE-ANALYZING STRUCTURE (Line by Line) ---');
// Wyświetlmy 200 linii w okolicach znalezisk
lines.slice(0, 500).forEach((line, i) => {
    if (line.match(/^[A-Z]\s/) || line.includes('owies') || line.includes('pszenica') || line.includes('126/')) {
        console.log(`L${i}: ${line}`);
    }
});
