'use client';

import React, { useEffect, useState } from 'react';
import { Box, Container, Typography, CircularProgress, Card, CardContent, CardMedia, Button, Chip, Grid } from '@mui/material';
import { CalendarToday, Person, ArrowForward } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { format } from 'date-fns';

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

const BlogListClient: React.FC = () => {
  const router = useRouter();
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/v1/blogs?limit=50&sort=-publishedAt');
      const data = await response.json();

      if (data.success && data.data) {
        setBlogs(Array.isArray(data.data) ? data.data : []);
      } else {
        setBlogs([]);
      }
    } catch (err: any) {
      console.error('Error fetching blogs:', err);
      setError('Failed to load blog posts');
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMMM dd, yyyy');
    } catch {
      return dateString;
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: '60vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          py: 8,
          background: 'var(--color-bg)',
        }}
      >
        <CircularProgress sx={{ color: 'var(--color-primary)' }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          minHeight: '60vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          py: 8,
          background: 'var(--color-bg)',
        }}
      >
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      component="main"
      sx={{
        minHeight: '100vh',
        background: 'var(--color-bg)',
        py: { xs: 4, md: 8 },
      }}
    >
      <Container maxWidth="xl">
        {/* Header Section */}
        <Box sx={{ mb: 6, textAlign: 'center' }}>
          <Typography
            variant="h2"
            component="h1"
            sx={{
              fontWeight: 'bold',
              color: 'var(--color-text-primary)',
              mb: 2,
              fontSize: { xs: '2rem', md: '3rem' },
            }}
          >
            Real Estate Blog
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: 'var(--color-text-muted)',
              maxWidth: 800,
              mx: 'auto',
            }}
          >
            Expert insights, market trends, and practical guides to help you navigate the real estate world
          </Typography>
        </Box>

        {/* Blog Posts Grid */}
        {blogs.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h5" sx={{ color: 'var(--color-text-primary)', mb: 2 }}>
              No Blog Posts Yet
            </Typography>
            <Typography variant="body1" sx={{ color: 'var(--color-text-muted)' }}>
              Check back soon for expert real estate insights and guides.
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={4}>
            {blogs.map((blog) => (
              <Grid item xs={12} sm={6} md={4} key={blog._id}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: 3,
                    overflow: 'hidden',
                    border: '1px solid var(--color-border)',
                    backgroundColor: 'var(--color-surface)',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 12px 24px rgba(0, 0, 0, 0.15)',
                    },
                  }}
                  onClick={() => router.push(`/blog/${blog.slug}`)}
                >
                  {/* Featured Image */}
                  {blog.featuredImage && (
                    <CardMedia
                      component="img"
                      height="200"
                      image={blog.featuredImage}
                      alt={blog.title}
                      sx={{
                        objectFit: 'cover',
                        backgroundColor: 'var(--color-bg)',
                      }}
                    />
                  )}

                  <CardContent sx={{ flexGrow: 1, p: 3 }}>
                    {/* Category */}
                    {blog.category && (
                      <Chip
                        label={blog.category}
                        size="small"
                        sx={{
                          mb: 2,
                          backgroundColor: 'var(--color-primary)',
                          color: 'var(--color-primary-contrast)',
                          fontSize: '0.75rem',
                        }}
                      />
                    )}

                    {/* Title */}
                    <Typography
                      variant="h5"
                      component="h2"
                      sx={{
                        fontWeight: 'bold',
                        color: 'var(--color-text-primary)',
                        mb: 2,
                        fontSize: { xs: '1.25rem', md: '1.5rem' },
                        lineHeight: 1.3,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {blog.title}
                    </Typography>

                    {/* Excerpt */}
                    <Typography
                      variant="body2"
                      sx={{
                        color: 'var(--color-text-muted)',
                        mb: 3,
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        minHeight: '4.5rem',
                      }}
                    >
                      {blog.excerpt || blog.content?.substring(0, 150) + '...'}
                    </Typography>

                    {/* Meta Information */}
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        mb: 2,
                        flexWrap: 'wrap',
                      }}
                    >
                      {blog.author && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Person sx={{ fontSize: 16, color: 'var(--color-text-muted)' }} />
                          <Typography variant="caption" sx={{ color: 'var(--color-text-muted)' }}>
                            {blog.author.name || 'Admin'}
                          </Typography>
                        </Box>
                      )}
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <CalendarToday sx={{ fontSize: 16, color: 'var(--color-text-muted)' }} />
                        <Typography variant="caption" sx={{ color: 'var(--color-text-muted)' }}>
                          {formatDate(blog.publishedAt || blog.createdAt)}
                        </Typography>
                      </Box>
                    </Box>

                    {/* Tags */}
                    {blog.tags && blog.tags.length > 0 && (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                        {blog.tags.slice(0, 3).map((tag, index) => (
                          <Chip
                            key={index}
                            label={tag}
                            size="small"
                            variant="outlined"
                            sx={{
                              fontSize: '0.7rem',
                              borderColor: 'var(--color-border)',
                              color: 'var(--color-text-muted)',
                            }}
                          />
                        ))}
                      </Box>
                    )}

                    {/* Read More Button */}
                    <Button
                      endIcon={<ArrowForward />}
                      sx={{
                        color: 'var(--color-primary)',
                        textTransform: 'none',
                        fontWeight: 'bold',
                        mt: 'auto',
                        '&:hover': {
                          backgroundColor: 'rgba(247, 107, 28, 0.1)',
                        },
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/blog/${blog.slug}`);
                      }}
                    >
                      Read More
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default BlogListClient;

