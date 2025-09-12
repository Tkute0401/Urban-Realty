import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Alert,
  CircularProgress,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Paper,
  Input,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tabs,
  Tab,
  Tooltip,
  Menu,
  MenuItem as MenuItemComponent,
  Divider,
  LinearProgress
} from '@mui/material';
import {
  CloudUpload,
  Delete,
  Edit,
  Download,
  Visibility,
  Folder,
  Image,
  VideoLibrary,
  Description,
  MoreVert,
  Add,
  Search,
  FilterList,
  Sort,
  GridView,
  ViewList,
  Refresh
} from '@mui/icons-material';
import axios from '@/lib/services/axios';

const AdminMedia = () => {
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [media, setMedia] = useState([]);
  const [selectedMedia, setSelectedMedia] = useState([]);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [activeTab, setActiveTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [uploadProgress, setUploadProgress] = useState(0);
  
  // Dialogs
  const [uploadDialog, setUploadDialog] = useState(false);
  const [editDialog, setEditDialog] = useState(false);
  const [previewDialog, setPreviewDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [editingMedia, setEditingMedia] = useState(null);
  const [previewMedia, setPreviewMedia] = useState(null);

  // Upload form
  const [uploadForm, setUploadForm] = useState({
    title: '',
    description: '',
    tags: '',
    category: 'general',
    altText: ''
  });

  useEffect(() => {
    fetchMedia();
  }, []);

  const fetchMedia = async () => {
    try {
      const response = await axios.get('/admin/media');
      if (response.data.success) {
        setMedia(response.data.data || []);
      } else {
        setError('Failed to fetch media');
      }
    } catch (err) {
      console.error('Error fetching media:', err);
      setError('Failed to load media. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setUploadForm(prev => ({
        ...prev,
        title: file.name.split('.')[0],
        altText: file.name
      }));
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    setUploadProgress(0);
    setError(null);

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('title', uploadForm.title);
    formData.append('description', uploadForm.description);
    formData.append('tags', uploadForm.tags);
    formData.append('category', uploadForm.category);
    formData.append('altText', uploadForm.altText);

    try {
      const response = await axios.post('/admin/media/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(progress);
        }
      });

      if (response.data.success) {
        setSuccess('File uploaded successfully!');
        setUploadDialog(false);
        setSelectedFile(null);
        setUploadForm({
          title: '',
          description: '',
          tags: '',
          category: 'general',
          altText: ''
        });
        fetchMedia();
      } else {
        setError('Failed to upload file');
      }
    } catch (err) {
      console.error('Error uploading file:', err);
      setError(err.response?.data?.message || 'Failed to upload file');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleEditMedia = async () => {
    if (!editingMedia) return;

    try {
      const response = await axios.put(`/admin/media/${editingMedia._id}`, {
        title: editingMedia.title,
        description: editingMedia.description,
        tags: editingMedia.tags,
        category: editingMedia.category,
        altText: editingMedia.altText
      });

      if (response.data.success) {
        setSuccess('Media updated successfully!');
        setEditDialog(false);
        setEditingMedia(null);
        fetchMedia();
      } else {
        setError('Failed to update media');
      }
    } catch (err) {
      console.error('Error updating media:', err);
      setError('Failed to update media');
    }
  };

  const handleDeleteMedia = async () => {
    if (selectedMedia.length === 0) return;

    try {
      const deletePromises = selectedMedia.map(id => 
        axios.delete(`/admin/media/${id}`)
      );
      
      await Promise.all(deletePromises);
      setSuccess(`${selectedMedia.length} file(s) deleted successfully!`);
      setDeleteDialog(false);
      setSelectedMedia([]);
      fetchMedia();
    } catch (err) {
      console.error('Error deleting media:', err);
      setError('Failed to delete media');
    }
  };

  const handleBulkDelete = () => {
    if (selectedMedia.length > 0) {
      setDeleteDialog(true);
    }
  };

  const handleSelectMedia = (mediaId) => {
    setSelectedMedia(prev => 
      prev.includes(mediaId) 
        ? prev.filter(id => id !== mediaId)
        : [...prev, mediaId]
    );
  };

  const handleSelectAll = () => {
    if (selectedMedia.length === media.length) {
      setSelectedMedia([]);
    } else {
      setSelectedMedia(media.map(item => item._id));
    }
  };

  const filteredMedia = media.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.tags.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterType === 'all' || item.type.startsWith(filterType);
    
    return matchesSearch && matchesFilter;
  });

  const sortedMedia = [...filteredMedia].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.title.localeCompare(b.title);
      case 'size':
        return b.size - a.size;
      case 'date':
        return new Date(b.createdAt) - new Date(a.createdAt);
      default:
        return 0;
    }
  });

  const getFileIcon = (type) => {
    if (type.startsWith('image/')) return <Image />;
    if (type.startsWith('video/')) return <VideoLibrary />;
    return <Description />;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Media Management</Typography>
        <Box>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={fetchMedia}
            sx={{ mr: 1 }}
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            startIcon={<CloudUpload />}
            onClick={() => setUploadDialog(true)}
          >
            Upload Media
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" onClose={() => setError(null)} sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" onClose={() => setSuccess(null)} sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      {/* Filters and Search */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                placeholder="Search media..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
                }}
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>Type</InputLabel>
                <Select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                >
                  <MenuItem value="all">All Types</MenuItem>
                  <MenuItem value="image">Images</MenuItem>
                  <MenuItem value="video">Videos</MenuItem>
                  <MenuItem value="application">Documents</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>Sort By</InputLabel>
                <Select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <MenuItem value="date">Date</MenuItem>
                  <MenuItem value="name">Name</MenuItem>
                  <MenuItem value="size">Size</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Tooltip title="Grid View">
                  <IconButton
                    onClick={() => setViewMode('grid')}
                    color={viewMode === 'grid' ? 'primary' : 'default'}
                  >
                    <GridView />
                  </IconButton>
                </Tooltip>
                <Tooltip title="List View">
                  <IconButton
                    onClick={() => setViewMode('list')}
                    color={viewMode === 'list' ? 'primary' : 'default'}
                  >
                    <ViewList />
                  </IconButton>
                </Tooltip>
              </Box>
            </Grid>
            <Grid item xs={12} md={2}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                {selectedMedia.length > 0 && (
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<Delete />}
                    onClick={handleBulkDelete}
                  >
                    Delete ({selectedMedia.length})
                  </Button>
                )}
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Media Grid/List */}
      {viewMode === 'grid' ? (
        <Grid container spacing={2}>
          {sortedMedia.map((item) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={item._id}>
              <Card 
                sx={{ 
                  cursor: 'pointer',
                  border: selectedMedia.includes(item._id) ? 2 : 1,
                  borderColor: selectedMedia.includes(item._id) ? 'primary.main' : 'divider'
                }}
                onClick={() => handleSelectMedia(item._id)}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={item.type.startsWith('image/') ? item.url : '/placeholder-image.jpg'}
                  alt={item.title}
                  sx={{ objectFit: 'cover' }}
                />
                <CardContent>
                  <Typography variant="h6" noWrap>{item.title}</Typography>
                  <Typography variant="body2" color="text.secondary" noWrap>
                    {item.description}
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                    <Chip 
                      label={item.type.split('/')[0]} 
                      size="small" 
                      color="primary" 
                      variant="outlined"
                    />
                    <Typography variant="caption">
                      {formatFileSize(item.size)}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </Typography>
                    <Box>
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          setPreviewMedia(item);
                          setPreviewDialog(true);
                        }}
                      >
                        <Visibility />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingMedia(item);
                          setEditDialog(true);
                        }}
                      >
                        <Edit />
                      </IconButton>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Card>
          <CardContent>
            <List>
              {sortedMedia.map((item) => (
                <ListItem
                  key={item._id}
                  button
                  selected={selectedMedia.includes(item._id)}
                  onClick={() => handleSelectMedia(item._id)}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                    {getFileIcon(item.type)}
                  </Box>
                  <ListItemText
                    primary={item.title}
                    secondary={`${item.description} • ${formatFileSize(item.size)} • ${new Date(item.createdAt).toLocaleDateString()}`}
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      onClick={(e) => {
                        e.stopPropagation();
                        setPreviewMedia(item);
                        setPreviewDialog(true);
                      }}
                    >
                      <Visibility />
                    </IconButton>
                    <IconButton
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingMedia(item);
                        setEditDialog(true);
                      }}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedMedia([item._id]);
                        setDeleteDialog(true);
                      }}
                    >
                      <Delete />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      )}

      {/* Upload Dialog */}
      <Dialog open={uploadDialog} onClose={() => setUploadDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Upload Media</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Input
              type="file"
              fullWidth
              onChange={handleFileSelect}
              sx={{ mb: 2 }}
            />
            {uploading && (
              <Box sx={{ mb: 2 }}>
                <LinearProgress variant="determinate" value={uploadProgress} />
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Uploading... {uploadProgress}%
                </Typography>
              </Box>
            )}
            <TextField
              fullWidth
              label="Title"
              value={uploadForm.title}
              onChange={(e) => setUploadForm(prev => ({ ...prev, title: e.target.value }))}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Description"
              value={uploadForm.description}
              onChange={(e) => setUploadForm(prev => ({ ...prev, description: e.target.value }))}
              margin="normal"
              multiline
              rows={2}
            />
            <TextField
              fullWidth
              label="Tags (comma separated)"
              value={uploadForm.tags}
              onChange={(e) => setUploadForm(prev => ({ ...prev, tags: e.target.value }))}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Alt Text"
              value={uploadForm.altText}
              onChange={(e) => setUploadForm(prev => ({ ...prev, altText: e.target.value }))}
              margin="normal"
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Category</InputLabel>
              <Select
                value={uploadForm.category}
                onChange={(e) => setUploadForm(prev => ({ ...prev, category: e.target.value }))}
              >
                <MenuItem value="general">General</MenuItem>
                <MenuItem value="properties">Properties</MenuItem>
                <MenuItem value="agents">Agents</MenuItem>
                <MenuItem value="marketing">Marketing</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUploadDialog(false)}>Cancel</Button>
          <Button 
            onClick={handleUpload} 
            variant="contained" 
            disabled={!selectedFile || uploading}
          >
            {uploading ? 'Uploading...' : 'Upload'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editDialog} onClose={() => setEditDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Media</DialogTitle>
        <DialogContent>
          {editingMedia && (
            <Box sx={{ mt: 2 }}>
              <TextField
                fullWidth
                label="Title"
                value={editingMedia.title}
                onChange={(e) => setEditingMedia(prev => ({ ...prev, title: e.target.value }))}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Description"
                value={editingMedia.description}
                onChange={(e) => setEditingMedia(prev => ({ ...prev, description: e.target.value }))}
                margin="normal"
                multiline
                rows={2}
              />
              <TextField
                fullWidth
                label="Tags (comma separated)"
                value={editingMedia.tags}
                onChange={(e) => setEditingMedia(prev => ({ ...prev, tags: e.target.value }))}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Alt Text"
                value={editingMedia.altText}
                onChange={(e) => setEditingMedia(prev => ({ ...prev, altText: e.target.value }))}
                margin="normal"
              />
              <FormControl fullWidth margin="normal">
                <InputLabel>Category</InputLabel>
                <Select
                  value={editingMedia.category}
                  onChange={(e) => setEditingMedia(prev => ({ ...prev, category: e.target.value }))}
                >
                  <MenuItem value="general">General</MenuItem>
                  <MenuItem value="properties">Properties</MenuItem>
                  <MenuItem value="agents">Agents</MenuItem>
                  <MenuItem value="marketing">Marketing</MenuItem>
                </Select>
              </FormControl>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialog(false)}>Cancel</Button>
          <Button onClick={handleEditMedia} variant="contained">Save Changes</Button>
        </DialogActions>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={previewDialog} onClose={() => setPreviewDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>{previewMedia?.title}</DialogTitle>
        <DialogContent>
          {previewMedia && (
            <Box>
              {previewMedia.type.startsWith('image/') ? (
                <img 
                  src={previewMedia.url} 
                  alt={previewMedia.title}
                  className="w-100 h-auto"
                />
              ) : (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Description sx={{ fontSize: 64, color: 'text.secondary' }} />
                  <Typography variant="h6" sx={{ mt: 2 }}>
                    {previewMedia.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {previewMedia.description}
                  </Typography>
                </Box>
              )}
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2">
                  <strong>Size:</strong> {formatFileSize(previewMedia.size)}
                </Typography>
                <Typography variant="body2">
                  <strong>Type:</strong> {previewMedia.type}
                </Typography>
                <Typography variant="body2">
                  <strong>Uploaded:</strong> {new Date(previewMedia.createdAt).toLocaleString()}
                </Typography>
                <Typography variant="body2">
                  <strong>Tags:</strong> {previewMedia.tags}
                </Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPreviewDialog(false)}>Close</Button>
          <Button 
            startIcon={<Download />}
            onClick={() => window.open(previewMedia?.url, '_blank')}
          >
            Download
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog} onClose={() => setDeleteDialog(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete {selectedMedia.length} selected file(s)? 
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog(false)}>Cancel</Button>
          <Button onClick={handleDeleteMedia} variant="contained" color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminMedia;