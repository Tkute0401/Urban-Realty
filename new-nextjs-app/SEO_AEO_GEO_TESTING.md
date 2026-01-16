# SEO, AEO, and GEO Testing Guide

This document explains how to test your website's Search Engine Optimization (SEO), Answer Engine Optimization (AEO), and Geographic Optimization (GEO) using the automated testing script.

## Overview

The test script (`scripts/test-seo-aeo-geo.js`) comprehensively tests your website for:

### SEO (Search Engine Optimization)
- ✅ Meta tags (title, description, keywords)
- ✅ Open Graph tags for social sharing
- ✅ Twitter Card tags
- ✅ Canonical URLs
- ✅ Heading structure (H1-H6)
- ✅ Image alt tags
- ✅ Internal linking
- ✅ Structured data (JSON-LD)
- ✅ Robots meta tags

### AEO (Answer Engine Optimization)
- ✅ FAQ Schema
- ✅ HowTo Schema
- ✅ Article Schema
- ✅ Question/Answer content
- ✅ Definition/explanation content
- ✅ List/step content
- ✅ Rich snippets readiness
- ✅ Semantic HTML

### GEO (Geographic Optimization)
- ✅ Geo meta tags (geo.region, geo.placename, ICBM)
- ✅ LocalBusiness schema
- ✅ Address information
- ✅ Geographic coordinates
- ✅ Location-based keywords
- ✅ Area served information
- ✅ Phone numbers
- ✅ hCard microdata

## Prerequisites

- Node.js installed (v14 or higher)
- Access to your website (local or deployed)

## Usage

### Local Testing (Recommended)

Test your website running on localhost:

1. **Start your development server:**
   ```bash
   npm run dev
   ```

2. **In another terminal, run the local test:**
   ```bash
   npm run test:seo:local
   ```

This will automatically detect if your server is running and test all pages.

### Production Testing

Test your deployed website:

```bash
npm run test:seo
```

### Custom Base URL

Set a custom base URL using environment variables:

```bash
# For local development
TEST_BASE_URL=http://localhost:3000 npm run test:seo

# For production
TEST_BASE_URL=https://squarefooot.com npm run test:seo

# Or set NEXT_PUBLIC_BASE_URL
NEXT_PUBLIC_BASE_URL=https://your-domain.com npm run test:seo
```

### Direct Script Execution

You can also run the script directly:

```bash
node scripts/test-seo-aeo-geo.js
```

## Tested Pages

By default, the script tests the following pages:

- `/` (Homepage)
- `/properties`
- `/properties/buy`
- `/properties/rent`
- `/about`
- `/contact`
- `/blog`
- `/developers`
- `/emi-calculator`
- `/career`
- `/how-we-work`

## Output

The script generates:

1. **Console Output**: Real-time test results with scores and issues
2. **JSON Report**: Detailed report saved as `seo-aeo-geo-report.json`

### Report Structure

```json
{
  "timestamp": "2024-01-01T00:00:00.000Z",
  "baseUrl": "https://your-domain.com",
  "summary": {
    "totalPages": 11,
    "seo": { "average": "85.5" },
    "aeo": { "average": "72.3" },
    "geo": { "average": "68.1" }
  },
  "pages": [
    {
      "url": "https://your-domain.com/",
      "seo": { "score": 85, "maxScore": 100, "tests": [...] },
      "aeo": { "score": 70, "maxScore": 100, "tests": [...] },
      "geo": { "score": 65, "maxScore": 100, "tests": [...] }
    }
  ],
  "sitemap": { "status": "pass", "tests": [...] },
  "robots": { "status": "pass", "tests": [...] }
}
```

## Understanding Test Results

### Status Indicators

- ✅ **Pass**: Test passed successfully
- ⚠️ **Warning**: Test passed but could be improved
- ❌ **Fail**: Test failed - needs attention
- ℹ️ **Info**: Informational - not critical

### Score Interpretation

- **90-100%**: Excellent - Well optimized
- **70-89%**: Good - Minor improvements needed
- **50-69%**: Fair - Several improvements needed
- **Below 50%**: Poor - Significant optimization required

## Common Issues and Fixes

### SEO Issues

1. **Missing Title Tag**
   - Fix: Add `<title>` tag in page metadata
   - Location: `src/app/[page]/page.tsx`

2. **Title Too Long/Short**
   - Fix: Keep title between 30-60 characters
   - Example: `"Find Your Dream Property | Squarefooot"`

3. **Missing Meta Description**
   - Fix: Add description in page metadata
   - Keep between 120-160 characters

4. **Multiple H1 Tags**
   - Fix: Use only one H1 per page
   - Use H2-H6 for other headings

5. **Images Without Alt Tags**
   - Fix: Add `alt` attribute to all images
   - Example: `<img src="..." alt="Property in Mumbai" />`

### AEO Issues

1. **Missing FAQ Schema**
   - Fix: Add FAQPage schema for pages with Q&A content
   - Example: See `src/app/help/page.tsx` for reference

2. **Missing HowTo Schema**
   - Fix: Add HowTo schema for instructional content
   - Example: See `src/app/how-we-work/page.tsx` for reference

3. **Limited Question Content**
   - Fix: Add FAQ sections with common questions
   - Use question-answer format

### GEO Issues

1. **Missing Geo Meta Tags**
   - Fix: Add geo meta tags in layout or page
   ```tsx
   <meta name="geo.region" content="IN" />
   <meta name="geo.placename" content="Mumbai" />
   <meta name="ICBM" content="19.0760, 72.8777" />
   ```

2. **Missing LocalBusiness Schema**
   - Fix: Add LocalBusiness or RealEstateAgent schema
   - Include address, phone, and coordinates

3. **Missing Address Information**
   - Fix: Add address in structured data
   - Include in LocalBusiness schema

## Best Practices

### SEO Best Practices

1. **Unique Titles**: Each page should have a unique, descriptive title
2. **Descriptive Meta Descriptions**: Write compelling descriptions that encourage clicks
3. **Proper Heading Hierarchy**: Use H1 for main title, H2 for sections, etc.
4. **Alt Text for Images**: Describe images accurately for accessibility and SEO
5. **Internal Linking**: Link to related pages within your site
6. **Structured Data**: Use appropriate schema types for your content

### AEO Best Practices

1. **FAQ Pages**: Create dedicated FAQ pages with common questions
2. **HowTo Content**: Add step-by-step guides for complex processes
3. **Question Format**: Use natural language questions users might ask
4. **Rich Content**: Include lists, definitions, and explanations
5. **Semantic HTML**: Use proper HTML5 semantic elements

### GEO Best Practices

1. **Location Data**: Include accurate location information
2. **Local Keywords**: Use location-specific keywords naturally
3. **Service Areas**: Clearly define areas you serve
4. **Contact Information**: Include phone, address, and business hours
5. **Local Schema**: Use LocalBusiness schema for local presence

## Continuous Testing

### Integration with CI/CD

Add to your CI/CD pipeline:

```yaml
# Example GitHub Actions
- name: Test SEO/AEO/GEO
  run: npm run test:seo
  env:
    TEST_BASE_URL: ${{ secrets.PRODUCTION_URL }}
```

### Scheduled Testing

Set up a cron job to run tests regularly:

```bash
# Run daily at 2 AM
0 2 * * * cd /path/to/project && npm run test:seo
```

## Troubleshooting

### Connection Errors

If you see connection errors:

1. **Check URL**: Ensure the base URL is correct
2. **Network Access**: Verify you can access the website
3. **Firewall**: Check if firewall is blocking requests
4. **SSL**: For HTTPS, ensure certificates are valid

### Timeout Errors

If requests timeout:

1. **Increase Timeout**: Modify timeout in script (default: 30s)
2. **Check Server**: Ensure server is responding
3. **Network**: Check network connectivity

### Missing Data

If structured data is not detected:

1. **Check HTML**: Verify JSON-LD scripts are in HTML
2. **Format**: Ensure JSON-LD is valid JSON
3. **Location**: Check if scripts are in `<head>` or `<body>`

## Advanced Configuration

### Custom Test Pages

Edit `TEST_PAGES` array in `scripts/test-seo-aeo-geo.js`:

```javascript
const TEST_PAGES = [
  '/',
  '/your-custom-page',
  // Add more pages
];
```

### Custom Scoring

Modify test functions to adjust scoring weights:

```javascript
// In testSEO function
results.maxScore += 10; // Adjust weight
```

## Support

For issues or questions:

1. Check the test output for specific error messages
2. Review the JSON report for detailed test results
3. Verify your website's HTML structure
4. Check Next.js metadata configuration

## Related Documentation

- [Next.js Metadata API](https://nextjs.org/docs/app/building-your-application/optimizing/metadata)
- [Schema.org Documentation](https://schema.org/)
- [Google Search Central](https://developers.google.com/search)
- [Open Graph Protocol](https://ogp.me/)

---

**Last Updated**: 2024
**Script Version**: 1.0.0

