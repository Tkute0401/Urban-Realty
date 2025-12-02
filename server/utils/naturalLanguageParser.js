/**
 * Natural Language Query Parser
 * Extracts structured filters from natural language search queries
 * Example: "2BHK apartment under 50L in Mumbai" -> { bedrooms: 2, type: 'Apartment', priceMax: 5000000, city: 'Mumbai' }
 */

/**
 * Parse natural language query to extract filters
 * @param {String} query - Natural language query
 * @returns {Object} Parsed filters
 */
function parseNaturalLanguageQuery(query) {
  if (!query || typeof query !== 'string') {
    return {};
  }

  const queryLower = query.toLowerCase().trim();
  const filters = {};

  // Extract bedrooms (2BHK, 2 BHK, 2 bedroom, 2BR, etc.)
  const bedroomPatterns = [
    /(\d+)\s*bhk/i,
    /(\d+)\s*bedroom/i,
    /(\d+)\s*bed/i,
    /(\d+)\s*br\b/i
  ];

  for (const pattern of bedroomPatterns) {
    const match = queryLower.match(pattern);
    if (match) {
      filters.bedrooms = parseInt(match[1]);
      break;
    }
  }

  // Extract property type
  const propertyTypes = {
    'apartment': 'Apartment',
    'flat': 'Apartment',
    'house': 'House',
    'villa': 'Villa',
    'condo': 'Condo',
    'townhouse': 'Townhouse',
    'studio': 'Studio',
    'penthouse': 'Penthouse',
    'builder floor': 'Builder Floor',
    'farm house': 'Farm House',
    'service apartment': 'Service Apartment',
    'pg': 'PG',
    'commercial': 'Commercial',
    'land': 'Land'
  };

  for (const [keyword, type] of Object.entries(propertyTypes)) {
    if (queryLower.includes(keyword)) {
      filters.propertyType = type;
      break;
    }
  }

  // Extract price (50L, 50 lakhs, 50Lakh, under 50L, below 50L, max 50L, etc.)
  const pricePatterns = [
    /(?:under|below|max|upto|less than|maximum)\s*(\d+(?:\.\d+)?)\s*(?:l|lak|lakh|lakhs)/i,
    /(\d+(?:\.\d+)?)\s*(?:l|lak|lakh|lakhs)\s*(?:under|below|max|upto|less than|maximum)/i,
    /(?:above|over|min|minimum|more than|at least)\s*(\d+(?:\.\d+)?)\s*(?:l|lak|lakh|lakhs)/i,
    /(\d+(?:\.\d+)?)\s*(?:l|lak|lakh|lakhs)\s*(?:above|over|min|minimum|more than|at least)/i,
    /(\d+(?:\.\d+)?)\s*(?:l|lak|lakh|lakhs)/i
  ];

  for (const pattern of pricePatterns) {
    const match = queryLower.match(pattern);
    if (match) {
      const amount = parseFloat(match[1]) * 100000; // Convert lakhs to actual amount
      
      if (pattern.source.includes('under') || pattern.source.includes('below') || 
          pattern.source.includes('max') || pattern.source.includes('upto') ||
          pattern.source.includes('less than') || pattern.source.includes('maximum')) {
        filters.priceMax = amount;
      } else if (pattern.source.includes('above') || pattern.source.includes('over') ||
                 pattern.source.includes('min') || pattern.source.includes('minimum') ||
                 pattern.source.includes('more than') || pattern.source.includes('at least')) {
        filters.priceMin = amount;
      } else {
        // If no qualifier, assume it's a maximum price
        filters.priceMax = amount;
      }
      break;
    }
  }

  // Extract price range (50L to 100L, between 50L and 100L, etc.)
  const rangePattern = /(\d+(?:\.\d+)?)\s*(?:l|lak|lakh|lakhs)\s*(?:to|and|-|between)\s*(\d+(?:\.\d+)?)\s*(?:l|lak|lakh|lakhs)/i;
  const rangeMatch = queryLower.match(rangePattern);
  if (rangeMatch) {
    filters.priceMin = parseFloat(rangeMatch[1]) * 100000;
    filters.priceMax = parseFloat(rangeMatch[2]) * 100000;
  }

  // Extract location (city names - common Indian cities)
  const cities = [
    'mumbai', 'delhi', 'bangalore', 'hyderabad', 'chennai', 'pune', 'kolkata',
    'gurgaon', 'noida', 'ahmedabad', 'jaipur', 'lucknow', 'kanpur', 'nagpur',
    'indore', 'thane', 'bhopal', 'visakhapatnam', 'patna', 'vadodara',
    'ghaziabad', 'ludhiana', 'agra', 'nashik', 'faridabad', 'meerut',
    'rajkot', 'varanasi', 'srinagar', 'amritsar', 'navi mumbai', 'allahabad',
    'howrah', 'ranchi', 'gwalior', 'jabalpur', 'coimbatore', 'vijayawada',
    'jodhpur', 'madurai', 'raipur', 'kota', 'guwahati', 'chandigarh',
    'solapur', 'hubli', 'bareilly', 'moradabad', 'mysore', 'gurugram',
    'aligarh', 'jalandhar', 'tiruchirappalli', 'bhubaneswar', 'salem',
    'mira-bhayandar', 'thiruvananthapuram', 'bhiwandi', 'saharanpur',
    'amravati', 'noida', 'firozabad', 'ichalkaranji', 'vasai-virar',
    'bikaner', 'warangal', 'ratlam', 'sangli', 'latur', 'hajipur',
    'ujjain', 'suryapet', 'miryalaguda', 'tadepalligudem', 'rajahmundry',
    'bandra', 'andheri', 'powai', 'kurla', 'borivali', 'kandivali',
    'malad', 'goregaon', 'juhu', 'versova', 'lokhandwala', 'chembur',
    'vikhroli', 'bhandup', 'mulund', 'thane', 'kalyan', 'dombivli',
    'navi mumbai', 'panvel', 'nerul', 'vashi', 'airoli', 'koparkhairane'
  ];

  for (const city of cities) {
    if (queryLower.includes(city)) {
      // Capitalize first letter of each word
      filters.city = city.split(' ').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ');
      break;
    }
  }

  // Extract state names
  const states = [
    'maharashtra', 'delhi', 'karnataka', 'telangana', 'tamil nadu', 'gujarat',
    'rajasthan', 'uttar pradesh', 'west bengal', 'bihar', 'madhya pradesh',
    'andhra pradesh', 'punjab', 'haryana', 'odisha', 'assam', 'jammu and kashmir',
    'kerala', 'jharkhand', 'chhattisgarh', 'uttarakhand', 'himachal pradesh',
    'tripura', 'meghalaya', 'manipur', 'nagaland', 'goa', 'arunachal pradesh',
    'mizoram', 'sikkim'
  ];

  for (const state of states) {
    if (queryLower.includes(state)) {
      filters.state = state.split(' ').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ');
      break;
    }
  }

  return filters;
}

/**
 * Check if query appears to be natural language (vs simple keyword search)
 * @param {String} query - Search query
 * @returns {Boolean} True if appears to be natural language
 */
function isNaturalLanguageQuery(query) {
  if (!query || typeof query !== 'string') {
    return false;
  }

  const queryLower = query.toLowerCase();
  
  // Natural language indicators
  const indicators = [
    /\d+\s*(?:bhk|bedroom|bed|br)\b/i,
    /\d+\s*(?:l|lak|lakh|lakhs)/i,
    /(?:under|below|above|over|between|to|and|max|min|upto)/i,
    /(?:in|at|near|close to)\s+[a-z]+/i
  ];

  return indicators.some(pattern => pattern.test(queryLower));
}

module.exports = {
  parseNaturalLanguageQuery,
  isNaturalLanguageQuery
};

