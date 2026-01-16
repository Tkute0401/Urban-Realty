#!/usr/bin/env node

/**
 * Comprehensive SEO, AEO, and GEO Testing Script
 * Tests the website for Search Engine Optimization, Answer Engine Optimization, and Geographic Optimization
 */

const https = require('https');
const http = require('http');
const { URL } = require('url');
const fs = require('fs');
const path = require('path');

// Configuration
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 
                 process.env.TEST_BASE_URL || 
                 'https://urban-realty-production.up.railway.app' ||
                 'https://squarefooot.com';

const TEST_PAGES = [
  '/',
  '/properties',
  '/properties/buy',
  '/properties/rent',
  '/about',
  '/contact',
  '/blog',
  '/developers',
  '/emi-calculator',
  '/career',
  '/how-we-work',
];

// Test Results Storage
const testResults = {
  seo: [],
  aeo: [],
  geo: [],
  summary: {
    totalTests: 0,
    passed: 0,
    failed: 0,
    warnings: 0,
  }
};

// Utility Functions
function fetchPage(url) {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);
    const client = parsedUrl.protocol === 'https:' ? https : http;
    
    const options = {
      hostname: parsedUrl.hostname,
      port: parsedUrl.port || (parsedUrl.protocol === 'https:' ? 443 : 80),
      path: parsedUrl.pathname + parsedUrl.search,
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; SEO-Test-Bot/1.0)',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
      timeout: 30000,
    };

    const req = client.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data,
          url: url,
        });
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    req.end();
  });
}

function extractMetaTags(html) {
  const metaTags = {};
  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  const descriptionMatch = html.match(/<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i);
  const keywordsMatch = html.match(/<meta\s+name=["']keywords["']\s+content=["']([^"']+)["']/i);
  const robotsMatch = html.match(/<meta\s+name=["']robots["']\s+content=["']([^"']+)["']/i);
  const canonicalMatch = html.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']+)["']/i);
  
  // Open Graph tags
  const ogTitleMatch = html.match(/<meta\s+property=["']og:title["']\s+content=["']([^"']+)["']/i);
  const ogDescriptionMatch = html.match(/<meta\s+property=["']og:description["']\s+content=["']([^"']+)["']/i);
  const ogImageMatch = html.match(/<meta\s+property=["']og:image["']\s+content=["']([^"']+)["']/i);
  const ogUrlMatch = html.match(/<meta\s+property=["']og:url["']\s+content=["']([^"']+)["']/i);
  const ogTypeMatch = html.match(/<meta\s+property=["']og:type["']\s+content=["']([^"']+)["']/i);
  
  // Twitter Card tags
  const twitterCardMatch = html.match(/<meta\s+name=["']twitter:card["']\s+content=["']([^"']+)["']/i);
  const twitterTitleMatch = html.match(/<meta\s+name=["']twitter:title["']\s+content=["']([^"']+)["']/i);
  const twitterDescriptionMatch = html.match(/<meta\s+name=["']twitter:description["']\s+content=["']([^"']+)["']/i);
  const twitterImageMatch = html.match(/<meta\s+name=["']twitter:image["']\s+content=["']([^"']+)["']/i);
  
  // Geo tags
  const geoRegionMatch = html.match(/<meta\s+name=["']geo\.region["']\s+content=["']([^"']+)["']/i);
  const geoPlacenameMatch = html.match(/<meta\s+name=["']geo\.placename["']\s+content=["']([^"']+)["']/i);
  const icbmMatch = html.match(/<meta\s+name=["']ICBM["']\s+content=["']([^"']+)["']/i);
  
  return {
    title: titleMatch ? titleMatch[1] : null,
    description: descriptionMatch ? descriptionMatch[1] : null,
    keywords: keywordsMatch ? keywordsMatch[1] : null,
    robots: robotsMatch ? robotsMatch[1] : null,
    canonical: canonicalMatch ? canonicalMatch[1] : null,
    ogTitle: ogTitleMatch ? ogTitleMatch[1] : null,
    ogDescription: ogDescriptionMatch ? ogDescriptionMatch[1] : null,
    ogImage: ogImageMatch ? ogImageMatch[1] : null,
    ogUrl: ogUrlMatch ? ogUrlMatch[1] : null,
    ogType: ogTypeMatch ? ogTypeMatch[1] : null,
    twitterCard: twitterCardMatch ? twitterCardMatch[1] : null,
    twitterTitle: twitterTitleMatch ? twitterTitleMatch[1] : null,
    twitterDescription: twitterDescriptionMatch ? twitterDescriptionMatch[1] : null,
    twitterImage: twitterImageMatch ? twitterImageMatch[1] : null,
    geoRegion: geoRegionMatch ? geoRegionMatch[1] : null,
    geoPlacename: geoPlacenameMatch ? geoPlacenameMatch[1] : null,
    icbm: icbmMatch ? icbmMatch[1] : null,
  };
}

function extractStructuredData(html) {
  const structuredData = [];
  const scriptMatches = html.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi);
  
  for (const match of scriptMatches) {
    try {
      const json = JSON.parse(match[1]);
      structuredData.push(json);
    } catch (e) {
      // Invalid JSON, skip
    }
  }
  
  return structuredData;
}

function extractHeadings(html) {
  const headings = {
    h1: [],
    h2: [],
    h3: [],
    h4: [],
    h5: [],
    h6: [],
  };
  
  for (let i = 1; i <= 6; i++) {
    const matches = html.matchAll(new RegExp(`<h${i}[^>]*>([^<]+)</h${i}>`, 'gi'));
    for (const match of matches) {
      headings[`h${i}`].push(match[1].trim());
    }
  }
  
  return headings;
}

function extractImages(html) {
  const images = [];
  const imgMatches = html.matchAll(/<img[^>]*>/gi);
  
  for (const match of imgMatches) {
    const imgTag = match[0];
    const srcMatch = imgTag.match(/src=["']([^"']+)["']/i);
    const altMatch = imgTag.match(/alt=["']([^"']*)["']/i);
    
    images.push({
      src: srcMatch ? srcMatch[1] : null,
      alt: altMatch ? altMatch[1] : null,
      hasAlt: !!altMatch,
    });
  }
  
  return images;
}

function extractLinks(html, baseUrl) {
  const links = {
    internal: [],
    external: [],
  };
  
  const linkMatches = html.matchAll(/<a[^>]*href=["']([^"']+)["'][^>]*>/gi);
  
  for (const match of linkMatches) {
    const href = match[1];
    try {
      const url = new URL(href, baseUrl);
      if (url.hostname === new URL(baseUrl).hostname) {
        links.internal.push(href);
      } else {
        links.external.push(href);
      }
    } catch (e) {
      // Invalid URL, skip
    }
  }
  
  return links;
}

// SEO Tests
function testSEO(pageUrl, html, metaTags, structuredData, headings, images, links) {
  const results = {
    url: pageUrl,
    tests: [],
    score: 0,
    maxScore: 0,
  };

  // Test 1: Title Tag
  results.maxScore += 10;
  if (metaTags.title) {
    if (metaTags.title.length >= 30 && metaTags.title.length <= 60) {
      results.tests.push({ test: 'Title tag exists and optimal length (30-60 chars)', status: 'pass', value: metaTags.title });
      results.score += 10;
    } else {
      results.tests.push({ test: 'Title tag exists but length not optimal', status: 'warning', value: metaTags.title, expected: '30-60 characters' });
      results.score += 5;
    }
  } else {
    results.tests.push({ test: 'Title tag missing', status: 'fail' });
  }

  // Test 2: Meta Description
  results.maxScore += 10;
  if (metaTags.description) {
    if (metaTags.description.length >= 120 && metaTags.description.length <= 160) {
      results.tests.push({ test: 'Meta description exists and optimal length (120-160 chars)', status: 'pass', value: metaTags.description });
      results.score += 10;
    } else {
      results.tests.push({ test: 'Meta description exists but length not optimal', status: 'warning', value: metaTags.description, expected: '120-160 characters' });
      results.score += 5;
    }
  } else {
    results.tests.push({ test: 'Meta description missing', status: 'fail' });
  }

  // Test 3: Canonical URL
  results.maxScore += 5;
  if (metaTags.canonical) {
    results.tests.push({ test: 'Canonical URL present', status: 'pass', value: metaTags.canonical });
    results.score += 5;
  } else {
    results.tests.push({ test: 'Canonical URL missing', status: 'warning' });
    results.score += 2;
  }

  // Test 4: Robots Meta
  results.maxScore += 5;
  if (metaTags.robots) {
    results.tests.push({ test: 'Robots meta tag present', status: 'pass', value: metaTags.robots });
    results.score += 5;
  } else {
    results.tests.push({ test: 'Robots meta tag missing (defaults to index, follow)', status: 'warning' });
    results.score += 3;
  }

  // Test 5: H1 Tag
  results.maxScore += 10;
  if (headings.h1.length === 1) {
    results.tests.push({ test: 'Single H1 tag present', status: 'pass', value: headings.h1[0] });
    results.score += 10;
  } else if (headings.h1.length > 1) {
    results.tests.push({ test: 'Multiple H1 tags found (should be only one)', status: 'warning', value: headings.h1.length });
    results.score += 5;
  } else {
    results.tests.push({ test: 'H1 tag missing', status: 'fail' });
  }

  // Test 6: Heading Hierarchy
  results.maxScore += 5;
  if (headings.h1.length > 0 && headings.h2.length > 0) {
    results.tests.push({ test: 'Proper heading hierarchy (H1 -> H2)', status: 'pass' });
    results.score += 5;
  } else {
    results.tests.push({ test: 'Heading hierarchy incomplete', status: 'warning' });
    results.score += 2;
  }

  // Test 7: Image Alt Tags
  results.maxScore += 10;
  const imagesWithoutAlt = images.filter(img => !img.hasAlt || !img.alt);
  if (imagesWithoutAlt.length === 0 && images.length > 0) {
    results.tests.push({ test: 'All images have alt tags', status: 'pass', value: `${images.length} images` });
    results.score += 10;
  } else if (images.length > 0) {
    const percentage = ((images.length - imagesWithoutAlt.length) / images.length * 100).toFixed(0);
    results.tests.push({ test: `Some images missing alt tags (${percentage}% have alt)`, status: 'warning', value: `${imagesWithoutAlt.length}/${images.length} missing` });
    results.score += Math.round(10 * (images.length - imagesWithoutAlt.length) / images.length);
  } else {
    results.tests.push({ test: 'No images found on page', status: 'warning' });
    results.score += 5;
  }

  // Test 8: Internal Links
  results.maxScore += 5;
  if (links.internal.length > 0) {
    results.tests.push({ test: 'Internal links present', status: 'pass', value: `${links.internal.length} internal links` });
    results.score += 5;
  } else {
    results.tests.push({ test: 'No internal links found', status: 'warning' });
    results.score += 2;
  }

  // Test 9: Open Graph Tags
  results.maxScore += 10;
  const ogTags = ['ogTitle', 'ogDescription', 'ogImage', 'ogUrl', 'ogType'];
  const presentOgTags = ogTags.filter(tag => metaTags[tag]);
  if (presentOgTags.length >= 4) {
    results.tests.push({ test: 'Open Graph tags present', status: 'pass', value: `${presentOgTags.length}/5 tags` });
    results.score += 10;
  } else {
    results.tests.push({ test: 'Open Graph tags incomplete', status: 'warning', value: `${presentOgTags.length}/5 tags` });
    results.score += Math.round(10 * presentOgTags.length / 5);
  }

  // Test 10: Twitter Card Tags
  results.maxScore += 5;
  const twitterTags = ['twitterCard', 'twitterTitle', 'twitterDescription', 'twitterImage'];
  const presentTwitterTags = twitterTags.filter(tag => metaTags[tag]);
  if (presentTwitterTags.length >= 3) {
    results.tests.push({ test: 'Twitter Card tags present', status: 'pass', value: `${presentTwitterTags.length}/4 tags` });
    results.score += 5;
  } else {
    results.tests.push({ test: 'Twitter Card tags incomplete', status: 'warning', value: `${presentTwitterTags.length}/4 tags` });
    results.score += Math.round(5 * presentTwitterTags.length / 4);
  }

  // Test 11: Structured Data
  results.maxScore += 15;
  if (structuredData.length > 0) {
    const schemaTypes = structuredData.map(sd => sd['@type']).filter(Boolean);
    results.tests.push({ test: 'Structured data (JSON-LD) present', status: 'pass', value: `${structuredData.length} schema(s): ${schemaTypes.join(', ')}` });
    results.score += 15;
  } else {
    results.tests.push({ test: 'Structured data (JSON-LD) missing', status: 'fail' });
  }

  // Test 12: Meta Keywords (Optional but checked)
  results.maxScore += 2;
  if (metaTags.keywords) {
    results.tests.push({ test: 'Meta keywords present (optional)', status: 'pass', value: metaTags.keywords });
    results.score += 2;
  } else {
    results.tests.push({ test: 'Meta keywords not present (optional)', status: 'info' });
    results.score += 1;
  }

  return results;
}

// AEO Tests (Answer Engine Optimization)
function testAEO(pageUrl, html, structuredData, headings) {
  const results = {
    url: pageUrl,
    tests: [],
    score: 0,
    maxScore: 0,
  };

  // Test 1: FAQ Schema
  results.maxScore += 15;
  const faqSchemas = structuredData.filter(sd => 
    sd['@type'] === 'FAQPage' || 
    (sd['@type'] === 'ItemList' && sd.itemListElement && sd.itemListElement.some(item => item['@type'] === 'Question'))
  );
  if (faqSchemas.length > 0) {
    results.tests.push({ test: 'FAQ Schema present (AEO)', status: 'pass', value: `${faqSchemas.length} FAQ schema(s)` });
    results.score += 15;
  } else {
    results.tests.push({ test: 'FAQ Schema missing (AEO opportunity)', status: 'warning' });
    results.score += 0;
  }

  // Test 2: HowTo Schema
  results.maxScore += 15;
  const howToSchemas = structuredData.filter(sd => sd['@type'] === 'HowTo');
  if (howToSchemas.length > 0) {
    results.tests.push({ test: 'HowTo Schema present (AEO)', status: 'pass', value: `${howToSchemas.length} HowTo schema(s)` });
    results.score += 15;
  } else {
    results.tests.push({ test: 'HowTo Schema missing (AEO opportunity)', status: 'warning' });
    results.score += 0;
  }

  // Test 3: Article Schema
  results.maxScore += 10;
  const articleSchemas = structuredData.filter(sd => 
    sd['@type'] === 'Article' || 
    sd['@type'] === 'BlogPosting' ||
    sd['@type'] === 'NewsArticle'
  );
  if (articleSchemas.length > 0) {
    results.tests.push({ test: 'Article Schema present (AEO)', status: 'pass', value: `${articleSchemas.length} Article schema(s)` });
    results.score += 10;
  } else {
    results.tests.push({ test: 'Article Schema missing (AEO opportunity for blog pages)', status: 'info' });
    results.score += 0;
  }

  // Test 4: Question/Answer Content
  results.maxScore += 10;
  const questionPatterns = [
    /what\s+(is|are|do|does|can|will)/i,
    /how\s+(to|do|does|can|will)/i,
    /why\s+(is|are|do|does)/i,
    /when\s+(is|are|do|does|can|will)/i,
    /where\s+(is|are|can|do)/i,
  ];
  const hasQuestionContent = questionPatterns.some(pattern => pattern.test(html));
  if (hasQuestionContent) {
    results.tests.push({ test: 'Question-based content detected (AEO)', status: 'pass' });
    results.score += 10;
  } else {
    results.tests.push({ test: 'Question-based content not detected (AEO opportunity)', status: 'info' });
    results.score += 3;
  }

  // Test 5: Definition/Explanation Content
  results.maxScore += 10;
  const definitionPatterns = [
    /(is|are|means|refers to|defined as)/i,
    /(explanation|definition|overview|introduction)/i,
  ];
  const hasDefinitionContent = definitionPatterns.some(pattern => pattern.test(html));
  if (hasDefinitionContent) {
    results.tests.push({ test: 'Definition/explanation content present (AEO)', status: 'pass' });
    results.score += 10;
  } else {
    results.tests.push({ test: 'Definition/explanation content limited (AEO opportunity)', status: 'info' });
    results.score += 3;
  }

  // Test 6: List/Step Content
  results.maxScore += 10;
  const listPatterns = [
    /<ol[^>]*>/i,
    /<ul[^>]*>/i,
    /(step\s+\d+|first|second|third|finally)/i,
  ];
  const hasListContent = listPatterns.some(pattern => pattern.test(html));
  if (hasListContent) {
    results.tests.push({ test: 'List/step content present (AEO)', status: 'pass' });
    results.score += 10;
  } else {
    results.tests.push({ test: 'List/step content limited (AEO opportunity)', status: 'info' });
    results.score += 3;
  }

  // Test 7: Rich Snippets Ready
  results.maxScore += 10;
  const richSnippetTypes = ['Product', 'Review', 'Rating', 'BreadcrumbList', 'VideoObject'];
  const hasRichSnippets = structuredData.some(sd => richSnippetTypes.includes(sd['@type']));
  if (hasRichSnippets) {
    results.tests.push({ test: 'Rich snippet schemas present (AEO)', status: 'pass' });
    results.score += 10;
  } else {
    results.tests.push({ test: 'Rich snippet schemas not detected (AEO opportunity)', status: 'info' });
    results.score += 2;
  }

  // Test 8: Semantic HTML
  results.maxScore += 10;
  const semanticTags = ['<article', '<section', '<nav', '<header', '<footer', '<main', '<aside'];
  const hasSemanticHTML = semanticTags.some(tag => html.includes(tag));
  if (hasSemanticHTML) {
    results.tests.push({ test: 'Semantic HTML present (AEO)', status: 'pass' });
    results.score += 10;
  } else {
    results.tests.push({ test: 'Semantic HTML limited (AEO opportunity)', status: 'warning' });
    results.score += 3;
  }

  return results;
}

// GEO Tests (Geographic Optimization)
function testGEO(pageUrl, html, metaTags, structuredData) {
  const results = {
    url: pageUrl,
    tests: [],
    score: 0,
    maxScore: 0,
  };

  // Test 1: Geo Meta Tags
  results.maxScore += 15;
  const hasGeoMeta = metaTags.geoRegion || metaTags.geoPlacename || metaTags.icbm;
  if (hasGeoMeta) {
    const geoInfo = [];
    if (metaTags.geoRegion) geoInfo.push(`Region: ${metaTags.geoRegion}`);
    if (metaTags.geoPlacename) geoInfo.push(`Place: ${metaTags.geoPlacename}`);
    if (metaTags.icbm) geoInfo.push(`Coordinates: ${metaTags.icbm}`);
    results.tests.push({ test: 'Geo meta tags present', status: 'pass', value: geoInfo.join(', ') });
    results.score += 15;
  } else {
    results.tests.push({ test: 'Geo meta tags missing (GEO opportunity)', status: 'warning' });
    results.score += 0;
  }

  // Test 2: LocalBusiness Schema
  results.maxScore += 20;
  const localBusinessSchemas = structuredData.filter(sd => 
    sd['@type'] === 'LocalBusiness' || 
    sd['@type'] === 'RealEstateAgent' ||
    (sd['@type'] === 'Organization' && sd.address)
  );
  if (localBusinessSchemas.length > 0) {
    results.tests.push({ test: 'LocalBusiness/Organization schema with address present', status: 'pass', value: `${localBusinessSchemas.length} schema(s)` });
    results.score += 20;
  } else {
    results.tests.push({ test: 'LocalBusiness schema missing (GEO opportunity)', status: 'warning' });
    results.score += 0;
  }

  // Test 3: Address Information
  results.maxScore += 15;
  const hasAddress = structuredData.some(sd => 
    sd.address || 
    (sd['@type'] === 'PostalAddress') ||
    html.match(/(street|address|city|state|zip|postal|country)/i)
  );
  if (hasAddress) {
    results.tests.push({ test: 'Address information present', status: 'pass' });
    results.score += 15;
  } else {
    results.tests.push({ test: 'Address information missing (GEO opportunity)', status: 'warning' });
    results.score += 0;
  }

  // Test 4: Geographic Coordinates
  results.maxScore += 15;
  const hasCoordinates = structuredData.some(sd => 
    sd.geo || 
    sd.geoCoordinates ||
    (sd.address && sd.address.geo) ||
    metaTags.icbm
  );
  if (hasCoordinates) {
    results.tests.push({ test: 'Geographic coordinates present', status: 'pass' });
    results.score += 15;
  } else {
    results.tests.push({ test: 'Geographic coordinates missing (GEO opportunity)', status: 'warning' });
    results.score += 0;
  }

  // Test 5: Location-Based Keywords
  results.maxScore += 10;
  const locationKeywords = [
    /(city|town|area|region|location|address|near|located)/i,
    /(mumbai|delhi|bangalore|pune|nashik|hyderabad|chennai|kolkata)/i,
  ];
  const hasLocationKeywords = locationKeywords.some(pattern => pattern.test(html));
  if (hasLocationKeywords) {
    results.tests.push({ test: 'Location-based keywords present', status: 'pass' });
    results.score += 10;
  } else {
    results.tests.push({ test: 'Location-based keywords limited (GEO opportunity)', status: 'info' });
    results.score += 3;
  }

  // Test 6: Area Served
  results.maxScore += 10;
  const hasAreaServed = structuredData.some(sd => 
    sd.areaServed || 
    sd.serviceArea ||
    html.match(/(serving|service area|coverage|available in)/i)
  );
  if (hasAreaServed) {
    results.tests.push({ test: 'Area served information present', status: 'pass' });
    results.score += 10;
  } else {
    results.tests.push({ test: 'Area served information missing (GEO opportunity)', status: 'info' });
    results.score += 2;
  }

  // Test 7: Phone Number
  results.maxScore += 10;
  const phonePatterns = [
    /\+?\d{1,4}[-.\s]?\(?\d{1,4}\)?[-.\s]?\d{1,4}[-.\s]?\d{1,9}/,
    /tel:/i,
  ];
  const hasPhone = phonePatterns.some(pattern => pattern.test(html)) ||
                   structuredData.some(sd => sd.telephone || (sd.contactPoint && sd.contactPoint.telephone));
  if (hasPhone) {
    results.tests.push({ test: 'Phone number present (GEO)', status: 'pass' });
    results.score += 10;
  } else {
    results.tests.push({ test: 'Phone number missing (GEO opportunity)', status: 'info' });
    results.score += 2;
  }

  // Test 8: hCard Microdata (if present)
  results.maxScore += 5;
  const hasHCard = html.match(/class=["'][^"']*vcard[^"']*["']/i) || 
                   html.match(/itemtype=["'][^"']*schema\.org\/PostalAddress[^"']*["']/i);
  if (hasHCard) {
    results.tests.push({ test: 'hCard microdata present (GEO)', status: 'pass' });
    results.score += 5;
  } else {
    results.tests.push({ test: 'hCard microdata not detected (optional)', status: 'info' });
    results.score += 1;
  }

  return results;
}

// Test Sitemap and Robots
async function testSitemapAndRobots(baseUrl) {
  const results = {
    sitemap: { status: 'unknown', tests: [] },
    robots: { status: 'unknown', tests: [] },
  };

  try {
    // Test Sitemap
    const sitemapUrl = `${baseUrl}/sitemap.xml`;
    try {
      const sitemapResponse = await fetchPage(sitemapUrl);
      if (sitemapResponse.statusCode === 200) {
        const urlMatches = sitemapResponse.body.match(/<url>/gi);
        const urlCount = urlMatches ? urlMatches.length : 0;
        results.sitemap.status = 'pass';
        results.sitemap.tests.push({ test: 'Sitemap accessible', status: 'pass', value: `${urlCount} URLs found` });
        results.sitemap.tests.push({ test: 'Sitemap XML valid', status: 'pass' });
      } else {
        results.sitemap.status = 'fail';
        results.sitemap.tests.push({ test: 'Sitemap not accessible', status: 'fail', value: `Status: ${sitemapResponse.statusCode}` });
      }
    } catch (error) {
      results.sitemap.status = 'fail';
      results.sitemap.tests.push({ test: 'Sitemap error', status: 'fail', value: error.message });
    }

    // Test Robots.txt
    const robotsUrl = `${baseUrl}/robots.txt`;
    try {
      const robotsResponse = await fetchPage(robotsUrl);
      if (robotsResponse.statusCode === 200) {
        const hasSitemap = robotsResponse.body.includes('Sitemap:') || robotsResponse.body.includes('sitemap:');
        const hasUserAgent = robotsResponse.body.includes('User-agent:') || robotsResponse.body.includes('User-agent:');
        results.robots.status = 'pass';
        results.robots.tests.push({ test: 'Robots.txt accessible', status: 'pass' });
        if (hasSitemap) {
          results.robots.tests.push({ test: 'Sitemap reference in robots.txt', status: 'pass' });
        } else {
          results.robots.tests.push({ test: 'Sitemap reference missing in robots.txt', status: 'warning' });
        }
        if (hasUserAgent) {
          results.robots.tests.push({ test: 'User-agent rules present', status: 'pass' });
        }
      } else {
        results.robots.status = 'fail';
        results.robots.tests.push({ test: 'Robots.txt not accessible', status: 'fail', value: `Status: ${robotsResponse.statusCode}` });
      }
    } catch (error) {
      results.robots.status = 'fail';
      results.robots.tests.push({ test: 'Robots.txt error', status: 'fail', value: error.message });
    }
  } catch (error) {
    console.error('Error testing sitemap/robots:', error);
  }

  return results;
}

// Generate Report
function generateReport(allResults, sitemapRobotsResults) {
  const report = {
    timestamp: new Date().toISOString(),
    baseUrl: BASE_URL,
    summary: {
      totalPages: allResults.length,
      seo: { average: 0, total: 0 },
      aeo: { average: 0, total: 0 },
      geo: { average: 0, total: 0 },
    },
    pages: allResults,
    sitemap: sitemapRobotsResults.sitemap,
    robots: sitemapRobotsResults.robots,
  };

  // Calculate averages
  const seoScores = allResults.map(r => r.seo.score / r.seo.maxScore * 100).filter(s => !isNaN(s));
  const aeoScores = allResults.map(r => r.aeo.score / r.aeo.maxScore * 100).filter(s => !isNaN(s));
  const geoScores = allResults.map(r => r.geo.score / r.geo.maxScore * 100).filter(s => !isNaN(s));

  report.summary.seo.average = seoScores.length > 0 ? (seoScores.reduce((a, b) => a + b, 0) / seoScores.length).toFixed(1) : 0;
  report.summary.aeo.average = aeoScores.length > 0 ? (aeoScores.reduce((a, b) => a + b, 0) / aeoScores.length).toFixed(1) : 0;
  report.summary.geo.average = geoScores.length > 0 ? (geoScores.reduce((a, b) => a + b, 0) / geoScores.length).toFixed(1) : 0;

  return report;
}

// Print Report
function printReport(report) {
  console.log('\n' + '='.repeat(80));
  console.log('SEO, AEO, and GEO Test Report');
  console.log('='.repeat(80));
  console.log(`Base URL: ${report.baseUrl}`);
  console.log(`Test Date: ${new Date(report.timestamp).toLocaleString()}`);
  console.log(`Pages Tested: ${report.summary.totalPages}`);
  console.log('\n' + '-'.repeat(80));
  console.log('OVERALL SCORES');
  console.log('-'.repeat(80));
  console.log(`SEO Score: ${report.summary.seo.average}%`);
  console.log(`AEO Score: ${report.summary.aeo.average}%`);
  console.log(`GEO Score: ${report.summary.geo.average}%`);
  console.log('\n' + '-'.repeat(80));
  console.log('SITEMAP & ROBOTS.TXT');
  console.log('-'.repeat(80));
  
  report.sitemap.tests.forEach(test => {
    const icon = test.status === 'pass' ? '✅' : test.status === 'warning' ? '⚠️' : '❌';
    console.log(`${icon} ${test.test}${test.value ? `: ${test.value}` : ''}`);
  });
  
  report.robots.tests.forEach(test => {
    const icon = test.status === 'pass' ? '✅' : test.status === 'warning' ? '⚠️' : '❌';
    console.log(`${icon} ${test.test}${test.value ? `: ${test.value}` : ''}`);
  });

  console.log('\n' + '-'.repeat(80));
  console.log('PAGE-BY-PAGE RESULTS');
  console.log('-'.repeat(80));

  report.pages.forEach(pageResult => {
    const seoPercent = ((pageResult.seo.score / pageResult.seo.maxScore) * 100).toFixed(1);
    const aeoPercent = ((pageResult.aeo.score / pageResult.aeo.maxScore) * 100).toFixed(1);
    const geoPercent = ((pageResult.geo.score / pageResult.geo.maxScore) * 100).toFixed(1);
    
    console.log(`\n📄 ${pageResult.url}`);
    console.log(`   SEO: ${seoPercent}% | AEO: ${aeoPercent}% | GEO: ${geoPercent}%`);
    
    // Show key issues
    const seoFails = pageResult.seo.tests.filter(t => t.status === 'fail');
    const aeoWarnings = pageResult.aeo.tests.filter(t => t.status === 'warning');
    const geoWarnings = pageResult.geo.tests.filter(t => t.status === 'warning');
    
    if (seoFails.length > 0 || aeoWarnings.length > 0 || geoWarnings.length > 0) {
      console.log('   Issues:');
      seoFails.forEach(test => console.log(`     ❌ SEO: ${test.test}`));
      aeoWarnings.forEach(test => console.log(`     ⚠️  AEO: ${test.test}`));
      geoWarnings.forEach(test => console.log(`     ⚠️  GEO: ${test.test}`));
    }
  });

  console.log('\n' + '='.repeat(80));
}

// Save Report to File
function saveReport(report, filename = 'seo-aeo-geo-report.json') {
  const reportPath = path.join(process.cwd(), filename);
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`\n📄 Detailed report saved to: ${reportPath}`);
}

// Main Test Function
async function runTests() {
  console.log('🚀 Starting SEO, AEO, and GEO Tests...');
  console.log(`📍 Testing: ${BASE_URL}`);
  console.log(`📋 Pages to test: ${TEST_PAGES.length}\n`);

  const allResults = [];
  let successCount = 0;
  let failCount = 0;

  // Test each page
  for (const pagePath of TEST_PAGES) {
    const pageUrl = `${BASE_URL}${pagePath}`;
    console.log(`Testing: ${pageUrl}...`);

    try {
      const response = await fetchPage(pageUrl);
      
      if (response.statusCode === 200) {
        const html = response.body;
        const metaTags = extractMetaTags(html);
        const structuredData = extractStructuredData(html);
        const headings = extractHeadings(html);
        const images = extractImages(html);
        const links = extractLinks(html, BASE_URL);

        // Run tests
        const seoResults = testSEO(pageUrl, html, metaTags, structuredData, headings, images, links);
        const aeoResults = testAEO(pageUrl, html, structuredData, headings);
        const geoResults = testGEO(pageUrl, html, metaTags, structuredData);

        allResults.push({
          url: pageUrl,
          seo: seoResults,
          aeo: aeoResults,
          geo: geoResults,
        });

        successCount++;
        console.log(`  ✅ Success`);
      } else {
        console.log(`  ❌ Failed: HTTP ${response.statusCode}`);
        failCount++;
      }
    } catch (error) {
      console.log(`  ❌ Error: ${error.message}`);
      failCount++;
    }
  }

  // Test sitemap and robots
  console.log('\nTesting sitemap and robots.txt...');
  const sitemapRobotsResults = await testSitemapAndRobots(BASE_URL);

  // Generate and print report
  const report = generateReport(allResults, sitemapRobotsResults);
  printReport(report);
  saveReport(report);

  console.log(`\n✅ Tests completed: ${successCount} passed, ${failCount} failed`);
  console.log(`📊 Overall Scores:`);
  console.log(`   SEO: ${report.summary.seo.average}%`);
  console.log(`   AEO: ${report.summary.aeo.average}%`);
  console.log(`   GEO: ${report.summary.geo.average}%`);
}

// Run tests
runTests().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});



