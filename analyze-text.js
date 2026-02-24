const fs = require('fs');
const buffer = fs.readFileSync('extracted_text.txt');
const content = buffer.toString('utf16le').replace(/\0/g, ''); // Usuwamy ewentualne nulle

// Szukamy sekcji z wykazu działek rolnych
const sections = [
    "Wykaz działek rolnych",
    "Wykaz działek ewidencyjnych",
    "Działka rolna",
    "Płatność",
    "Uprawa"
];

sections.forEach(s => {
    const idx = content.indexOf(s);
    if (idx !== -1) {
        console.log(`--- FOUND SECTION: ${s} at ${idx} ---`);
        console.log(content.substring(idx, idx + 2000));
    }
});

// Próba znalezienia działek w formacie numer/powierzchnia
const parcelRegex = /([0-9]+\/[0-9]+)\s+([0-9]+,[0-9]+)/g;
let match;
console.log('--- REGEX SEARCH RESULTS ---');
while ((match = parcelRegex.exec(content)) !== null) {
    console.log(`Found Parcel: ${match[1]}, Area: ${match[2]}`);
}
