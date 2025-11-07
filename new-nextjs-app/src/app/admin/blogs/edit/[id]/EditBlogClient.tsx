'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import {
  Box,
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Snackbar,
  Switch,
  FormControlLabel,
  Divider,
} from '@mui/material';
import {
  Save,
  Cancel,
  CloudUpload,
} from '@mui/icons-material';
import http from '@/lib/services/http';

const categories = [
  'Buying Guide',
  'Selling Guide',
  'Investment',
  'Financing',
  'Market Trends',
  'Home Improvement',
  'Legal',
  'Tips & Tricks',
  'News',
  'Other'
];

const EditBlogClient = () => {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({ 
    open: false, 
    message: '', 
    severity: 'success' 
  });

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    category: 'Other',
    tags: [] as string[],
    metaTitle: '',
    metaDescription: '',
    keywords: [] as string[],
    isPublished: false,
    isFeatured: false,
  });

  const [newTag, setNewTag] = useState('');
  const [newKeyword, setNewKeyword] = useState('');
  const [featuredImage, setFeaturedImage] = useState<File | null>(null);
  const [featuredImagePreview, setFeaturedImagePreview] = useState<string | null>(null);
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);

  useEffect(() => {
    if (user?.role !== 'admin') {
      router.push('/');
      return;
    }
    fetchBlog();
  }, [user, router, params.id]);

  const fetchBlog = async () => {
    try {
      setLoading(true);
      const response = await http.get(`/api/v1/blogs/${params.id}`);
      const blog = response.data.data;
      
      setFormData({
        title: blog.title || '',
        slug: blog.slug || '',
        excerpt: blog.excerpt || '',
        content: blog.content || '',
        category: blog.category || 'Other',
        tags: blog.tags || [],
        metaTitle: blog.metaTitle || '',
        metaDescription: blog.metaDescription || '',
        keywords: blog.keywords || [],
        isPublished: blog.isPublished || false,
        isFeatured: blog.isFeatured || false,
      });

      if (blog.featuredImage) {
        const imageUrl = typeof blog.featuredImage === 'string' 
          ? blog.featuredImage 
          : blog.featuredImage.url;
        setExistingImageUrl(imageUrl);
        setFeaturedImagePreview(imageUrl);
      }
    } catch (error: any) {
      setSnackbar({
        open: true,
        message: error.response?.data?.error || 'Failed to fetch blog post',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFeaturedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFeaturedImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      handleInputChange('tags', [...formData.tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    handleInputChange('tags', formData.tags.filter(tag => tag !== tagToRemove));
  };

  const handleAddKeyword = () => {
    if (newKeyword.trim() && !formData.keywords.includes(newKeyword.trim())) {
      handleInputChange('keywords', [...formData.keywords, newKeyword.trim()]);
      setNewKeyword('');
    }
  };

  const handleRemoveKeyword = (keywordToRemove: string) => {
    handleInputChange('keywords', formData.keywords.filter(keyword => keyword !== keywordToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.excerpt || !formData.content) {
      setSnackbar({
        open: true,
        message: 'Please fill in all required fields',
        severity: 'error'
      });
      return;
    }

    try {
      setSaving(true);
      const submitData = new FormData();
      
      // Add all form fields
      Object.keys(formData).forEach(key => {
        const value = formData[key as keyof typeof formData];
        if (Array.isArray(value)) {
          value.forEach(item => submitData.append(key, item));
        } else if (typeof value === 'boolean') {
          submitData.append(key, value.toString());
        } else {
          submitData.append(key, value as string);
        }
      });

      // Add featured image if a new one is selected
      if (featuredImage) {
        submitData.append('featuredImage', featuredImage);
      }

      const response = await http.put(`/api/v1/blogs/${params.id}`, submitData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        setSnackbar({
          open: true,
          message: 'Blog post updated successfully!',
          severity: 'success'
        });
        setTimeout(() => {
          router.push('/admin/blogs');
        }, 1500);
      }
    } catch (error: any) {
      setSnackbar({
        open: true,
        message: error.response?.data?.error || 'Failed to update blog post',
        severity: 'error'
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'var(--color-text-primary)', mb: 1 }}>
          Edit Blog Post
        </Typography>
        <Typography variant="body2" sx={{ color: 'var(--color-text-muted)' }}>
          Update your blog post content and settings
        </Typography>
      </Box>

      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          {/* Main Content */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3, mb: 3, backgroundColor: 'var(--color-surface)' }}>
              <Typography variant="h6" sx={{ mb: 2, color: 'var(--color-primary)', fontWeight: 'bold' }}>
                Content
              </Typography>

              <TextField
                fullWidth
                label="Title *"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                sx={{ mb: 2 }}
                required
              />

              <TextField
                fullWidth
                label="Slug"
                value={formData.slug}
                onChange={(e) => handleInputChange('slug', e.target.value)}
                helperText="URL-friendly version of the title"
                sx={{ mb: 2 }}
              />

              <TextField
                fullWidth
                label="Excerpt *"
                value={formData.excerpt}
                onChange={(e) => handleInputChange('excerpt', e.target.value)}
                multiline
                rows={3}
                helperText="Short description that appears in listings (max 500 characters)"
                inputProps={{ maxLength: 500 }}
                sx={{ mb: 2 }}
                required
              />

              <TextField
                fullWidth
                label="Content *"
                value={formData.content}
                onChange={(e) => handleInputChange('content', e.target.value)}
                multiline
                rows={15}
                helperText="Write your blog post content (Markdown supported)"
                sx={{ mb: 2 }}
                required
              />

              <Box sx={{ mb: 2 }}>
                <input
                  accept="image/*"
                  style={{ display: 'none' }}
                  id="featured-image-upload"
                  type="file"
                  onChange={handleImageChange}
                />
                <label htmlFor="featured-image-upload">
                  <Button
                    variant="outlined"
                    component="span"
                    startIcon={<CloudUpload />}
                    sx={{
                      borderColor: 'var(--color-primary)',
                      color: 'var(--color-primary)',
                    }}
                  >
                    {existingImageUrl ? 'Change Featured Image' : 'Upload Featured Image'}
                  </Button>
                </label>
                {featuredImagePreview && (
                  <Box sx={{ mt: 2 }}>
                    <img
                      src={featuredImagePreview}
                      alt="Preview"
                      style={{ maxWidth: '100%', maxHeight: '300px', borderRadius: '8px' }}
                    />
                  </Box>
                )}
              </Box>
            </Paper>

            {/* SEO Section */}
            <Paper sx={{ p: 3, backgroundColor: 'var(--color-surface)' }}>
              <Typography variant="h6" sx={{ mb: 2, color: 'var(--color-primary)', fontWeight: 'bold' }}>
                SEO Settings
              </Typography>

              <TextField
                fullWidth
                label="Meta Title"
                value={formData.metaTitle}
                onChange={(e) => handleInputChange('metaTitle', e.target.value)}
                helperText="SEO title (leave empty to use blog title)"
                inputProps={{ maxLength: 60 }}
                sx={{ mb: 2 }}
              />

              <TextField
                fullWidth
                label="Meta Description"
                value={formData.metaDescription}
                onChange={(e) => handleInputChange('metaDescription', e.target.value)}
                multiline
                rows={3}
                helperText="SEO description (leave empty to use excerpt, max 160 characters)"
                inputProps={{ maxLength: 160 }}
                sx={{ mb: 2 }}
              />

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ mb: 1, color: 'var(--color-text-primary)' }}>
                  Keywords
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                  <TextField
                    size="small"
                    placeholder="Add keyword"
                    value={newKeyword}
                    onChange={(e) => setNewKeyword(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddKeyword();
                      }
                    }}
                  />
                  <Button onClick={handleAddKeyword} variant="outlined" size="small">
                    Add
                  </Button>
                </Box>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {formData.keywords.map((keyword) => (
                    <Chip
                      key={keyword}
                      label={keyword}
                      onDelete={() => handleRemoveKeyword(keyword)}
                      size="small"
                    />
                  ))}
                </Box>
              </Box>
            </Paper>
          </Grid>

          {/* Sidebar */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, mb: 3, backgroundColor: 'var(--color-surface)' }}>
              <Typography variant="h6" sx={{ mb: 2, color: 'var(--color-primary)', fontWeight: 'bold' }}>
                Settings
              </Typography>

              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Category</InputLabel>
                <Select
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  label="Category"
                >
                  {categories.map((cat) => (
                    <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ mb: 1, color: 'var(--color-text-primary)' }}>
                  Tags
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                  <TextField
                    size="small"
                    fullWidth
                    placeholder="Add tag"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                  />
                  <Button onClick={handleAddTag} variant="outlined" size="small">
                    Add
                  </Button>
                </Box>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {formData.tags.map((tag) => (
                    <Chip
                      key={tag}
                      label={tag}
                      onDelete={() => handleRemoveTag(tag)}
                      size="small"
                    />
                  ))}
                </Box>
              </Box>

              <Divider sx={{ my: 2 }} />

              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isPublished}
                    onChange={(e) => handleInputChange('isPublished', e.target.checked)}
                  />
                }
                label="Published"
                sx={{ mb: 1 }}
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isFeatured}
                    onChange={(e) => handleInputChange('isFeatured', e.target.checked)}
                  />
                }
                label="Featured"
              />
            </Paper>

            {/* Actions */}
            <Paper sx={{ p: 3, backgroundColor: 'var(--color-surface)' }}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                startIcon={saving ? <CircularProgress size={20} /> : <Save />}
                disabled={saving}
                sx={{
                  mb: 2,
                  backgroundColor: 'var(--color-primary)',
                  color: 'var(--color-primary-contrast)',
                  '&:hover': {
                    backgroundColor: 'var(--color-primary-hover)',
                  },
                }}
              >
                {saving ? 'Saving...' : 'Update Blog Post'}
              </Button>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<Cancel />}
                onClick={() => router.push('/admin/blogs')}
                sx={{
                  borderColor: 'var(--color-primary)',
                  color: 'var(--color-primary)',
                }}
              >
                Cancel
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </form>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default EditBlogClient;

