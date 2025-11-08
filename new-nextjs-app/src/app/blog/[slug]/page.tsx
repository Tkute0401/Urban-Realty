import React from "react";
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import BlogPostClient from "@/components/blog/BlogPostClient";
import { getApiBaseUrl } from '@/lib/services/api.config';

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
    const apiUrl = getApiBaseUrl();
    const response = await fetch(`${apiUrl}/api/v1/blogs/${slug}`, {
      next: { revalidate: 3600 }, // Revalidate every hour
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    
    if (data.success && data.data) {
      return data.data;
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return null;
  }
}

// Generate dynamic metadata for blog post
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const blog = await getBlogPost(params.slug);

  if (!blog) {
    return {
      title: 'Blog Post Not Found | Squarefooot',
      description: 'The blog post you are looking for could not be found.',
    };
  }

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
  const blog = await getBlogPost(params.slug);

  if (!blog) {
    notFound();
  }

  const structuredData = generateBlogPostStructuredData(blog);

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
}

