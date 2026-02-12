const https = require('https');
const Project = require('../models/Project');
const Developer = require('../models/Developer');
const slugify = require('slugify');

const SHEET_ID = '10UkqBjFLTFfNX6PQc4GhcsFphT1U2jZMu6bhK52UeV8';
const SHEET_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv`;

const parseCSV = (text) => {
    const result = [];
    let row = [];
    let inQuote = false;
    let currentToken = '';

    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        const nextChar = text[i + 1];

        if (char === '"') {
            if (inQuote && nextChar === '"') {
                currentToken += '"';
                i++;
            } else {
                inQuote = !inQuote;
            }
        } else if (char === ',' && !inQuote) {
            row.push(currentToken.trim());
            currentToken = '';
        } else if ((char === '\r' || char === '\n') && !inQuote) {
            if (currentToken || row.length > 0) {
                row.push(currentToken.trim());
                result.push(row);
                row = [];
                currentToken = '';
            }
            if (char === '\r' && nextChar === '\n') i++;
        } else {
            currentToken += char;
        }
    }
    if (currentToken || row.length > 0) {
        row.push(currentToken.trim());
        result.push(row);
    }
    return result;
};

const getHeaderIndex = (headers, possibleNames) => {
    return headers.findIndex(h =>
        possibleNames.some(name => h.toLowerCase().includes(name.toLowerCase()))
    );
};

const syncProjectsFromSheet = async (adminUserId) => {
    return new Promise((resolve, reject) => {
        https.get(SHEET_URL, async (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', async () => {
                try {
                    const rows = parseCSV(data);
                    if (rows.length < 2) return resolve({ count: 0, message: 'No data found' });

                    const headers = rows[0].map(h => h.replace(/^"|"$/g, '').trim());
                    const projects = [];
                    let newCount = 0;
                    let updatedCount = 0;

                    // Map headers to indices
                    const idx = {
                        name: getHeaderIndex(headers, ['Project Name', 'Property Name', 'Name of Project']),
                        developer: getHeaderIndex(headers, ['Builder', 'Developer', 'Builder Name']),
                        city: getHeaderIndex(headers, ['City']),
                        locality: getHeaderIndex(headers, ['Locality']),
                        state: getHeaderIndex(headers, ['State']),
                        pin: getHeaderIndex(headers, ['Pin Code', 'Pincode', 'Zip']),
                        config: getHeaderIndex(headers, ['Configuration']),
                        possession: getHeaderIndex(headers, ['Possession']),
                        status: getHeaderIndex(headers, ['Status']),
                        rera: getHeaderIndex(headers, ['RERA']),
                        price: getHeaderIndex(headers, ['Price']),
                        units: getHeaderIndex(headers, ['Total Units', 'Units']),
                        area: getHeaderIndex(headers, ['Area', 'Land Area']),
                        desc: getHeaderIndex(headers, ['Description', 'About']),
                        brochure: getHeaderIndex(headers, ['Brochure']),
                        map: getHeaderIndex(headers, ['Map Link', 'Location Link'])
                    };

                    for (let i = 1; i < rows.length; i++) {
                        const row = rows[i];
                        const name = row[idx.name];

                        if (!name) continue;

                        // Check if exists
                        let project = await Project.findOne({
                            $or: [
                                { name: name },
                                { slug: slugify(name, { lower: true }) }
                            ]
                        });

                        if (project) {
                            // Optionally update? For now, skip to avoid overwriting manual changes
                            console.log(`Skipping existing project: ${name}`);
                            continue;
                        }

                        // Handle Developer
                        let developerId = null;
                        const devName = row[idx.developer];
                        if (devName) {
                            let developer = await Developer.findOne({ name: new RegExp(`^${devName}$`, 'i') });
                            if (!developer) {
                                developer = await Developer.create({
                                    name: devName,
                                    description: `New developer imported from sheet: ${devName}`,
                                    userId: adminUserId // Assign to admin temporarily
                                });
                                console.log(`Created new developer: ${devName}`);
                            }
                            developerId = developer._id;
                        }

                        // Construct Description from various fields
                        let description = row[idx.desc] || `Project ${name} located in ${row[idx.city] || 'India'}.`;
                        description += `\n\n--- Imported Details ---\n`;
                        if (row[idx.config]) description += `Configuration: ${row[idx.config]}\n`;
                        if (row[idx.price]) description += `Price Range: ${row[idx.price]}\n`;
                        if (row[idx.units]) description += `Total Units: ${row[idx.units]}\n`;
                        if (row[idx.area]) description += `Total Area: ${row[idx.area]}\n`;
                        if (row[idx.rera]) description += `RERA ID: ${row[idx.rera]}\n`;

                        // Parse status
                        let status = 'Planning';
                        const rawStatus = row[idx.status] ? row[idx.status].toLowerCase() : '';
                        if (rawStatus.includes('construction')) status = 'Under Construction';
                        else if (rawStatus.includes('ready')) status = 'Completed';
                        else if (rawStatus.includes('new')) status = 'Planning';

                        // Create Project
                        project = await Project.create({
                            name: name,
                            description: description,
                            shortDescription: `New launch by ${devName || 'Unknown'} in ${row[idx.locality] || ''}, ${row[idx.city] || ''}.`,
                            type: 'Residential', // Default
                            status: status,
                            developer: developerId, // Note: Project schema uses 'developers' array usually, but let's check schema
                            // Checking schema: developers: [{ type: ObjectId, ref: 'Developer' }]
                            // So we need to wrap it
                            developers: developerId ? [developerId] : [],
                            location: {
                                address: row[idx.locality] || 'Address Pending',
                                city: row[idx.city] || 'City Pending',
                                state: row[idx.state] || 'State Pending',
                                pincode: row[idx.pin] || '000000',
                                country: 'India'
                            },
                            isPublished: false, // DRAFT
                            isFeatured: false,
                            agent: adminUserId // Assigned to admin
                        });

                        newCount++;
                    }

                    resolve({ success: true, new: newCount, message: `Synced ${newCount} new projects.` });
                } catch (err) {
                    reject(err);
                }
            });
        }).on('error', (err) => reject(err));
    });
};

module.exports = { syncProjectsFromSheet };
