'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography,
  Chip,
  Box,
  CircularProgress,
  Alert,
  Button,
  Card,
  CardContent,
  Link,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import { 
  Edit, 
  Delete, 
  Add,
  Visibility,
  Article,
  CalendarToday,
  Person,
  CheckCircle,
  Cancel,
} from '@mui/icons-material';
import http from '@/lib/services/http';
import { useAuth } from '@/contexts/AuthContext';

interface Blog {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  category?: string;
  tags?: string[];
  author?: { name?: string } | string;
  authorName?: string;
  isPublished: boolean;
  isFeatured: boolean;
  publishedAt?: string;
  views?: number;
  readingTime?: number;
  featuredImage?: { url?: string } | string;
}

const BlogsTable = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState<Blog | null>(null);

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

  useEffect(() => {
    if (user?.role !== 'admin') {
      router.push('/');
      return;
    }
    fetchBlogs();
  }, [user, router]);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await http.get('/api/v1/blogs?limit=100');
      setBlogs(response.data.data || []);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch blogs');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!blogToDelete) return;
    
    try {
      await http.delete(`/api/v1/blogs/${blogToDelete._id}`);
      setBlogs(blogs.filter(blog => blog._id !== blogToDelete._id));
      setDeleteDialogOpen(false);
      setBlogToDelete(null);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to delete blog');
    }
  };

  const getAuthorName = (author: any): string => {
    if (!author) return 'Squarefooot Team';
    if (typeof author === 'string') return author;
    return author.name || 'Squarefooot Team';
  };

  const getImageUrl = (image: any): string | undefined => {
    if (!image) return undefined;
    if (typeof image === 'string') return image;
    return image.url;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not published';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'var(--color-text-primary)' }}>
          Blog Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => router.push('/admin/blogs/add')}
          sx={{
            backgroundColor: 'var(--color-primary)',
            color: 'var(--color-primary-contrast)',
            '&:hover': {
              backgroundColor: 'var(--color-primary-hover)',
            },
          }}
        >
          Add Blog Post
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <TableContainer component={Paper} sx={{ backgroundColor: 'var(--color-surface)' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold', color: 'var(--color-text-primary)' }}>Title</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: 'var(--color-text-primary)' }}>Category</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: 'var(--color-text-primary)' }}>Author</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: 'var(--color-text-primary)' }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: 'var(--color-text-primary)' }}>Published</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: 'var(--color-text-primary)' }}>Views</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: 'var(--color-text-primary)' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {blogs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                  <Typography color="text.secondary">No blogs found. Create your first blog post!</Typography>
                </TableCell>
              </TableRow>
            ) : (
              blogs.map((blog) => (
                <TableRow key={blog._id} hover>
                  <TableCell>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'var(--color-text-primary)' }}>
                        {blog.title}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'var(--color-text-muted)' }}>
                        {blog.excerpt.substring(0, 60)}...
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    {blog.category && (
                      <Chip
                        label={blog.category}
                        size="small"
                        sx={{
                          backgroundColor: 'var(--color-primary)',
                          color: 'var(--color-primary-contrast)',
                        }}
                      />
                    )}
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ color: 'var(--color-text-primary)' }}>
                      {getAuthorName(blog.author || blog.authorName)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      {blog.isPublished ? (
                        <Chip
                          icon={<CheckCircle />}
                          label="Published"
                          size="small"
                          color="success"
                        />
                      ) : (
                        <Chip
                          icon={<Cancel />}
                          label="Draft"
                          size="small"
                          color="default"
                        />
                      )}
                      {blog.isFeatured && (
                        <Chip
                          label="Featured"
                          size="small"
                          sx={{
                            backgroundColor: 'var(--color-primary)',
                            color: 'var(--color-primary-contrast)',
                          }}
                        />
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ color: 'var(--color-text-muted)' }}>
                      {formatDate(blog.publishedAt)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ color: 'var(--color-text-primary)' }}>
                      {blog.views || 0}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Tooltip title="View">
                        <IconButton
                          size="small"
                          onClick={() => router.push(`/blog/${blog.slug}`)}
                          sx={{ color: 'var(--color-primary)' }}
                        >
                          <Visibility />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit">
                        <IconButton
                          size="small"
                          onClick={() => router.push(`/admin/blogs/edit/${blog._id}`)}
                          sx={{ color: 'var(--color-primary)' }}
                        >
                          <Edit />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          size="small"
                          onClick={() => {
                            setBlogToDelete(blog);
                            setDeleteDialogOpen(true);
                          }}
                          sx={{ color: 'error.main' }}
                        >
                          <Delete />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Blog Post</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{blogToDelete?.title}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BlogsTable;

