const https = require('https');

const url = 'https://docs.google.com/spreadsheets/d/10UkqBjFLTFfNX6PQc4GhcsFphT1U2jZMu6bhK52UeV8/gviz/tq?tqx=out:csv';

https.get(url, (res) => {
    let data = '';

    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        // Simple CSV parser logic
        const lines = data.split('\n');
        const result = [];

        // Parse headers
        // Handle quotes in CSV if possible, but for simple analysis split by comma might suffice if no commas in values
        // Better to use a regex for splitting CSV lines
        const parseLine = (line) => {
            const matches = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || [];
            // Basic split for now as regex is tricky without a library
            // Let's just dump the raw lines for the first 5 rows to see what's going on
            return line;
        };

        console.log('--- Raw CSV Data (First 5 lines) ---');
        lines.slice(0, 5).forEach((line, index) => {
            console.log(`Line ${index}: ${line}`);
        });

        // Try to identify headers
        if (lines.length > 0) {
            // Assuming first line is headers
            const headers = lines[0].split(',').map(h => h.replace(/^"|"$/g, '').trim());
            console.log('\n--- Potential Headers ---');
            headers.forEach((h, i) => console.log(`${i}: ${h}`));
        }

    });

}).on('error', (err) => {
    console.error('Error:', err.message);
});
