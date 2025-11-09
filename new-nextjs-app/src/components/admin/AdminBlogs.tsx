'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  CircularProgress,
  Alert,
  Grid,
  Card,
  CardContent,
  CardActions,
  CardMedia,
  FormControlLabel,
  Switch,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  Image as ImageIcon,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { sessionManager } from '@/lib/utils/sessionManager';

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
  published?: boolean;
}

const AdminBlogs: React.FC = () => {
  const router = useRouter();
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingBlog, setEditingBlog] = useState<BlogPost | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    category: '',
    tags: '',
    seoTitle: '',
    seoDescription: '',
    metaKeywords: '',
    published: true,
  });
  const [featuredImage, setFeaturedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const token = sessionManager.getToken();
      const response = await fetch('/api/v1/blogs?limit=100&sort=-createdAt', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();

      if (data.success && data.data) {
        setBlogs(Array.isArray(data.data) ? data.data : []);
      }
    } catch (error) {
      console.error('Error fetching blogs:', error);
      toast.error('Failed to load blogs');
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleTitleChange = (title: string) => {
    setFormData({
      ...formData,
      title,
      slug: formData.slug || generateSlug(title),
      seoTitle: formData.seoTitle || title,
    });
  };

  const handleOpenDialog = (blog?: BlogPost) => {
    if (blog) {
      setEditingBlog(blog);
      setFormData({
        title: blog.title || '',
        slug: blog.slug || '',
        excerpt: blog.excerpt || '',
        content: blog.content || '',
        category: blog.category || '',
        tags: blog.tags?.join(', ') || '',
        seoTitle: blog.seoTitle || blog.title || '',
        seoDescription: blog.seoDescription || blog.excerpt || '',
        metaKeywords: blog.metaKeywords?.join(', ') || '',
        published: blog.published !== false,
      });
      // Set image preview to existing image URL if it exists
      if (blog.featuredImage) {
        // Ensure it's an absolute URL for preview
        const imageUrl = blog.featuredImage.startsWith('http') 
          ? blog.featuredImage 
          : `${window.location.origin}${blog.featuredImage}`;
        setImagePreview(imageUrl);
      } else {
        setImagePreview('');
      }
    } else {
      setEditingBlog(null);
      setFormData({
        title: '',
        slug: '',
        excerpt: '',
        content: '',
        category: '',
        tags: '',
        seoTitle: '',
        seoDescription: '',
        metaKeywords: '',
        published: true,
      });
      setImagePreview('');
    }
    setFeaturedImage(null);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingBlog(null);
    setFeaturedImage(null);
    setImagePreview('');
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFeaturedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.content) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setSubmitting(true);
      const token = sessionManager.getToken();
      const formDataToSend = new FormData();

      formDataToSend.append('title', formData.title);
      formDataToSend.append('slug', formData.slug || generateSlug(formData.title));
      formDataToSend.append('excerpt', formData.excerpt);
      formDataToSend.append('content', formData.content);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('tags', formData.tags);
      formDataToSend.append('seoTitle', formData.seoTitle || formData.title);
      formDataToSend.append('seoDescription', formData.seoDescription || formData.excerpt);
      formDataToSend.append('metaKeywords', formData.metaKeywords);
      formDataToSend.append('published', formData.published.toString());

      // Only append new image if a file was selected
      // If editing and no new file is selected, the backend will preserve the existing image
      // If imagePreview is empty (user clicked Remove), we need to clear the image
      if (featuredImage) {
        // New file selected - upload it
        formDataToSend.append('featuredImage', featuredImage);
      } else if (editingBlog && !imagePreview && editingBlog.featuredImage) {
        // User removed the image - send a flag to clear it
        formDataToSend.append('clearFeaturedImage', 'true');
      }
      // If no new file and imagePreview exists, backend will preserve existing image

      const url = editingBlog
        ? `/api/v1/blogs/${editingBlog._id}`
        : '/api/v1/blogs';

      const method = editingBlog ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success(editingBlog ? 'Blog updated successfully' : 'Blog created successfully');
        handleCloseDialog();
        fetchBlogs();
      } else {
        toast.error(data.error || 'Failed to save blog');
      }
    } catch (error) {
      console.error('Error saving blog:', error);
      toast.error('Failed to save blog');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (blogId: string) => {
    if (!confirm('Are you sure you want to delete this blog post?')) {
      return;
    }

    try {
      const token = sessionManager.getToken();
      const response = await fetch(`/api/v1/blogs/${blogId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success('Blog deleted successfully');
        fetchBlogs();
      } else {
        toast.error(data.error || 'Failed to delete blog');
      }
    } catch (error) {
      console.error('Error deleting blog:', error);
      toast.error('Failed to delete blog');
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: 'var(--color-text-primary)' }}>
          Blog Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
          sx={{
            backgroundColor: 'var(--color-primary)',
            '&:hover': {
              backgroundColor: 'var(--color-primary-hover)',
            },
          }}
        >
          Create New Blog
        </Button>
      </Box>

      {blogs.length === 0 ? (
        <Alert severity="info">No blog posts yet. Create your first blog post!</Alert>
      ) : (
        <Grid container spacing={3}>
          {blogs.map((blog) => (
            <Grid item xs={12} sm={6} md={4} key={blog._id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  border: '1px solid var(--color-border)',
                  backgroundColor: 'var(--color-surface)',
                }}
              >
                {blog.featuredImage && (
                  <CardMedia
                    component="img"
                    height="200"
                    image={blog.featuredImage}
                    alt={blog.title}
                    sx={{ objectFit: 'cover' }}
                  />
                )}
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" component="h2" sx={{ mb: 1, fontWeight: 'bold' }}>
                    {blog.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {blog.excerpt || blog.content?.substring(0, 100) + '...'}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 1 }}>
                    {blog.category && (
                      <Chip
                        label={blog.category}
                        size="small"
                        sx={{ backgroundColor: 'var(--color-primary)', color: 'white' }}
                      />
                    )}
                    <Chip
                      label={blog.published !== false ? 'Published' : 'Draft'}
                      size="small"
                      color={blog.published !== false ? 'success' : 'default'}
                      variant={blog.published !== false ? 'filled' : 'outlined'}
                    />
                  </Box>
                </CardContent>
                <CardActions>
                  <IconButton
                    size="small"
                    onClick={() => router.push(`/blog/${blog.slug}`)}
                    title="View"
                  >
                    <VisibilityIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleOpenDialog(blog)}
                    title="Edit"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleDelete(blog._id)}
                    title="Delete"
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingBlog ? 'Edit Blog Post' : 'Create New Blog Post'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 2 }}>
            <TextField
              label="Title *"
              fullWidth
              value={formData.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              required
            />
            <TextField
              label="Slug"
              fullWidth
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              helperText="URL-friendly version of the title"
            />
            <TextField
              label="Excerpt"
              fullWidth
              multiline
              rows={3}
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              helperText="Short description of the blog post"
            />
            <TextField
              label="Content *"
              fullWidth
              multiline
              rows={10}
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              required
              helperText="Use Markdown format for rich text"
            />
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={formData.category}
                label="Category"
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                <MenuItem value="Real Estate Tips">Real Estate Tips</MenuItem>
                <MenuItem value="Market Insights">Market Insights</MenuItem>
                <MenuItem value="Investment Guide">Investment Guide</MenuItem>
                <MenuItem value="Home Improvement">Home Improvement</MenuItem>
                <MenuItem value="Buying Guide">Buying Guide</MenuItem>
                <MenuItem value="Selling Guide">Selling Guide</MenuItem>
                <MenuItem value="Legal Advice">Legal Advice</MenuItem>
                <MenuItem value="Property News">Property News</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Tags"
              fullWidth
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              helperText="Comma-separated tags (e.g., real estate, property, investment)"
            />
            <Box>
              <input
                accept="image/*"
                style={{ display: 'none' }}
                id="featured-image-upload"
                type="file"
                onChange={handleImageChange}
              />
              <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <label htmlFor="featured-image-upload" style={{ flex: 1 }}>
                  <Button
                    variant="outlined"
                    component="span"
                    startIcon={<ImageIcon />}
                    fullWidth
                  >
                    {featuredImage || imagePreview ? 'Change Featured Image' : 'Upload Featured Image'}
                  </Button>
                </label>
                {(featuredImage || imagePreview) && (
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => {
                      setFeaturedImage(null);
                      setImagePreview('');
                    }}
                  >
                    Remove Image
                  </Button>
                )}
              </Box>
              {imagePreview && (
                <Box sx={{ mt: 2 }}>
                  <img
                    src={imagePreview}
                    alt="Preview"
                    style={{ 
                      maxWidth: '100%', 
                      maxHeight: '200px', 
                      borderRadius: '8px',
                      objectFit: 'cover',
                      display: 'block',
                    }}
                    onError={(e) => {
                      console.error('Failed to load image preview:', imagePreview);
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  {editingBlog && editingBlog.featuredImage && !featuredImage && (
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                      Current featured image (upload a new image to replace)
                    </Typography>
                  )}
                </Box>
              )}
            </Box>
            <TextField
              label="SEO Title"
              fullWidth
              value={formData.seoTitle}
              onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
              helperText="Title for search engines (defaults to blog title)"
            />
            <TextField
              label="SEO Description"
              fullWidth
              multiline
              rows={2}
              value={formData.seoDescription}
              onChange={(e) => setFormData({ ...formData, seoDescription: e.target.value })}
              helperText="Description for search engines (defaults to excerpt)"
            />
            <TextField
              label="Meta Keywords"
              fullWidth
              value={formData.metaKeywords}
              onChange={(e) => setFormData({ ...formData, metaKeywords: e.target.value })}
              helperText="Comma-separated keywords for SEO"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={formData.published}
                  onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                  color="primary"
                />
              }
              label="Published"
              sx={{ mt: 1 }}
            />
            <Typography variant="caption" color="text.secondary" sx={{ mt: -1, ml: 4 }}>
              {formData.published 
                ? 'This blog post will be visible to all users' 
                : 'This blog post will be hidden from public view'}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={submitting}
            sx={{
              backgroundColor: 'var(--color-primary)',
              '&:hover': {
                backgroundColor: 'var(--color-primary-hover)',
              },
            }}
          >
            {submitting ? <CircularProgress size={24} /> : editingBlog ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminBlogs;

