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

