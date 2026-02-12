const https = require('https');

const url = 'https://docs.google.com/spreadsheets/d/10UkqBjFLTFfNX6PQc4GhcsFphT1U2jZMu6bhK52UeV8/gviz/tq?tqx=out:csv';

https.get(url, (res) => {
    let data = '';

    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        const lines = data.split('\n');
        if (lines.length > 0) {
            console.log('Headers:', lines[0]);
            // Print first row of data to see example values
            if (lines.length > 1) {
                console.log('First Row:', lines[1]);
            }
        } else {
            console.log('No data found');
        }
    });

}).on('error', (err) => {
    console.error('Error:', err.message);
});
