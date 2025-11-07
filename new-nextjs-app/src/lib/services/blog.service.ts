// Blog service for fetching blog posts from API

export interface BlogPost {
  _id?: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  featuredImage?: string | { url?: string; publicId?: string; caption?: string };
  author?: string | { _id?: string; name?: string; email?: string; avatar?: string };
  authorName?: string;
  publishedAt: string;
  updatedAt?: string;
  tags?: string[];
  category?: string;
  readingTime?: number;
  isPublished?: boolean;
  isFeatured?: boolean;
  views?: number;
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
  socialImage?: string | { url?: string; publicId?: string };
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:5000';

// Helper function to get image URL
const getImageUrl = (image: string | { url?: string } | undefined): string | undefined => {
  if (!image) return undefined;
  if (typeof image === 'string') return image;
  return image.url;
};

// Helper function to get author name
const getAuthorName = (author: string | { name?: string } | undefined): string => {
  if (!author) return 'Squarefooot Team';
  if (typeof author === 'string') return author;
  return author.name || 'Squarefooot Team';
};

// Get all blog posts
export async function getAllBlogPosts(): Promise<BlogPost[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/blogs?limit=100&sort=-publishedAt`, {
      next: { revalidate: 3600 }, // Revalidate every hour
    });
    
    if (!response.ok) {
      console.error('Failed to fetch blogs:', response.statusText);
      return [];
    }
    
    const result = await response.json();
    if (result.success && result.data) {
      return result.data.map((post: any) => ({
        ...post,
        featuredImage: getImageUrl(post.featuredImage),
        author: getAuthorName(post.author),
        authorName: getAuthorName(post.author),
      }));
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    // Fallback to sample data if API fails
    return [];
  }
}

// Get a single blog post by slug or ID
export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/blogs/${slug}`, {
      next: { revalidate: 3600 }, // Revalidate every hour
    });
    
    if (!response.ok) {
      return null;
    }
    
    const result = await response.json();
    if (result.success && result.data) {
      const post = result.data;
      return {
        ...post,
        featuredImage: getImageUrl(post.featuredImage),
        author: getAuthorName(post.author),
        authorName: getAuthorName(post.author),
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return null;
  }
}

// Get blog posts by category
export async function getBlogPostsByCategory(category: string): Promise<BlogPost[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/blogs?category=${category}&limit=100`, {
      next: { revalidate: 3600 },
    });
    
    if (!response.ok) {
      return [];
    }
    
    const result = await response.json();
    if (result.success && result.data) {
      return result.data.map((post: any) => ({
        ...post,
        featuredImage: getImageUrl(post.featuredImage),
        author: getAuthorName(post.author),
        authorName: getAuthorName(post.author),
      }));
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching blog posts by category:', error);
    return [];
  }
}

// Get blog posts by tag
export async function getBlogPostsByTag(tag: string): Promise<BlogPost[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/blogs?tag=${tag}&limit=100`, {
      next: { revalidate: 3600 },
    });
    
    if (!response.ok) {
      return [];
    }
    
    const result = await response.json();
    if (result.success && result.data) {
      return result.data.map((post: any) => ({
        ...post,
        featuredImage: getImageUrl(post.featuredImage),
        author: getAuthorName(post.author),
        authorName: getAuthorName(post.author),
      }));
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching blog posts by tag:', error);
    return [];
  }
}

// Get recent blog posts
export async function getRecentBlogPosts(limit: number = 5): Promise<BlogPost[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/blogs?limit=${limit}&sort=-publishedAt`, {
      next: { revalidate: 3600 },
    });
    
    if (!response.ok) {
      return [];
    }
    
    const result = await response.json();
    if (result.success && result.data) {
      return result.data.map((post: any) => ({
        ...post,
        featuredImage: getImageUrl(post.featuredImage),
        author: getAuthorName(post.author),
        authorName: getAuthorName(post.author),
      }));
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching recent blog posts:', error);
    return [];
  }
}

// Sample blog posts - Fallback data (removed for production)
const sampleBlogPosts: BlogPost[] = [
  {
    slug: 'first-time-home-buyer-guide-2024',
    title: 'First-Time Home Buyer Guide 2024: Everything You Need to Know',
    excerpt: 'Complete guide for first-time home buyers covering financing, inspections, negotiations, and closing. Expert tips to make your home buying journey smooth and successful.',
    content: `
# First-Time Home Buyer Guide 2024: Everything You Need to Know

Buying your first home is one of the most exciting and significant milestones in life. However, the process can seem overwhelming with all the steps, paperwork, and decisions involved. This comprehensive guide will walk you through everything you need to know as a first-time home buyer in 2024.

## Understanding Your Budget

Before you start house hunting, it's crucial to understand your financial situation. Here's what you need to consider:

### 1. Calculate Your Down Payment
- Traditional loans typically require 20% down payment
- FHA loans may require as little as 3.5% down
- VA loans offer zero down payment for eligible veterans
- Consider closing costs (typically 2-5% of home price)

### 2. Get Pre-Approved for a Mortgage
Getting pre-approved gives you:
- A clear budget range
- Stronger negotiating power
- Faster closing process
- Better understanding of interest rates

### 3. Factor in Additional Costs
- Property taxes
- Homeowners insurance
- HOA fees (if applicable)
- Maintenance and repairs
- Utilities

## Finding the Right Home

### Location Considerations
- School districts
- Commute times
- Neighborhood safety
- Future development plans
- Property value trends

### Home Features
- Number of bedrooms and bathrooms
- Square footage
- Yard size
- Storage space
- Energy efficiency

## The Home Buying Process

### Step 1: Hire a Real Estate Agent
A good agent will:
- Help you find suitable properties
- Negotiate on your behalf
- Guide you through paperwork
- Connect you with trusted professionals

### Step 2: Make an Offer
When you find the right home:
- Research comparable sales
- Consider market conditions
- Include contingencies (inspection, financing, appraisal)
- Be prepared to negotiate

### Step 3: Home Inspection
Always get a professional inspection to:
- Identify potential issues
- Negotiate repairs or price adjustments
- Avoid costly surprises after purchase

### Step 4: Secure Financing
- Finalize your mortgage application
- Provide required documentation
- Lock in your interest rate
- Complete the underwriting process

### Step 5: Closing
- Review all documents carefully
- Bring required funds (certified check or wire transfer)
- Sign all paperwork
- Receive keys to your new home!

## First-Time Buyer Programs

Many programs can help first-time buyers:
- Down payment assistance programs
- First-time buyer tax credits
- State and local grants
- Employer assistance programs

## Common Mistakes to Avoid

1. **Skipping pre-approval** - Know your budget before shopping
2. **Not getting inspections** - Always inspect before buying
3. **Ignoring additional costs** - Budget for all expenses
4. **Emotional decisions** - Stay objective and practical
5. **Skipping the fine print** - Read all documents carefully

## Conclusion

Buying your first home is a journey that requires preparation, patience, and the right guidance. By following this guide and working with experienced professionals, you can navigate the process successfully and find the perfect home for your needs.

Remember, every home buying journey is unique. Take your time, ask questions, and don't hesitate to seek professional advice when needed.
    `,
    featuredImage: '/building_1.jpg',
    author: 'Squarefooot Team',
    publishedAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-20T10:00:00Z',
    tags: ['First-Time Buyers', 'Home Buying', 'Real Estate Guide', 'Mortgage', 'Financing'],
    category: 'Buying Guide',
    readingTime: 8,
  },
  {
    slug: 'real-estate-investment-strategies',
    title: 'Top 5 Real Estate Investment Strategies for 2024',
    excerpt: 'Discover proven real estate investment strategies including rental properties, house flipping, REITs, and more. Learn which approach fits your financial goals and risk tolerance.',
    content: `
# Top 5 Real Estate Investment Strategies for 2024

Real estate investment remains one of the most reliable ways to build wealth. Whether you're a beginner or experienced investor, understanding different investment strategies is crucial for success. Here are the top 5 real estate investment strategies for 2024.

## 1. Rental Properties

Rental properties offer steady passive income and long-term appreciation.

### Advantages:
- Monthly rental income
- Property value appreciation
- Tax benefits (depreciation, deductions)
- Control over investment

### Considerations:
- Property management responsibilities
- Maintenance costs
- Tenant management
- Market vacancy rates

### Best For:
- Investors seeking passive income
- Long-term wealth building
- Those comfortable with property management

## 2. House Flipping

Buy, renovate, and sell properties for profit.

### Advantages:
- Quick returns
- High profit potential
- Creative control
- Flexible timeline

### Considerations:
- Requires renovation expertise
- Market timing is critical
- Higher risk
- Capital intensive

### Best For:
- Experienced investors
- Those with renovation skills
- Risk-tolerant individuals

## 3. Real Estate Investment Trusts (REITs)

Invest in real estate without owning physical property.

### Advantages:
- Liquidity
- Diversification
- Professional management
- Lower entry barrier

### Considerations:
- Market volatility
- Less control
- Management fees
- Tax implications

### Best For:
- Passive investors
- Portfolio diversification
- Lower capital requirements

## 4. Real Estate Crowdfunding

Pool money with other investors for larger projects.

### Advantages:
- Access to larger deals
- Diversification
- Lower minimum investment
- Professional management

### Considerations:
- Limited liquidity
- Platform risk
- Less control
- Due diligence required

### Best For:
- Diversified portfolios
- Access to commercial properties
- Passive investment approach

## 5. Real Estate Development

Build new properties from the ground up.

### Advantages:
- Maximum control
- High profit potential
- Creative opportunities
- Market creation

### Considerations:
- High capital requirements
- Long timelines
- Regulatory complexity
- Significant risk

### Best For:
- Experienced developers
- Large capital availability
- Risk-tolerant investors

## Choosing the Right Strategy

Consider these factors:
- **Capital**: How much can you invest?
- **Time**: Active or passive involvement?
- **Risk Tolerance**: Conservative or aggressive?
- **Expertise**: What skills do you have?
- **Goals**: Income, appreciation, or both?

## Market Trends for 2024

- Rising interest rates affecting affordability
- Strong rental demand in suburban areas
- Technology integration in property management
- Sustainability and green building focus
- Shift toward secondary markets

## Getting Started

1. **Educate Yourself**: Learn about your chosen strategy
2. **Build a Team**: Connect with agents, contractors, and advisors
3. **Start Small**: Begin with manageable investments
4. **Network**: Join real estate investment groups
5. **Stay Informed**: Follow market trends and news

## Conclusion

Real estate investment offers multiple pathways to wealth building. The key is choosing a strategy that aligns with your financial situation, risk tolerance, and long-term goals. Whether you prefer hands-on management or passive investing, there's a real estate strategy that can work for you.

Remember, successful real estate investing requires research, planning, and sometimes patience. Start with what you know, learn continuously, and consider working with experienced professionals to maximize your success.
    `,
    featuredImage: '/building_2.jpg',
    author: 'Squarefooot Team',
    publishedAt: '2024-02-01T10:00:00Z',
    updatedAt: '2024-02-05T10:00:00Z',
    tags: ['Investment', 'Real Estate Investing', 'Wealth Building', 'Rental Properties', 'REITs'],
    category: 'Investment',
    readingTime: 10,
  },
  {
    slug: 'home-staging-tips-sell-faster',
    title: '10 Home Staging Tips to Sell Your Property Faster',
    excerpt: 'Learn professional home staging techniques that help properties sell faster and for higher prices. Simple, cost-effective tips to make your home irresistible to buyers.',
    content: `
# 10 Home Staging Tips to Sell Your Property Faster

Home staging is one of the most effective ways to make your property stand out in the market. A well-staged home not only sells faster but often commands a higher price. Here are 10 proven staging tips to help you sell your property quickly.

## 1. Declutter and Depersonalize

Remove personal items and excess belongings to help buyers envision themselves in the space.

### What to Remove:
- Family photos
- Personal collections
- Excess furniture
- Cluttered countertops
- Unnecessary decorations

### Why It Works:
- Creates a clean, spacious feel
- Allows buyers to imagine their own belongings
- Makes rooms appear larger
- Reduces distractions

## 2. Deep Clean Everything

A spotless home makes a powerful first impression.

### Focus Areas:
- Windows and mirrors
- Floors and carpets
- Kitchen and bathrooms
- Baseboards and corners
- Light fixtures

### Professional Touch:
Consider hiring professional cleaners for a thorough deep clean that you might miss.

## 3. Maximize Natural Light

Bright, well-lit spaces feel welcoming and spacious.

### Tips:
- Open all curtains and blinds
- Clean windows inside and out
- Replace heavy drapes with lighter options
- Add mirrors to reflect light
- Use higher wattage bulbs (if needed)

## 4. Neutral Color Palette

Neutral colors appeal to the widest range of buyers.

### Best Colors:
- Soft whites
- Light grays
- Beige and taupe
- Warm creams

### Quick Updates:
- Repaint bold walls
- Replace colorful accessories
- Use neutral throw pillows and rugs

## 5. Create a Focal Point in Each Room

Every room should have one clear focal point that draws attention.

### Examples:
- Living room: Fireplace or large window
- Bedroom: Bed with attractive bedding
- Kitchen: Island or backsplash
- Dining room: Table setting

## 6. Furniture Arrangement

Arrange furniture to maximize space and flow.

### Principles:
- Create conversation areas
- Leave clear pathways
- Use appropriately sized furniture
- Remove excess pieces
- Consider renting furniture if needed

## 7. Curb Appeal Matters

First impressions start before buyers enter your home.

### Exterior Updates:
- Fresh paint on front door
- Well-maintained landscaping
- Clean walkways and driveways
- Updated house numbers
- Welcoming entryway

## 8. Stage Key Rooms

Focus your staging efforts on the most important rooms.

### Priority Rooms:
1. Living room
2. Master bedroom
3. Kitchen
4. Bathroom
5. Entryway

### Quick Wins:
- Make beds with fresh linens
- Set dining table
- Add fresh flowers
- Display attractive books
- Create inviting spaces

## 9. Address Repairs and Updates

Fix obvious issues that could turn buyers away.

### Common Fixes:
- Leaky faucets
- Squeaky doors
- Loose handles
- Peeling paint
- Broken fixtures

### Small Updates:
- New cabinet hardware
- Updated light fixtures
- Fresh caulking
- New switch plates

## 10. Add Finishing Touches

Small details make a big difference.

### Final Touches:
- Fresh flowers or plants
- New towels in bathrooms
- Attractive throw pillows
- Cozy throws on furniture
- Pleasant scents (subtle, not overwhelming)
- Soft background music during showings

## Staging on a Budget

You don't need to spend a fortune on staging:

- Rearrange existing furniture
- Borrow items from friends
- Shop thrift stores for accessories
- Use what you have creatively
- Focus on high-impact areas

## Professional Staging vs. DIY

### Consider Professional Staging If:
- You're selling a high-value property
- You've struggled to sell
- You're relocating and can't DIY
- You want maximum impact

### DIY Staging Works If:
- You have a good eye for design
- You're on a tight budget
- You have time to invest
- You can be objective about your space

## Virtual Staging Option

For vacant properties, consider virtual staging:
- Cost-effective alternative
- Shows potential of empty spaces
- Easy to update
- Appeals to online buyers

## Conclusion

Effective home staging transforms your property from just another listing into a desirable home that buyers can envision themselves living in. By following these tips and focusing on creating a welcoming, neutral, and well-maintained space, you'll significantly increase your chances of a quick sale at a great price.

Remember, the goal is to help buyers see the potential and feel at home. Even small staging improvements can make a big difference in how your property is perceived and how quickly it sells.
    `,
    featuredImage: '/building_3.jpg',
    author: 'Squarefooot Team',
    publishedAt: '2024-02-15T10:00:00Z',
    updatedAt: '2024-02-18T10:00:00Z',
    tags: ['Home Staging', 'Selling Tips', 'Real Estate', 'Home Improvement', 'Property Sale'],
    category: 'Selling Guide',
    readingTime: 7,
  },
  {
    slug: 'understanding-mortgage-rates-2024',
    title: 'Understanding Mortgage Rates in 2024: A Complete Guide',
    excerpt: 'Everything you need to know about mortgage rates in 2024. Learn how rates are determined, when to lock in, and strategies to get the best rate for your home loan.',
    content: `
# Understanding Mortgage Rates in 2024: A Complete Guide

Mortgage rates are one of the most critical factors in your home buying decision. Understanding how they work, what influences them, and how to secure the best rate can save you thousands of dollars over the life of your loan. Here's your complete guide to mortgage rates in 2024.

## What Are Mortgage Rates?

Mortgage rates are the interest rates charged on home loans. They determine how much you'll pay in interest over the life of your mortgage, significantly impacting your monthly payments and total loan cost.

## How Mortgage Rates Are Determined

Several factors influence mortgage rates:

### 1. Federal Reserve Policy
- The Fed's interest rate decisions affect mortgage rates
- Rate increases typically lead to higher mortgage rates
- Rate decreases can lower mortgage rates

### 2. Economic Conditions
- Inflation rates
- Employment data
- GDP growth
- Economic uncertainty

### 3. Bond Market
- 10-year Treasury yields closely correlate with mortgage rates
- Investor demand for bonds affects rates
- Market volatility impacts rates

### 4. Your Personal Factors
- Credit score
- Down payment amount
- Loan type and term
- Debt-to-income ratio

## Current Mortgage Rate Trends (2024)

### Factors Affecting 2024 Rates:
- Federal Reserve policy changes
- Inflation concerns
- Economic recovery patterns
- Housing market conditions
- Global economic factors

### Rate Expectations:
- Rates may remain elevated compared to 2020-2021
- Gradual adjustments expected
- Regional variations possible
- Loan type differences

## Types of Mortgage Rates

### Fixed-Rate Mortgages
- Rate stays constant for entire loan term
- Predictable monthly payments
- Protection from rate increases
- Typically higher initial rates

### Adjustable-Rate Mortgages (ARMs)
- Rate adjusts periodically
- Lower initial rates
- Potential for rate increases
- More complex structure

## How to Get the Best Mortgage Rate

### 1. Improve Your Credit Score
- Pay bills on time
- Reduce debt
- Don't open new credit accounts
- Check credit reports for errors
- Aim for 740+ for best rates

### 2. Increase Your Down Payment
- Larger down payments = better rates
- 20% down eliminates PMI
- Shows financial stability
- Reduces lender risk

### 3. Shop Around
- Compare rates from multiple lenders
- Get quotes within same time period
- Consider different loan types
- Negotiate terms

### 4. Consider Points
- Pay points to lower rate
- Calculate break-even point
- Consider how long you'll own home
- Factor into total cost

### 5. Choose the Right Loan Term
- 15-year vs. 30-year rates
- Shorter terms = lower rates
- Higher monthly payments
- Less total interest paid

## When to Lock Your Rate

### Rate Lock Timing:
- Lock when you're ready to close
- Consider lock period length
- Understand lock fees
- Monitor rate trends

### Lock Periods:
- 30-day locks (most common)
- 45-day locks
- 60-day locks (higher cost)
- Extended locks available

## Rate Lock Strategies

### 1. Float Strategy
- Wait to lock rate
- Monitor market trends
- Lock when rates drop
- Risk of rates rising

### 2. Lock Immediately
- Secure current rate
- Protection from increases
- Peace of mind
- Miss potential decreases

### 3. Float-Down Option
- Lock with float-down
- Can lower if rates drop
- Additional cost
- Best of both worlds

## Refinancing Considerations

### When to Refinance:
- Rates drop significantly
- Credit score improved
- Want to change loan terms
- Need cash-out option

### Refinancing Costs:
- Closing costs
- Appraisal fees
- Break-even calculation
- Time in home matters

## Impact of Rate Changes

### On Monthly Payment:
A 1% rate change on a $300,000 loan:
- 30-year: ~$180/month difference
- 15-year: ~$150/month difference

### On Total Interest:
Over 30 years, 1% difference can mean:
- $50,000+ in additional interest
- Significant long-term savings
- Worth shopping for best rate

## 2024 Rate Predictions

### Factors to Watch:
- Federal Reserve meetings
- Inflation data
- Employment reports
- Economic indicators
- Global events

### Expert Opinions:
- Rates may stabilize
- Gradual adjustments expected
- Regional variations
- Market-dependent

## Tips for Home Buyers

1. **Get Pre-Approved Early**: Lock in rate protection
2. **Monitor Rates**: Track trends before buying
3. **Improve Credit**: Work on score before applying
4. **Save for Down Payment**: Larger down = better rate
5. **Compare Lenders**: Don't accept first offer
6. **Understand Terms**: Know what you're signing
7. **Consider Timing**: Market conditions matter

## Conclusion

Understanding mortgage rates is essential for making informed home buying decisions. While you can't control market rates, you can control your credit score, down payment, and lender choice. By improving your financial profile, shopping around, and understanding rate lock strategies, you can secure the best possible rate for your situation.

Remember, even a small difference in rate can save you thousands over the life of your loan. Take the time to understand your options, improve your financial standing, and work with reputable lenders to get the best deal possible.
    `,
    featuredImage: '/building_4.jpg',
    author: 'Squarefooot Team',
    publishedAt: '2024-03-01T10:00:00Z',
    updatedAt: '2024-03-05T10:00:00Z',
    tags: ['Mortgage', 'Financing', 'Home Buying', 'Real Estate', 'Interest Rates'],
    category: 'Financing',
    readingTime: 9,
  },
];

// Get all blog posts
export async function getAllBlogPosts(): Promise<BlogPost[]> {
  // In production, this would fetch from an API or database
  // For now, return sample data
  return sampleBlogPosts;
}

// Get a single blog post by slug
export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  // In production, this would fetch from an API or database
  const posts = await getAllBlogPosts();
  return posts.find(post => post.slug === slug) || null;
}

// Get blog posts by category
export async function getBlogPostsByCategory(category: string): Promise<BlogPost[]> {
  const posts = await getAllBlogPosts();
  return posts.filter(post => post.category === category);
}

// Get blog posts by tag
export async function getBlogPostsByTag(tag: string): Promise<BlogPost[]> {
  const posts = await getAllBlogPosts();
  return posts.filter(post => post.tags?.includes(tag));
}

// Get recent blog posts
export async function getRecentBlogPosts(limit: number = 5): Promise<BlogPost[]> {
  const posts = await getAllBlogPosts();
  return posts
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, limit);
}

