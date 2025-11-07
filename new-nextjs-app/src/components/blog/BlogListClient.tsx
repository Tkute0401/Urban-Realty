'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Box, Container, Typography, Card, CardContent, CardMedia, Chip, CircularProgress, Grid, useTheme, useMediaQuery } from '@mui/material';
import { CalendarToday, Person, AccessTime, ArrowForward } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { getAllBlogPosts, BlogPost } from '@/lib/services/blog.service';

const BlogListClient: React.FC = () => {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const allPosts = await getAllBlogPosts();
        setPosts(allPosts);
      } catch (error) {
        console.error('Error fetching blog posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const categories = Array.from(new Set(posts.map(post => post.category).filter(Boolean)));
  const filteredPosts = selectedCategory
    ? posts.filter(post => post.category === selectedCategory)
    : posts;

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

  return (
    <Box
      component="main"
      sx={{
        minHeight: '60vh',
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
              fontSize: { xs: '1rem', md: '1.25rem' },
            }}
          >
            Expert insights, tips, and guides to help you navigate the real estate market
          </Typography>
        </Box>

        {/* Category Filter */}
        {categories.length > 0 && (
          <Box sx={{ mb: 4, display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center' }}>
            <Chip
              label="All Posts"
              onClick={() => setSelectedCategory(null)}
              sx={{
                backgroundColor: selectedCategory === null ? 'var(--color-primary)' : 'transparent',
                color: selectedCategory === null ? 'var(--color-primary-contrast)' : 'var(--color-text-primary)',
                border: '1px solid var(--color-primary)',
                cursor: 'pointer',
                '&:hover': {
                  backgroundColor: selectedCategory === null ? 'var(--color-primary-hover)' : 'rgba(247, 107, 28, 0.1)',
                },
              }}
            />
            {categories.map((category) => (
              <Chip
                key={category}
                label={category}
                onClick={() => setSelectedCategory(category)}
                sx={{
                  backgroundColor: selectedCategory === category ? 'var(--color-primary)' : 'transparent',
                  color: selectedCategory === category ? 'var(--color-primary-contrast)' : 'var(--color-text-primary)',
                  border: '1px solid var(--color-primary)',
                  cursor: 'pointer',
                  '&:hover': {
                    backgroundColor: selectedCategory === category ? 'var(--color-primary-hover)' : 'rgba(247, 107, 28, 0.1)',
                  },
                }}
              />
            ))}
          </Box>
        )}

        {/* Blog Posts Grid */}
        {filteredPosts.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h5" sx={{ color: 'var(--color-text-primary)', mb: 2 }}>
              No blog posts found
            </Typography>
            <Typography variant="body1" sx={{ color: 'var(--color-text-muted)' }}>
              Check back soon for new content!
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {filteredPosts.map((post, index) => (
              <Grid item xs={12} sm={6} lg={4} key={post.slug}>
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      backgroundColor: 'var(--color-surface)',
                      border: '1px solid var(--color-border)',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: '0 12px 24px rgba(0, 0, 0, 0.15)',
                        borderColor: 'var(--color-primary)',
                      },
                    }}
                    onClick={() => router.push(`/blog/${post.slug}`)}
                  >
                    {/* Featured Image */}
                    {getImageUrl(post.featuredImage) && (
                      <CardMedia
                        component="img"
                        height="200"
                        image={getImageUrl(post.featuredImage) || ''}
                        alt={post.title}
                        sx={{
                          objectFit: 'cover',
                          backgroundColor: 'var(--color-bg)',
                        }}
                      />
                    )}

                    <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: 3 }}>
                      {/* Category */}
                      {post.category && (
                        <Chip
                          label={post.category}
                          size="small"
                          sx={{
                            mb: 2,
                            backgroundColor: 'var(--color-primary)',
                            color: 'var(--color-primary-contrast)',
                            fontSize: '0.75rem',
                            height: '24px',
                            width: 'fit-content',
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
                        {post.title}
                      </Typography>

                      {/* Excerpt */}
                      <Typography
                        variant="body2"
                        sx={{
                          color: 'var(--color-text-muted)',
                          mb: 3,
                          flexGrow: 1,
                          display: '-webkit-box',
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        {post.excerpt}
                      </Typography>

                      {/* Meta Information */}
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2, fontSize: '0.875rem' }}>
                        {post.author && (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'var(--color-text-muted)' }}>
                            <Person sx={{ fontSize: '1rem' }} />
                            <Typography variant="caption">{post.author}</Typography>
                          </Box>
                        )}
                        {post.publishedAt && (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'var(--color-text-muted)' }}>
                            <CalendarToday sx={{ fontSize: '1rem' }} />
                            <Typography variant="caption">{formatDate(post.publishedAt)}</Typography>
                          </Box>
                        )}
                        {post.readingTime && (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'var(--color-text-muted)' }}>
                            <AccessTime sx={{ fontSize: '1rem' }} />
                            <Typography variant="caption">{post.readingTime} min read</Typography>
                          </Box>
                        )}
                      </Box>

                      {/* Tags */}
                      {post.tags && post.tags.length > 0 && (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                          {post.tags.slice(0, 3).map((tag) => (
                            <Chip
                              key={tag}
                              label={tag}
                              size="small"
                              sx={{
                                fontSize: '0.7rem',
                                height: '20px',
                                backgroundColor: 'rgba(247, 107, 28, 0.1)',
                                color: 'var(--color-primary)',
                                border: '1px solid rgba(247, 107, 28, 0.3)',
                              }}
                            />
                          ))}
                        </Box>
                      )}

                      {/* Read More Link */}
                      <Link
                        href={`/blog/${post.slug}`}
                        style={{
                          textDecoration: 'none',
                          color: 'var(--color-primary)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0.5,
                          fontWeight: 'bold',
                          marginTop: 'auto',
                        }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        Read More
                        <ArrowForward sx={{ fontSize: '1rem' }} />
                      </Link>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default BlogListClient;

