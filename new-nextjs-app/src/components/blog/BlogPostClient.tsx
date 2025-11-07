'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Box, Container, Typography, Chip, Breadcrumbs, IconButton, useTheme, useMediaQuery } from '@mui/material';
import { CalendarToday, Person, AccessTime, ArrowBack, Share } from '@mui/icons-material';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { BlogPost } from '@/lib/services/blog.service';

interface BlogPostClientProps {
  post: BlogPost;
}

const BlogPostClient: React.FC<BlogPostClientProps> = ({ post }) => {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  // Helper function to extract image URL from string or object
  const getImageUrl = (image: string | { url?: string } | undefined): string | undefined => {
    if (!image) return undefined;
    if (typeof image === 'string') return image;
    return image.url;
  };

  // Helper function to extract author name from string or object
  const getAuthorName = (author: string | { name?: string } | undefined): string => {
    if (!author) return 'Squarefooot Team';
    if (typeof author === 'string') return author;
    return author.name || 'Squarefooot Team';
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.excerpt,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <Box
      component="main"
      sx={{
        minHeight: '60vh',
        background: 'var(--color-bg)',
        py: { xs: 4, md: 6 },
      }}
    >
      <Container maxWidth="lg">
        {/* Back Button */}
        <Box sx={{ mb: 3 }}>
          <IconButton
            onClick={() => router.push('/blog')}
            sx={{
              color: 'var(--color-primary)',
              '&:hover': {
                backgroundColor: 'rgba(247, 107, 28, 0.1)',
              },
            }}
          >
            <ArrowBack />
            <Typography variant="body2" sx={{ ml: 1 }}>
              Back to Blog
            </Typography>
          </IconButton>
        </Box>

        {/* Breadcrumbs */}
        <Breadcrumbs
          aria-label="breadcrumb"
          sx={{ mb: 4, color: 'var(--color-text-muted)' }}
        >
          <Link href="/" style={{ color: 'inherit', textDecoration: 'none' }}>
            Home
          </Link>
          <Link href="/blog" style={{ color: 'inherit', textDecoration: 'none' }}>
            Blog
          </Link>
          <Typography color="var(--color-text-primary)">
            {post.title}
          </Typography>
        </Breadcrumbs>

        {/* Featured Image */}
        {getImageUrl(post.featuredImage) && (
          <Box
            sx={{
              mb: 4,
              borderRadius: 2,
              overflow: 'hidden',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            }}
          >
            <img
              src={getImageUrl(post.featuredImage) || ''}
              alt={post.title}
              style={{
                width: '100%',
                height: 'auto',
                maxHeight: '500px',
                objectFit: 'cover',
                display: 'block',
              }}
            />
          </Box>
        )}

        {/* Article Header */}
        <Box sx={{ mb: 4 }}>
          {/* Category */}
          {post.category && (
            <Chip
              label={post.category}
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
            variant="h3"
            component="h1"
            sx={{
              fontWeight: 'bold',
              color: 'var(--color-text-primary)',
              mb: 3,
              fontSize: { xs: '2rem', md: '2.75rem' },
              lineHeight: 1.2,
            }}
          >
            {post.title}
          </Typography>

          {/* Meta Information */}
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 3,
              mb: 3,
              pb: 3,
              borderBottom: '1px solid var(--color-border)',
            }}
          >
            {(post.author || post.authorName) && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'var(--color-text-muted)' }}>
                <Person sx={{ fontSize: '1.25rem' }} />
                <Typography variant="body1">{post.authorName || getAuthorName(post.author)}</Typography>
              </Box>
            )}
            {post.publishedAt && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'var(--color-text-muted)' }}>
                <CalendarToday sx={{ fontSize: '1.25rem' }} />
                <Typography variant="body1">{formatDate(post.publishedAt)}</Typography>
              </Box>
            )}
            {post.readingTime && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'var(--color-text-muted)' }}>
                <AccessTime sx={{ fontSize: '1.25rem' }} />
                <Typography variant="body1">{post.readingTime} min read</Typography>
              </Box>
            )}
            <IconButton
              onClick={handleShare}
              sx={{
                color: 'var(--color-primary)',
                ml: 'auto',
                '&:hover': {
                  backgroundColor: 'rgba(247, 107, 28, 0.1)',
                },
              }}
            >
              <Share />
            </IconButton>
          </Box>

          {/* Excerpt */}
          {post.excerpt && (
            <Typography
              variant="h6"
              sx={{
                color: 'var(--color-text-muted)',
                fontStyle: 'italic',
                mb: 4,
                fontSize: { xs: '1rem', md: '1.25rem' },
                lineHeight: 1.6,
              }}
            >
              {post.excerpt}
            </Typography>
          )}
        </Box>

        {/* Article Content */}
        <Box
          sx={{
            backgroundColor: 'var(--color-surface)',
            borderRadius: 2,
            p: { xs: 3, md: 5 },
            mb: 4,
            border: '1px solid var(--color-border)',
          }}
        >
          <Box
            sx={{
              '& p': {
                color: 'var(--color-text-primary)',
                fontSize: '1.125rem',
                lineHeight: 1.8,
                mb: 3,
              },
              '& h1, & h2, & h3, & h4, & h5, & h6': {
                color: 'var(--color-text-primary)',
                fontWeight: 'bold',
                mb: 2,
                mt: 4,
              },
              '& h1': { fontSize: '2.5rem' },
              '& h2': { fontSize: '2rem' },
              '& h3': { fontSize: '1.75rem' },
              '& h4': { fontSize: '1.5rem' },
              '& ul, & ol': {
                color: 'var(--color-text-primary)',
                mb: 3,
                pl: 4,
              },
              '& li': {
                mb: 1,
                fontSize: '1.125rem',
                lineHeight: 1.8,
              },
              '& strong': {
                color: 'var(--color-text-primary)',
                fontWeight: 'bold',
              },
              '& a': {
                color: 'var(--color-primary)',
                textDecoration: 'none',
                '&:hover': {
                  textDecoration: 'underline',
                },
              },
              '& blockquote': {
                borderLeft: '4px solid var(--color-primary)',
                pl: 3,
                ml: 0,
                fontStyle: 'italic',
                color: 'var(--color-text-muted)',
                mb: 3,
              },
              '& code': {
                backgroundColor: 'var(--color-bg)',
                padding: '2px 6px',
                borderRadius: '4px',
                fontSize: '0.9em',
                fontFamily: 'monospace',
              },
            }}
          >
            <ReactMarkdown>{post.content}</ReactMarkdown>
          </Box>
        </Box>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h6"
              sx={{
                color: 'var(--color-text-primary)',
                mb: 2,
                fontWeight: 'bold',
              }}
            >
              Tags:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {post.tags.map((tag) => (
                <Chip
                  key={tag}
                  label={tag}
                  sx={{
                    backgroundColor: 'rgba(247, 107, 28, 0.1)',
                    color: 'var(--color-primary)',
                    border: '1px solid rgba(247, 107, 28, 0.3)',
                    '&:hover': {
                      backgroundColor: 'rgba(247, 107, 28, 0.2)',
                    },
                  }}
                />
              ))}
            </Box>
          </Box>
        )}

        {/* Back to Blog Link */}
        <Box sx={{ textAlign: 'center', mt: 6 }}>
          <Link
            href="/blog"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              color: 'var(--color-primary)',
              textDecoration: 'none',
              fontWeight: 'bold',
              fontSize: '1.125rem',
            }}
          >
            <ArrowBack />
            Back to All Posts
          </Link>
        </Box>
      </Container>
    </Box>
  );
};

export default BlogPostClient;

