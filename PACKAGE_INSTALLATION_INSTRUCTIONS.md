# Package Installation Instructions

## Required Packages for Billing and Invoice Generation

The following packages need to be installed to enable the new billing and invoice generation features:

### Server-side Packages

Install these packages in the `server` directory:

```bash
cd server
npm install pdfkit
```

**PDFKit** - A PDF generation library for Node.js that creates professional-looking invoices and documents.

### Optional but Recommended Packages

For enhanced functionality, consider installing these additional packages:

```bash
npm install moment
npm install lodash
```

**Moment** - For better date handling and formatting
**Lodash** - For utility functions and data manipulation

### Client-side Packages

No additional packages are required for the client-side components. All new features use existing Material-UI components and built-in browser APIs.

## Installation Commands

### Complete Installation (Server)
```bash
cd server
npm install pdfkit moment lodash
```

### Minimal Installation (Server)
```bash
cd server
npm install pdfkit
```

## Package Details

### PDFKit (`pdfkit`)
- **Version**: Latest stable (^0.14.0)
- **Purpose**: PDF generation for invoices and billing documents
- **Features**: 
  - Professional invoice layouts
  - Custom fonts and styling
  - Table generation
  - Image support
  - Buffer and file output

### Moment (`moment`) - Optional
- **Version**: Latest stable (^2.29.4)
- **Purpose**: Advanced date manipulation and formatting
- **Features**:
  - Date parsing and validation
  - Relative time calculations
  - Internationalization support
  - Timezone handling

### Lodash (`lodash`) - Optional
- **Version**: Latest stable (^4.17.21)
- **Purpose**: Utility functions for data manipulation
- **Features**:
  - Array and object utilities
  - Deep cloning and merging
  - Performance optimizations
  - Consistent cross-browser behavior

## Verification

After installation, verify the packages are correctly installed:

```bash
cd server
npm list pdfkit
npm list moment
npm list lodash
```

## Usage Examples

### PDF Generation
```javascript
const PDFDocument = require('pdfkit');
const doc = new PDFDocument();
// Generate professional invoices
```

### Date Handling
```javascript
const moment = require('moment');
const nextBilling = moment().add(1, 'month');
```

### Data Utilities
```javascript
const _ = require('lodash');
const totalAmount = _.sumBy(bills, 'amount');
```

## Troubleshooting

### Common Issues

1. **PDFKit Installation Fails**
   - Ensure Node.js version 12+ is installed
   - Try clearing npm cache: `npm cache clean --force`
   - Use yarn instead: `yarn add pdfkit`

2. **Permission Errors**
   - Run with sudo (Linux/Mac): `sudo npm install pdfkit`
   - Check folder permissions

3. **Version Conflicts**
   - Check existing package versions
   - Use `npm audit fix` to resolve conflicts

### Alternative Solutions

If PDFKit installation fails, consider these alternatives:

1. **jsPDF** - Pure JavaScript PDF generation
   ```bash
   npm install jspdf
   ```

2. **Puppeteer** - HTML to PDF conversion
   ```bash
   npm install puppeteer
   ```

## Security Considerations

- PDFKit is safe for production use
- No known security vulnerabilities
- Regularly update packages for security patches
- Use `npm audit` to check for security issues

## Performance Notes

- PDFKit is lightweight and fast
- Invoice generation typically takes < 100ms
- Consider caching for frequently generated documents
- Monitor memory usage for high-volume generation

## Support

For package-specific issues:
- PDFKit: https://github.com/foliojs/pdfkit
- Moment: https://momentjs.com/
- Lodash: https://lodash.com/

For application-specific issues, check the project documentation or create an issue in the project repository.