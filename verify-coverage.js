const fs = require('fs');

function verifyCoverage() {
    const buffer = fs.readFileSync('extracted_text.txt');
    const content = buffer.toString('utf16le').replace(/\0/g, '');
    const data = JSON.parse(fs.readFileSync('parsed_data.json', 'utf8'));

    // Znajdź wszystkie wzorce x/y w tekście
    const allMatches = content.match(/\d+\/\d+/g) || [];
    const parcelLikes = [...new Set(allMatches)].filter(m => !m.includes('1/01') && !m.includes('14/20') && !m.includes('23/27') && !m.includes('25-0002'));

    const parsedParcels = new Set(data.map(d => d.parcel));

    console.log('--- COVERAGE VERIFICATION ---');
    console.log('Candidate plots found in text:', parcelLikes.length);
    console.log('Plots successfully parsed into data:', parsedParcels.size);

    const missing = parcelLikes.filter(p => !parsedParcels.has(p));
    if (missing.length > 0) {
        console.log('Missing plots:', missing);
    } else {
        console.log('All candidates accounted for!');
    }
}

verifyCoverage();
