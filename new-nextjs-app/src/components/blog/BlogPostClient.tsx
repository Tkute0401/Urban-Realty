'use client';

import React from 'react';
import { Box, Container, Typography, Chip, Avatar, Breadcrumbs, Link as MuiLink } from '@mui/material';
import { CalendarToday, Person, Home, ArrowBack } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import ReactMarkdown from 'react-markdown';

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

interface BlogPostClientProps {
  blog: BlogPost;
}

const BlogPostClient: React.FC<BlogPostClientProps> = ({ blog }) => {
  const router = useRouter();

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMMM dd, yyyy');
    } catch {
      return dateString;
    }
  };

  return (
    <Box
      component="main"
      sx={{
        minHeight: '100vh',
        background: 'var(--color-bg)',
        py: { xs: 4, md: 6 },
      }}
    >
      <Container maxWidth="lg">
        {/* Breadcrumbs */}
        <Breadcrumbs sx={{ mb: 4 }}>
          <MuiLink
            component={Link}
            href="/"
            sx={{
              color: 'var(--color-text-muted)',
              textDecoration: 'none',
              '&:hover': { color: 'var(--color-primary)' },
            }}
          >
            Home
          </MuiLink>
          <MuiLink
            component={Link}
            href="/blog"
            sx={{
              color: 'var(--color-text-muted)',
              textDecoration: 'none',
              '&:hover': { color: 'var(--color-primary)' },
            }}
          >
            Blog
          </MuiLink>
          <Typography sx={{ color: 'var(--color-text-primary)' }}>
            {blog.title}
          </Typography>
        </Breadcrumbs>

        {/* Back Button */}
        <Box sx={{ mb: 4 }}>
          <MuiLink
            component="button"
            onClick={() => router.push('/blog')}
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 1,
              color: 'var(--color-primary)',
              textDecoration: 'none',
              cursor: 'pointer',
              border: 'none',
              background: 'none',
              fontFamily: 'inherit',
              fontSize: 'inherit',
              '&:hover': {
                textDecoration: 'underline',
              },
            }}
          >
            <ArrowBack sx={{ fontSize: 20 }} />
            Back to Blog
          </MuiLink>
        </Box>

        {/* Article Header */}
        <Box sx={{ mb: 4 }}>
          {/* Category */}
          {blog.category && (
            <Chip
              label={blog.category}
              sx={{
                mb: 2,
                backgroundColor: 'var(--color-primary)',
                color: 'var(--color-primary-contrast)',
                fontWeight: 'bold',
              }}
            />
          )}

          {/* Title */}
          <Typography
            variant="h2"
            component="h1"
            sx={{
              fontWeight: 'bold',
              color: 'var(--color-text-primary)',
              mb: 3,
              fontSize: { xs: '2rem', md: '3rem' },
              lineHeight: 1.2,
            }}
          >
            {blog.title}
          </Typography>

          {/* Meta Information */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 3,
              mb: 3,
              flexWrap: 'wrap',
            }}
          >
            {blog.author && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {blog.author.avatar ? (
                  <Avatar
                    src={blog.author.avatar}
                    alt={blog.author.name}
                    sx={{ width: 40, height: 40 }}
                  />
                ) : (
                  <Avatar sx={{ width: 40, height: 40, bgcolor: 'var(--color-primary)' }}>
                    <Person />
                  </Avatar>
                )}
                <Box>
                  <Typography variant="body2" sx={{ color: 'var(--color-text-primary)', fontWeight: 'bold' }}>
                    {blog.author.name || 'Admin'}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'var(--color-text-muted)' }}>
                    Author
                  </Typography>
                </Box>
              </Box>
            )}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CalendarToday sx={{ fontSize: 18, color: 'var(--color-text-muted)' }} />
              <Typography variant="body2" sx={{ color: 'var(--color-text-muted)' }}>
                {formatDate(blog.publishedAt || blog.createdAt)}
              </Typography>
            </Box>
          </Box>

          {/* Excerpt */}
          {blog.excerpt && (
            <Typography
              variant="h6"
              sx={{
                color: 'var(--color-text-muted)',
                fontStyle: 'italic',
                mb: 4,
                lineHeight: 1.6,
              }}
            >
              {blog.excerpt}
            </Typography>
          )}
        </Box>

        {/* Featured Image */}
        {blog.featuredImage && (
          <Box
            sx={{
              mb: 4,
              borderRadius: 3,
              overflow: 'hidden',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
              position: 'relative',
              width: '100%',
              height: { xs: '300px', md: '500px' },
            }}
          >
            <Image
              src={blog.featuredImage}
              alt={blog.title}
              fill
              style={{
                objectFit: 'cover',
              }}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
              onError={(e) => {
                console.error('Image failed to load:', blog.featuredImage);
                // Hide image on error
                e.currentTarget.style.display = 'none';
              }}
            />
          </Box>
        )}

        {/* Article Content */}
        <Box
          sx={{
            backgroundColor: 'var(--color-surface)',
            borderRadius: 3,
            p: { xs: 3, md: 5 },
            mb: 4,
            border: '1px solid var(--color-border)',
          }}
        >
          <Box
            sx={{
              '& p': {
                color: 'var(--color-text-primary)',
                mb: 2,
                lineHeight: 1.8,
                fontSize: '1.1rem',
              },
              '& h2': {
                color: 'var(--color-text-primary)',
                fontWeight: 'bold',
                mt: 4,
                mb: 2,
                fontSize: '1.75rem',
              },
              '& h3': {
                color: 'var(--color-text-primary)',
                fontWeight: 'bold',
                mt: 3,
                mb: 2,
                fontSize: '1.5rem',
              },
              '& ul, & ol': {
                color: 'var(--color-text-primary)',
                mb: 2,
                pl: 3,
              },
              '& li': {
                mb: 1,
                lineHeight: 1.8,
              },
              '& a': {
                color: 'var(--color-primary)',
                textDecoration: 'none',
                '&:hover': {
                  textDecoration: 'underline',
                },
              },
              '& img': {
                maxWidth: '100%',
                height: 'auto',
                borderRadius: 2,
                my: 3,
              },
              '& blockquote': {
                borderLeft: '4px solid var(--color-primary)',
                pl: 3,
                py: 1,
                my: 3,
                fontStyle: 'italic',
                color: 'var(--color-text-muted)',
                backgroundColor: 'var(--color-bg)',
              },
            }}
          >
            <ReactMarkdown>{blog.content}</ReactMarkdown>
          </Box>
        </Box>

        {/* Tags */}
        {blog.tags && blog.tags.length > 0 && (
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ color: 'var(--color-text-primary)', mb: 2 }}>
              Tags:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {blog.tags.map((tag, index) => (
                <Chip
                  key={index}
                  label={tag}
                  variant="outlined"
                  sx={{
                    borderColor: 'var(--color-border)',
                    color: 'var(--color-text-primary)',
                    '&:hover': {
                      borderColor: 'var(--color-primary)',
                      backgroundColor: 'rgba(247, 107, 28, 0.1)',
                    },
                  }}
                />
              ))}
            </Box>
          </Box>
        )}

        {/* Back to Blog Button */}
        <Box sx={{ textAlign: 'center', mt: 6 }}>
          <MuiLink
            component={Link}
            href="/blog"
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 1,
              color: 'var(--color-primary)',
              textDecoration: 'none',
              fontWeight: 'bold',
              fontSize: '1.1rem',
              '&:hover': {
                textDecoration: 'underline',
              },
            }}
          >
            <Home sx={{ fontSize: 20 }} />
            View All Blog Posts
          </MuiLink>
        </Box>
      </Container>
    </Box>
  );
};

export default BlogPostClient;

