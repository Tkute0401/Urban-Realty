import React from "react";
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import BlogPostClient from "@/components/blog/BlogPostClient";
import { getApiBaseUrl } from '@/lib/services/api.config';

// Force dynamic rendering - don't statically generate this page
export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage?: string;
  author?: {
    name: string;
    avatar?: string;
  };
  category?: string;
  tags?: string[];
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
  seoTitle?: string;
  seoDescription?: string;
  metaKeywords?: string[];
}

async function getBlogPost(slug: string): Promise<BlogPost | null> {
  try {
    const isServer = typeof window === 'undefined';
    
    // For SSR in production, try localhost first, fallback to public URL
    // For client-side, use the public API URL
    let apiUrl: string;
    if (isServer) {
      // Server-side: try localhost first (works when Next.js and Express are in same process)
      // Fallback to public URL if localhost doesn't work
      const port = process.env.PORT || '5000';
      const localhostUrl = `http://localhost:${port}`;
      const publicUrl = process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXT_PUBLIC_API_URL || 'https://www.squarefooot.com';
      
      // In production on Railway, try localhost first, but have a fallback
      apiUrl = process.env.NODE_ENV === 'production' 
        ? localhostUrl  // Try localhost first in production (same process)
        : localhostUrl;
    } else {
      // Client-side: use the public API URL
      apiUrl = getApiBaseUrl();
    }
    
    const fetchUrl = `${apiUrl}/api/v1/blogs/${slug}`;
    
    // Log the fetch attempt (this will appear in server logs during SSR)
    console.log(`[getBlogPost] ${isServer ? 'SSR' : 'Client'} - Fetching blog post: ${slug}`);
    console.log(`[getBlogPost] Fetch URL: ${fetchUrl}`);
    console.log(`[getBlogPost] API Base URL: ${apiUrl}`);
    
    const response = await fetch(fetchUrl, {
      cache: 'no-store', // Always fetch fresh data for dynamic pages
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      // Add timeout for production
      signal: AbortSignal.timeout(10000), // 10 second timeout
    });
    
    console.log(`[getBlogPost] Response status: ${response.status} for slug: ${slug}`);

    if (!response.ok) {
      // Log the error for debugging
      if (response.status === 404) {
        console.warn(`[getBlogPost] Blog post not found: ${slug} (status: ${response.status}, url: ${fetchUrl})`);
      } else {
        console.error(`[getBlogPost] Blog post fetch failed: ${slug} (status: ${response.status}, url: ${fetchUrl})`);
        const errorText = await response.text().catch(() => 'Unable to read error response');
        console.error(`[getBlogPost] Error response body: ${errorText}`);
      }
      return null;
    }

    const data = await response.json();
    console.log(`[getBlogPost] Response data for ${slug}:`, { success: data.success, hasData: !!data.data });
    
    if (data.success && data.data) {
      console.log(`[getBlogPost] Successfully fetched blog post: ${data.data.title}`);
      return data.data;
    }
    
    console.warn(`[getBlogPost] Blog post data format invalid: ${slug}`, data);
    return null;
  } catch (error) {
    // Handle network errors gracefully
    console.error(`[getBlogPost] Exception fetching blog post ${slug}:`, error);
    if (error instanceof Error) {
      console.error(`[getBlogPost] Error message: ${error.message}`);
      console.error(`[getBlogPost] Error stack: ${error.stack}`);
    }
    return null;
  }
}

// Generate dynamic metadata for blog post
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  console.log(`[generateMetadata] Generating metadata for slug: ${params.slug}`);
  const blog = await getBlogPost(params.slug);

  if (!blog) {
    console.log(`[generateMetadata] Blog not found for slug: ${params.slug}, returning not found metadata`);
    return {
      title: 'Blog Post Not Found | Squarefooot',
      description: 'The blog post you are looking for could not be found.',
    };
  }
  
  console.log(`[generateMetadata] Blog found for slug: ${params.slug}, title: ${blog.title}`);

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://squarefooot.com';
  const title = blog.seoTitle || blog.title;
  const description = blog.seoDescription || blog.excerpt || blog.content?.substring(0, 160);
  const keywords = blog.metaKeywords || blog.tags || [];

  return {
    title: `${title} | Squarefooot Blog`,
    description,
    keywords: [
      ...keywords,
      'real estate',
      'property',
      'real estate blog',
      'property advice',
    ],
    authors: blog.author ? [{ name: blog.author.name }] : undefined,
    openGraph: {
      title: `${title} | Squarefooot Blog`,
      description,
      type: 'article',
      publishedTime: blog.publishedAt || blog.createdAt,
      modifiedTime: blog.updatedAt,
      authors: blog.author ? [blog.author.name] : undefined,
      tags: blog.tags,
      images: blog.featuredImage
        ? [
            {
              url: blog.featuredImage,
              width: 1200,
              height: 630,
              alt: blog.title,
            },
          ]
        : [
            {
              url: '/blog-og-image.jpg',
              width: 1200,
              height: 630,
              alt: blog.title,
            },
          ],
      url: `${baseUrl}/blog/${blog.slug}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | Squarefooot Blog`,
      description,
      images: blog.featuredImage ? [blog.featuredImage] : ['/blog-og-image.jpg'],
    },
    alternates: {
      canonical: `/blog/${blog.slug}`,
    },
  };
}

// Generate structured data for blog post
function generateBlogPostStructuredData(blog: BlogPost) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://squarefooot.com';
  
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": blog.title,
    "description": blog.excerpt || blog.content?.substring(0, 200),
    "image": blog.featuredImage || `${baseUrl}/blog-og-image.jpg`,
    "datePublished": blog.publishedAt || blog.createdAt,
    "dateModified": blog.updatedAt,
    "author": {
      "@type": "Person",
      "name": blog.author?.name || "Squarefooot Team"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Squarefooot",
      "url": baseUrl,
      "logo": {
        "@type": "ImageObject",
        "url": `${baseUrl}/vite.png`
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${baseUrl}/blog/${blog.slug}`
    },
    "articleSection": blog.category || "Real Estate",
    "keywords": blog.tags?.join(", ") || "real estate, property"
  };
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  // Add comprehensive logging to track when the page component is called
  console.log(`[BlogPostPage] ========== START RENDERING ==========`);
  console.log(`[BlogPostPage] Rendering page for slug: ${params.slug}`);
  console.log(`[BlogPostPage] Is server: ${typeof window === 'undefined'}`);
  console.log(`[BlogPostPage] NEXT_PUBLIC_BASE_URL: ${process.env.NEXT_PUBLIC_BASE_URL}`);
  console.log(`[BlogPostPage] NODE_ENV: ${process.env.NODE_ENV}`);
  
  try {
    const blog = await getBlogPost(params.slug);
    console.log(`[BlogPostPage] getBlogPost returned:`, blog ? `Found: ${blog.title}` : 'null');

    if (!blog) {
      console.log(`[BlogPostPage] Blog post not found for slug: ${params.slug}, calling notFound()`);
      notFound();
    }

    console.log(`[BlogPostPage] Blog post found: ${blog.title} (${blog.slug})`);
    console.log(`[BlogPostPage] Blog published: ${blog.publishedAt ? 'Yes' : 'No'}`);

    const structuredData = generateBlogPostStructuredData(blog);

    console.log(`[BlogPostPage] ========== RENDERING SUCCESS ==========`);
    return (
      <>
        {/* Structured Data for Blog Post */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData)
          }}
        />
        
        <BlogPostClient blog={blog} />
      </>
    );
  } catch (error) {
    console.error(`[BlogPostPage] ========== ERROR RENDERING ==========`);
    console.error(`[BlogPostPage] Error in BlogPostPage:`, error);
    if (error instanceof Error) {
      console.error(`[BlogPostPage] Error message: ${error.message}`);
      console.error(`[BlogPostPage] Error stack: ${error.stack}`);
    }
    throw error; // Re-throw to let Next.js handle it
  }
}

