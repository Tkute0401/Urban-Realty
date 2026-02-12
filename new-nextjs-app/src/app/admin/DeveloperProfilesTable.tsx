'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/services/api';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  Chip,
  Box,
  CircularProgress,
  Alert,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Avatar,
  Link
} from '@mui/material';
import {
  MoreVert,
  Edit,
  Delete,
  Add,
  Business,
  Email,
  Phone,
  Close,
  Save,
  Visibility,
  Language,
  LocationOn,
  CalendarToday,
  Group,
  Star,
  PersonAdd,
  LinkOff
} from '@mui/icons-material';
import http from '@/lib/services/http';

interface DeveloperProfile {
  _id: string;
  userId?: {
    _id: string;
    name: string;
    email: string;
    mobile?: string;
  };
  name: string;
  description: string;
  logo?: {
    url: string;
    publicId: string;
  };
  website?: string;
  foundedYear?: number;
  headquarters?: {
    city?: string;
    state?: string;
    country?: string;
  };
  contact?: {
    email?: string;
    phone?: string;
  };
  socialMedia?: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    instagram?: string;
  };
  completedProjects: number;
  ongoingProjects: number;
  upcomingProjects: number;
  team?: Array<{
    name: string;
    designation: string;
    image?: {
      url: string;
      publicId: string;
    };
  }>;
  specializations?: Array<{
    name: string;
    description: string;
  }>;
  awards?: Array<{
    name: string;
    year: number;
    category: string;
  }>;
  createdAt: string;
}

const DeveloperProfilesTable = () => {
  const router = useRouter();
  const [profiles, setProfiles] = useState<DeveloperProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedProfile, setSelectedProfile] = useState<DeveloperProfile | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);

  // Linking related state
  const [connectUserDialogOpen, setConnectUserDialogOpen] = useState(false);
  const [unlinkedUsers, setUnlinkedUsers] = useState<any[]>([]);
  const [selectedUserIdToLink, setSelectedUserIdToLink] = useState('');
  const [loadingUnlinked, setLoadingUnlinked] = useState(false);

  const [editFormData, setEditFormData] = useState({
    name: '',
    description: '',
    website: '',
    foundedYear: '',
    headquarters: {
      city: '',
      state: '',
      country: 'India'
    },
    contact: {
      email: '',
      phone: ''
    },
    socialMedia: {
      facebook: '',
      twitter: '',
      linkedin: '',
      instagram: ''
    }
  });
  const [createFormData, setCreateFormData] = useState({
    userId: '',
    name: '',
    description: '',
    website: '',
    foundedYear: '',
    headquarters: {
      city: '',
      state: '',
      country: 'India'
    },
    contact: {
      email: '',
      phone: ''
    },
    socialMedia: {
      facebook: '',
      twitter: '',
      linkedin: '',
      instagram: ''
    }
  });

  useEffect(() => {
    fetchDeveloperProfiles();
  }, []);

  useEffect(() => {
    if (connectUserDialogOpen) {
      fetchUnlinkedUsers();
    }
  }, [connectUserDialogOpen]);

  const fetchUnlinkedUsers = async () => {
    try {
      setLoadingUnlinked(true);
      const response = await api.admin.getUnlinkedDeveloperUsers();
      setUnlinkedUsers(response.data);
    } catch (err) {
      console.error('Failed to fetch unlinked users:', err);
    } finally {
      setLoadingUnlinked(false);
    }
  };

  const handleConnectUser = async () => {
    if (!selectedProfile || !selectedUserIdToLink) return;

    try {
      await api.admin.linkDeveloper({
        userId: selectedUserIdToLink,
        developerId: selectedProfile._id
      });
      setConnectUserDialogOpen(false);
      setSelectedUserIdToLink('');
      fetchDeveloperProfiles();
      alert('User connected successfully');
    } catch (err: any) {
      setError(err.message || 'Failed to connect user');
    }
  };

  const handleUnlinkUser = async () => {
    if (!selectedProfile || !selectedProfile.userId || !window.confirm('Are you sure you want to unlink this user?')) return;

    try {
      await api.admin.unlinkDeveloper({
        developerId: selectedProfile._id
      });
      handleMenuClose();
      fetchDeveloperProfiles();
    } catch (err: any) {
      setError(err.message || 'Failed to unlink user');
    }
  };



  const fetchDeveloperProfiles = async () => {
    try {
      setLoading(true);
      const response = await http.get('/api/v1/admin/developers/profiles');
      setProfiles(response.data.data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch developer profiles');
    } finally {
      setLoading(false);
    }
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, profile: DeveloperProfile) => {
    setAnchorEl(event.currentTarget);
    setSelectedProfile(profile);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedProfile(null);
  };

  const handleEditClick = () => {
    if (selectedProfile) {
      setEditFormData({
        name: selectedProfile.name,
        description: selectedProfile.description,
        website: selectedProfile.website || '',
        foundedYear: selectedProfile.foundedYear?.toString() || '',
        headquarters: {
          city: selectedProfile.headquarters?.city || '',
          state: selectedProfile.headquarters?.state || '',
          country: selectedProfile.headquarters?.country || 'India'
        },
        contact: {
          email: selectedProfile.contact?.email || '',
          phone: selectedProfile.contact?.phone || ''
        },
        socialMedia: {
          facebook: selectedProfile.socialMedia?.facebook || '',
          twitter: selectedProfile.socialMedia?.twitter || '',
          linkedin: selectedProfile.socialMedia?.linkedin || '',
          instagram: selectedProfile.socialMedia?.instagram || ''
        }
      });
      setEditDialogOpen(true);
    }
    handleMenuClose();
  };

  const handleViewClick = () => {
    setViewDialogOpen(true);
    handleMenuClose();
  };

  const handleDeleteClick = async () => {
    if (selectedProfile && window.confirm('Are you sure you want to delete this developer profile? This will also delete all associated projects.')) {
      try {
        await http.delete(`/api/v1/admin/developers/profiles/${selectedProfile._id}`);
        await fetchDeveloperProfiles();
        setError(null);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to delete developer profile');
      }
    }
    handleMenuClose();
  };

  const handleEditSubmit = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    if (!selectedProfile) return;

    try {
      // Convert foundedYear to number if it exists and is not empty
      const foundedYearValue = editFormData.foundedYear && editFormData.foundedYear.toString().trim()
        ? parseInt(editFormData.foundedYear.toString())
        : undefined;

      // Clean up empty strings and prepare submission data
      const submitData = {
        name: editFormData.name?.trim() || '',
        description: editFormData.description?.trim() || '',
        website: editFormData.website?.trim() || undefined,
        foundedYear: foundedYearValue,
        headquarters: {
          city: editFormData.headquarters?.city?.trim() || undefined,
          state: editFormData.headquarters?.state?.trim() || undefined,
          country: editFormData.headquarters?.country?.trim() || undefined
        },
        contact: {
          email: editFormData.contact?.email?.trim() || undefined,
          phone: editFormData.contact?.phone?.trim() || undefined
        },
        socialMedia: {
          facebook: editFormData.socialMedia?.facebook?.trim() || undefined,
          twitter: editFormData.socialMedia?.twitter?.trim() || undefined,
          linkedin: editFormData.socialMedia?.linkedin?.trim() || undefined,
          instagram: editFormData.socialMedia?.instagram?.trim() || undefined
        }
      };

      await http.put(`/api/v1/admin/developers/profiles/${selectedProfile._id}`, submitData);
      await fetchDeveloperProfiles();
      setEditDialogOpen(false);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update developer profile');
    }
  };

  const handleCreateSubmit = async () => {
    try {
      await http.post('/api/v1/admin/developers/profiles', createFormData);
      await fetchDeveloperProfiles();
      setCreateDialogOpen(false);
      setCreateFormData({
        userId: '',
        name: '',
        description: '',
        website: '',
        foundedYear: '',
        headquarters: {
          city: '',
          state: '',
          country: 'India'
        },
        contact: {
          email: '',
          phone: ''
        },
        socialMedia: {
          facebook: '',
          twitter: '',
          linkedin: '',
          instagram: ''
        }
      });
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create developer profile');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getTotalProjects = (profile: DeveloperProfile) => {
    return profile.completedProjects + profile.ongoingProjects + profile.upcomingProjects;
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
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Developer Profiles Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => router.push('/admin/developers/profiles/create')}
        >
          Add Developer Profile
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Developer</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Projects</TableCell>
              <TableCell>Founded</TableCell>
              <TableCell>User Account</TableCell>
              <TableCell>Created</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {profiles.map((profile) => (
              <TableRow key={profile._id}>
                <TableCell>
                  <Box display="flex" alignItems="center">
                    <Avatar
                      src={profile.logo?.url}
                      sx={{ mr: 2, width: 40, height: 40 }}
                    >
                      <Business />
                    </Avatar>
                    <Box>
                      <Typography variant="body2" fontWeight="medium">
                        {profile.name}
                      </Typography>
                      {profile.website && (
                        <Link href={profile.website} target="_blank" variant="caption">
                          <Language sx={{ fontSize: 12, mr: 0.5 }} />
                          Website
                        </Link>
                      )}
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" noWrap sx={{ maxWidth: 200 }}>
                    {profile.description}
                  </Typography>
                </TableCell>
                <TableCell>
                  {profile.headquarters ? (
                    <Box display="flex" alignItems="center">
                      <LocationOn sx={{ mr: 1, fontSize: 16 }} />
                      <Typography variant="body2">
                        {profile.headquarters.city && profile.headquarters.state
                          ? `${profile.headquarters.city}, ${profile.headquarters.state}`
                          : profile.headquarters.city || profile.headquarters.state || 'Not specified'
                        }
                      </Typography>
                    </Box>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      Not specified
                    </Typography>
                  )}
                </TableCell>
                <TableCell>
                  <Box display="flex" gap={1}>
                    <Chip
                      label={`${getTotalProjects(profile)} Total`}
                      color="primary"
                      size="small"
                    />
                    <Chip
                      label={`${profile.completedProjects} Completed`}
                      color="success"
                      size="small"
                    />
                  </Box>
                </TableCell>
                <TableCell>
                  {profile.foundedYear ? (
                    <Box display="flex" alignItems="center">
                      <CalendarToday sx={{ mr: 1, fontSize: 16 }} />
                      <Typography variant="body2">
                        {profile.foundedYear}
                      </Typography>
                    </Box>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      Not specified
                    </Typography>
                  )}
                </TableCell>
                <TableCell>
                  {profile.userId ? (
                    <Box>
                      <Typography variant="body2" fontWeight="medium">
                        {profile.userId.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {profile.userId.email}
                      </Typography>
                    </Box>
                  ) : (
                    <Chip
                      label="No User Account"
                      color="warning"
                      size="small"
                    />
                  )}
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {formatDate(profile.createdAt)}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    onClick={(e) => handleMenuOpen(e, profile)}
                    size="small"
                  >
                    <MoreVert />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleViewClick}>
          <Visibility sx={{ mr: 1 }} />
          View Details
        </MenuItem>
        <MenuItem onClick={() => {
          if (selectedProfile) {
            router.push(`/admin/developers/profiles/edit/${selectedProfile._id}`);
          }
          handleMenuClose();
        }}>
          <Edit sx={{ mr: 1 }} />
          Edit
        </MenuItem>

        {/* Link/Unlink User Actions */}
        {selectedProfile && !selectedProfile.userId && (
          <MenuItem onClick={() => {
            setConnectUserDialogOpen(true);
            handleMenuClose();
          }}>
            <PersonAdd sx={{ mr: 1 }} />
            Connect User
          </MenuItem>
        )}

        {selectedProfile && selectedProfile.userId && (
          <MenuItem onClick={handleUnlinkUser} sx={{ color: 'warning.main' }}>
            <LinkOff sx={{ mr: 1 }} />
            Unlink User
          </MenuItem>
        )}

        <MenuItem onClick={handleDeleteClick} sx={{ color: 'error.main' }}>
          <Delete sx={{ mr: 1 }} />
          Delete
        </MenuItem>
      </Menu>

      {/* Connect User Dialog */}
      <Dialog open={connectUserDialogOpen} onClose={() => setConnectUserDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Connect Developer User</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="text.secondary" paragraph>
              Select a developer user account to link with <strong>{selectedProfile?.name}</strong>.
              This will give the user access to manage this profile and its projects.
            </Typography>

            {loadingUnlinked ? (
              <Box display="flex" justifyContent="center" p={2}>
                <CircularProgress size={24} />
              </Box>
            ) : unlinkedUsers.length > 0 ? (
              <FormControl fullWidth>
                <InputLabel>Select User</InputLabel>
                <Select
                  value={selectedUserIdToLink}
                  label="Select User"
                  onChange={(e) => setSelectedUserIdToLink(e.target.value)}
                >
                  {unlinkedUsers.map((user) => (
                    <MenuItem key={user._id} value={user._id}>
                      {user.name} ({user.email})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            ) : (
              <Alert severity="info">
                No unlinked developer users found. Create a new developer user first.
              </Alert>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConnectUserDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleConnectUser}
            variant="contained"
            disabled={!selectedUserIdToLink || loading}
          >
            Connect
          </Button>
        </DialogActions>
      </Dialog>

      {/* Connect User Dialog */}
      <Dialog open={connectUserDialogOpen} onClose={() => setConnectUserDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Connect Developer User</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="text.secondary" paragraph>
              Select a developer user account to link with <strong>{selectedProfile?.name}</strong>.
              This will give the user access to manage this profile and its projects.
            </Typography>

            {loadingUnlinked ? (
              <Box display="flex" justifyContent="center" p={2}>
                <CircularProgress size={24} />
              </Box>
            ) : unlinkedUsers.length > 0 ? (
              <FormControl fullWidth>
                <InputLabel>Select User</InputLabel>
                <Select
                  value={selectedUserIdToLink}
                  label="Select User"
                  onChange={(e) => setSelectedUserIdToLink(e.target.value)}
                >
                  {unlinkedUsers.map((user) => (
                    <MenuItem key={user._id} value={user._id}>
                      {user.name} ({user.email})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            ) : (
              <Alert severity="info">
                No unlinked developer users found. Create a new developer user first.
              </Alert>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConnectUserDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleConnectUser}
            variant="contained"
            disabled={!selectedUserIdToLink || loading}
          >
            Connect
          </Button>
        </DialogActions>
      </Dialog>

      {/* Create Dialog */}
      <Dialog open={createDialogOpen} onClose={() => setCreateDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Create Developer Profile</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Developer Name"
                value={createFormData.name}
                onChange={(e) => setCreateFormData({ ...createFormData, name: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={3}
                value={createFormData.description}
                onChange={(e) => setCreateFormData({ ...createFormData, description: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Website"
                value={createFormData.website}
                onChange={(e) => setCreateFormData({ ...createFormData, website: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Founded Year"
                type="number"
                value={createFormData.foundedYear}
                onChange={(e) => setCreateFormData({ ...createFormData, foundedYear: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }}>
                <Typography variant="subtitle2">Location</Typography>
              </Divider>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="City"
                value={createFormData.headquarters.city}
                onChange={(e) => setCreateFormData({
                  ...createFormData,
                  headquarters: { ...createFormData.headquarters, city: e.target.value }
                })}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="State"
                value={createFormData.headquarters.state}
                onChange={(e) => setCreateFormData({
                  ...createFormData,
                  headquarters: { ...createFormData.headquarters, state: e.target.value }
                })}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Country"
                value={createFormData.headquarters.country}
                onChange={(e) => setCreateFormData({
                  ...createFormData,
                  headquarters: { ...createFormData.headquarters, country: e.target.value }
                })}
              />
            </Grid>
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }}>
                <Typography variant="subtitle2">Contact Information</Typography>
              </Divider>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Contact Email"
                type="email"
                value={createFormData.contact.email}
                onChange={(e) => setCreateFormData({
                  ...createFormData,
                  contact: { ...createFormData.contact, email: e.target.value }
                })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Contact Phone"
                value={createFormData.contact.phone}
                onChange={(e) => setCreateFormData({
                  ...createFormData,
                  contact: { ...createFormData.contact, phone: e.target.value }
                })}
              />
            </Grid>
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }}>
                <Typography variant="subtitle2">Social Media</Typography>
              </Divider>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Facebook"
                value={createFormData.socialMedia.facebook}
                onChange={(e) => setCreateFormData({
                  ...createFormData,
                  socialMedia: { ...createFormData.socialMedia, facebook: e.target.value }
                })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Twitter"
                value={createFormData.socialMedia.twitter}
                onChange={(e) => setCreateFormData({
                  ...createFormData,
                  socialMedia: { ...createFormData.socialMedia, twitter: e.target.value }
                })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="LinkedIn"
                value={createFormData.socialMedia.linkedin}
                onChange={(e) => setCreateFormData({
                  ...createFormData,
                  socialMedia: { ...createFormData.socialMedia, linkedin: e.target.value }
                })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Instagram"
                value={createFormData.socialMedia.instagram}
                onChange={(e) => setCreateFormData({
                  ...createFormData,
                  socialMedia: { ...createFormData.socialMedia, instagram: e.target.value }
                })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateDialogOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleCreateSubmit} variant="contained" startIcon={<Save />}>
            Create Profile
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Edit Developer Profile</DialogTitle>
        <form onSubmit={handleEditSubmit}>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Developer Name"
                  value={editFormData.name}
                  onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  multiline
                  rows={3}
                  value={editFormData.description}
                  onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Website"
                  value={editFormData.website}
                  onChange={(e) => setEditFormData({ ...editFormData, website: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Founded Year"
                  type="number"
                  value={editFormData.foundedYear}
                  onChange={(e) => setEditFormData({ ...editFormData, foundedYear: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }}>
                  <Typography variant="subtitle2">Location</Typography>
                </Divider>
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="City"
                  value={editFormData.headquarters.city}
                  onChange={(e) => setEditFormData({
                    ...editFormData,
                    headquarters: { ...editFormData.headquarters, city: e.target.value }
                  })}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="State"
                  value={editFormData.headquarters.state}
                  onChange={(e) => setEditFormData({
                    ...editFormData,
                    headquarters: { ...editFormData.headquarters, state: e.target.value }
                  })}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Country"
                  value={editFormData.headquarters.country}
                  onChange={(e) => setEditFormData({
                    ...editFormData,
                    headquarters: { ...editFormData.headquarters, country: e.target.value }
                  })}
                />
              </Grid>
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }}>
                  <Typography variant="subtitle2">Contact Information</Typography>
                </Divider>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Contact Email"
                  type="email"
                  value={editFormData.contact.email}
                  onChange={(e) => setEditFormData({
                    ...editFormData,
                    contact: { ...editFormData.contact, email: e.target.value }
                  })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Contact Phone"
                  value={editFormData.contact.phone}
                  onChange={(e) => setEditFormData({
                    ...editFormData,
                    contact: { ...editFormData.contact, phone: e.target.value }
                  })}
                />
              </Grid>
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }}>
                  <Typography variant="subtitle2">Social Media</Typography>
                </Divider>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Facebook"
                  value={editFormData.socialMedia.facebook}
                  onChange={(e) => setEditFormData({
                    ...editFormData,
                    socialMedia: { ...editFormData.socialMedia, facebook: e.target.value }
                  })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Twitter"
                  value={editFormData.socialMedia.twitter}
                  onChange={(e) => setEditFormData({
                    ...editFormData,
                    socialMedia: { ...editFormData.socialMedia, twitter: e.target.value }
                  })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="LinkedIn"
                  value={editFormData.socialMedia.linkedin}
                  onChange={(e) => setEditFormData({
                    ...editFormData,
                    socialMedia: { ...editFormData.socialMedia, linkedin: e.target.value }
                  })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Instagram"
                  value={editFormData.socialMedia.instagram}
                  onChange={(e) => setEditFormData({
                    ...editFormData,
                    socialMedia: { ...editFormData.socialMedia, instagram: e.target.value }
                  })}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button type="button" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" startIcon={<Save />}>
              Update Profile
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={viewDialogOpen} onClose={() => setViewDialogOpen(false)} maxWidth="lg" fullWidth>
        <DialogTitle>Developer Profile Details</DialogTitle>
        <DialogContent>
          {selectedProfile && (
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <Card>
                  <CardHeader
                    title={selectedProfile.name}
                    avatar={
                      <Avatar src={selectedProfile.logo?.url} sx={{ width: 60, height: 60 }}>
                        <Business />
                      </Avatar>
                    }
                  />
                  <CardContent>
                    <Typography variant="body1" paragraph>
                      {selectedProfile.description}
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">Founded</Typography>
                        <Typography variant="body1">
                          {selectedProfile.foundedYear || 'Not specified'}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">Website</Typography>
                        <Typography variant="body1">
                          {selectedProfile.website ? (
                            <Link href={selectedProfile.website} target="_blank">
                              {selectedProfile.website}
                            </Link>
                          ) : 'Not provided'}
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="subtitle2" color="text.secondary">Location</Typography>
                        <Typography variant="body1">
                          {selectedProfile.headquarters ?
                            `${selectedProfile.headquarters.city || ''} ${selectedProfile.headquarters.state || ''} ${selectedProfile.headquarters.country || ''}`.trim() || 'Not specified'
                            : 'Not specified'
                          }
                        </Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card>
                  <CardHeader title="Project Statistics" />
                  <CardContent>
                    <Grid container spacing={2}>
                      <Grid item xs={4}>
                        <Box textAlign="center">
                          <Typography variant="h4" color="success.main">
                            {selectedProfile.completedProjects}
                          </Typography>
                          <Typography variant="body2">Completed</Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={4}>
                        <Box textAlign="center">
                          <Typography variant="h4" color="warning.main">
                            {selectedProfile.ongoingProjects}
                          </Typography>
                          <Typography variant="body2">Ongoing</Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={4}>
                        <Box textAlign="center">
                          <Typography variant="h4" color="info.main">
                            {selectedProfile.upcomingProjects}
                          </Typography>
                          <Typography variant="body2">Upcoming</Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card>
                  <CardHeader title="Contact Information" />
                  <CardContent>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <Typography variant="subtitle2" color="text.secondary">Email</Typography>
                        <Typography variant="body1">
                          {selectedProfile.contact?.email || 'Not provided'}
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="subtitle2" color="text.secondary">Phone</Typography>
                        <Typography variant="body1">
                          {selectedProfile.contact?.phone || 'Not provided'}
                        </Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>

              {selectedProfile.userId && (
                <Grid item xs={12}>
                  <Card>
                    <CardHeader title="Associated User Account" />
                    <CardContent>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="subtitle2" color="text.secondary">Name</Typography>
                          <Typography variant="body1">{selectedProfile.userId.name}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="subtitle2" color="text.secondary">Email</Typography>
                          <Typography variant="body1">{selectedProfile.userId.email}</Typography>
                        </Grid>
                        {selectedProfile.userId.mobile && (
                          <Grid item xs={12}>
                            <Typography variant="subtitle2" color="text.secondary">Mobile</Typography>
                            <Typography variant="body1">{selectedProfile.userId.mobile}</Typography>
                          </Grid>
                        )}
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
              )}

              {selectedProfile.socialMedia && (
                <Grid item xs={12}>
                  <Card>
                    <CardHeader title="Social Media" />
                    <CardContent>
                      <Grid container spacing={2}>
                        {selectedProfile.socialMedia.facebook && (
                          <Grid item xs={12} sm={6}>
                            <Typography variant="subtitle2" color="text.secondary">Facebook</Typography>
                            <Link href={selectedProfile.socialMedia.facebook} target="_blank">
                              {selectedProfile.socialMedia.facebook}
                            </Link>
                          </Grid>
                        )}
                        {selectedProfile.socialMedia.twitter && (
                          <Grid item xs={12} sm={6}>
                            <Typography variant="subtitle2" color="text.secondary">Twitter</Typography>
                            <Link href={selectedProfile.socialMedia.twitter} target="_blank">
                              {selectedProfile.socialMedia.twitter}
                            </Link>
                          </Grid>
                        )}
                        {selectedProfile.socialMedia.linkedin && (
                          <Grid item xs={12} sm={6}>
                            <Typography variant="subtitle2" color="text.secondary">LinkedIn</Typography>
                            <Link href={selectedProfile.socialMedia.linkedin} target="_blank">
                              {selectedProfile.socialMedia.linkedin}
                            </Link>
                          </Grid>
                        )}
                        {selectedProfile.socialMedia.instagram && (
                          <Grid item xs={12} sm={6}>
                            <Typography variant="subtitle2" color="text.secondary">Instagram</Typography>
                            <Link href={selectedProfile.socialMedia.instagram} target="_blank">
                              {selectedProfile.socialMedia.instagram}
                            </Link>
                          </Grid>
                        )}
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
              )}
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialogOpen(false)}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DeveloperProfilesTable;
