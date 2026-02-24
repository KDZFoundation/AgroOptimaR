const fs = require('fs');

function parseAgroComprehensive() {
    const buffer = fs.readFileSync('extracted_text.txt');
    const content = buffer.toString('utf16le').replace(/\0/g, '');
    const lines = content.split('\n').map(l => l.trim()).filter(l => l.length > 0);

    // 1. DYNAMIC CROP MAPPING 
    // Szukamy sekcji podsumowania, która zazwyczaj występuje na końcu lub po wykazie działek
    // Wzór: A [Uprawa] (NIE|TAK)
    const cropMap = {};
    const cropRegex = /^([A-K])\s+([a-zA-ZĄĆĘŁŃÓŚŹŻąćęłńóśźż\s]+?)\s+(NIE|TAK)$/;

    // Specjalna obsługa dla pszenicy, która bywa rozbita
    const pszenicaFix = { 'A': 'pszenica zwyczajna ozima', 'I': 'pszenica zwyczajna ozima' };

    lines.forEach(line => {
        const match = line.match(cropRegex);
        if (match) {
            const letter = match[1];
            const crop = match[2].trim();
            cropMap[letter] = pszenicaFix[letter] || crop;
        }
    });

    // Fallback dla znanych liter jeśli nie znaleziono w summary (na podstawie poprzednich testów)
    const defaultMap = {
        'A': 'pszenica zwyczajna ozima',
        'B': 'rzepak ozimy',
        'C': 'owies zwyczajny',
        'D': 'owies zwyczajny',
        'E': 'owies zwyczajny',
        'I': 'pszenica zwyczajna ozima',
        'K': 'TUZ'
    };
    Object.assign(defaultMap, cropMap);

    console.log('--- DETECTED CROP MAPPING ---');
    console.log(JSON.stringify(defaultMap, null, 2));

    // 2. FULL PARCEL PARSING
    let currentLetter = '';
    let currentCrop = '';
    const results = [];

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        // Wykrywanie nagłówka sekcji (np. "C owies")
        const headerMatch = line.match(/^([A-K])\s+([a-zA-ZĄĆĘŁŃÓŚŹŻąćęłńóśźż\s]+)$/);
        if (headerMatch && headerMatch[2].length > 2) {
            currentLetter = headerMatch[1];
            currentCrop = defaultMap[currentLetter] || headerMatch[2];
            continue;
        }

        // Wykrywanie litery przed nazwą uprawy w nowej linii
        if (line.length === 1 && line >= 'A' && line <= 'K') {
            if (i + 1 < lines.length && /^[a-z]+/.test(lines[i + 1])) {
                currentLetter = line;
                currentCrop = defaultMap[currentLetter] || lines[i + 1];
                i++;
                continue;
            }
        }

        // Wykrywanie numeru działki
        const parcelMatch = line.match(/^\.?(\d+\/\d+)$/);
        if (parcelMatch && currentLetter) {
            const parcel = parcelMatch[1];
            // Szukamy danych (powierzchnia i płatności)
            for (let j = 1; j <= 5; j++) {
                if (i + j >= lines.length) break;
                const nextLine = lines[i + j];

                // Wzorzec: [Wartość Powierzchnia] [Kody Płatności]
                const dataMatch = nextLine.match(/^(\d+\s+\d+)\s+([A-Z_, \s]+)$/);
                if (dataMatch) {
                    const area = dataMatch[1].replace(' ', '.');
                    const payments = dataMatch[2].trim();
                    results.push({
                        letter: currentLetter,
                        parcel: parcel,
                        crop: currentCrop,
                        area: area,
                        payments: payments
                    });
                    break;
                }
            }
        }
    }
    return results;
}

const finalResults = parseAgroComprehensive();
fs.writeFileSync('parsed_data.json', JSON.stringify(finalResults, null, 2), 'utf8');

console.log(`--- EXTRACTION COMPLETE ---`);
console.log(`Found ${finalResults.length} parcel entries.`);
console.log(`Sample of ALL letters detected:`, [...new Set(finalResults.map(r => r.letter))]);

// Wyświetlenie wszystkich działek dla użytkownika
console.log('\n--- FULL PARCEL LIST ---');
finalResults.forEach(r => {
    console.log(`${r.letter}, ${r.parcel}, ${r.crop}, ${r.area}, ${r.payments}`);
});
