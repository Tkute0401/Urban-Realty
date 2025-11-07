import React from "react";
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import BlogPostClient from "@/components/blog/BlogPostClient";
import { getBlogPost, getAllBlogPosts } from "@/lib/services/blog.service";

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

// Generate static params for all blog posts
export async function generateStaticParams() {
  try {
    const posts = await getAllBlogPosts();
    return posts.map((post) => ({
      slug: post.slug,
    }));
  } catch (error) {
    console.error('Error generating static params for blog posts:', error);
    return [];
  }
}

// Generate metadata for individual blog post
export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  try {
    const post = await getBlogPost(params.slug);
    
    if (!post) {
      return {
        title: 'Blog Post Not Found | Squarefooot',
        description: 'The requested blog post could not be found.',
      };
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://squarefooot.com';
    const imageUrl = post.featuredImage || '/blog-og-image.jpg';
    
    // Extract author name - use authorName if available, otherwise extract from author
    const authorName = post.authorName || 
      (typeof post.author === 'string' ? post.author : 
       (typeof post.author === 'object' && post.author?.name ? post.author.name : 'Squarefooot Team'));

    return {
      title: `${post.title} | Squarefooot Blog`,
      description: post.excerpt || post.content.substring(0, 160) + '...',
      keywords: post.tags || [],
      authors: [{ name: authorName }],
      openGraph: {
        title: post.title,
        description: post.excerpt || post.content.substring(0, 160) + '...',
        type: 'article',
        publishedTime: post.publishedAt,
        modifiedTime: post.updatedAt,
        authors: [authorName],
        tags: post.tags || [],
        images: [
          {
            url: imageUrl.startsWith('http') ? imageUrl : `${baseUrl}${imageUrl}`,
            width: 1200,
            height: 630,
            alt: post.title,
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: post.title,
        description: post.excerpt || post.content.substring(0, 160) + '...',
        images: [imageUrl.startsWith('http') ? imageUrl : `${baseUrl}${imageUrl}`],
      },
      alternates: {
        canonical: `/blog/${params.slug}`,
      },
    };
  } catch (error) {
    console.error('Error generating metadata for blog post:', error);
    return {
      title: 'Blog Post | Squarefooot',
      description: 'Read our latest real estate blog post.',
    };
  }
}

// Generate structured data for individual blog post
function generateBlogPostStructuredData(post: any) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://squarefooot.com';
  const imageUrl = post.featuredImage || '/blog-og-image.jpg';
  
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.excerpt || post.content.substring(0, 160) + '...',
    "image": imageUrl.startsWith('http') ? imageUrl : `${baseUrl}${imageUrl}`,
    "datePublished": post.publishedAt,
    "dateModified": post.updatedAt || post.publishedAt,
    "author": {
      "@type": "Person",
      "name": post.authorName || 
        (typeof post.author === 'string' ? post.author : 
         (typeof post.author === 'object' && post.author?.name ? post.author.name : "Squarefooot Team"))
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
      "@id": `${baseUrl}/blog/${post.slug}`
    },
    "keywords": post.tags?.join(', ') || '',
    "articleSection": post.category || "Real Estate"
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  try {
    const post = await getBlogPost(params.slug);
    
    if (!post) {
      notFound();
    }

    const structuredData = generateBlogPostStructuredData(post);
    
    return (
      <>
        {/* Structured Data for Blog Post */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData)
          }}
        />
        
        <BlogPostClient post={post} />
      </>
    );
  } catch (error) {
    console.error('Error loading blog post:', error);
    notFound();
  }
}

