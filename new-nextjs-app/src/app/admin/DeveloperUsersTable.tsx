import { useState, useEffect } from 'react';
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
  Switch,
  FormControlLabel,
  Card,
  CardContent,
  CardHeader,
  Divider
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
  PersonAdd,
  Visibility
} from '@mui/icons-material';
import http from '@/lib/services/http';

interface DeveloperUser {
  _id: string;
  name: string;
  email: string;
  mobile?: string;
  occupation?: string;
  professionalInfo?: {
    businessName?: string;
    businessAddress?: string;
    businessPhone?: string;
    businessWebsite?: string;
    yearsOfExperience?: number;
    specializations?: string[];
    certifications?: string[];
  };
  active: boolean;
  isVerified: boolean;
  createdAt: string;
  developerId?: {
    _id: string;
    name: string;
    logo?: {
      url: string;
    };
    website?: string;
  };
}

const DeveloperUsersTable = () => {
  const [users, setUsers] = useState<DeveloperUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedUser, setSelectedUser] = useState<DeveloperUser | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    occupation: '',
    professionalInfo: {
      businessName: '',
      businessAddress: '',
      businessPhone: '',
      businessWebsite: '',
      yearsOfExperience: 0,
      specializations: [] as string[],
      certifications: [] as string[]
    },
    active: true
  });
  const [createFormData, setCreateFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    password: '',
    occupation: '',
    professionalInfo: {
      businessName: '',
      businessAddress: '',
      businessPhone: '',
      businessWebsite: '',
      yearsOfExperience: 0,
      specializations: [] as string[],
      certifications: [] as string[]
    }
  });

  useEffect(() => {
    fetchDeveloperUsers();
  }, []);

  const fetchDeveloperUsers = async () => {
    try {
      setLoading(true);
      const response = await http.get('/api/v1/admin/developers/users');
      setUsers(response.data.data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch developer users');
    } finally {
      setLoading(false);
    }
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, user: DeveloperUser) => {
    setAnchorEl(event.currentTarget);
    setSelectedUser(user);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedUser(null);
  };

  const handleEditClick = () => {
    if (selectedUser) {
      setEditFormData({
        name: selectedUser.name,
        email: selectedUser.email,
        mobile: selectedUser.mobile || '',
        occupation: selectedUser.occupation || '',
        professionalInfo: {
          businessName: selectedUser.professionalInfo?.businessName || '',
          businessAddress: selectedUser.professionalInfo?.businessAddress || '',
          businessPhone: selectedUser.professionalInfo?.businessPhone || '',
          businessWebsite: selectedUser.professionalInfo?.businessWebsite || '',
          yearsOfExperience: selectedUser.professionalInfo?.yearsOfExperience || 0,
          specializations: selectedUser.professionalInfo?.specializations || [],
          certifications: selectedUser.professionalInfo?.certifications || []
        },
        active: selectedUser.active
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
    if (selectedUser && window.confirm('Are you sure you want to delete this developer user? This will also delete their profile and projects.')) {
      try {
        await http.delete(`/api/v1/admin/developers/users/${selectedUser._id}`);
        await fetchDeveloperUsers();
        setError(null);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to delete developer user');
      }
    }
    handleMenuClose();
  };

  const handleEditSubmit = async () => {
    if (!selectedUser) return;

    try {
      await http.put(`/api/v1/admin/developers/users/${selectedUser._id}`, editFormData);
      await fetchDeveloperUsers();
      setEditDialogOpen(false);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update developer user');
    }
  };

  const handleCreateSubmit = async () => {
    try {
      await http.post('/api/v1/admin/developers/users', createFormData);
      await fetchDeveloperUsers();
      setCreateDialogOpen(false);
      setCreateFormData({
        name: '',
        email: '',
        mobile: '',
        password: '',
        occupation: '',
        professionalInfo: {
          businessName: '',
          businessAddress: '',
          businessPhone: '',
          businessWebsite: '',
          yearsOfExperience: 0,
          specializations: [],
          certifications: []
        }
      });
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create developer user');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
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
          Developer Users Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setCreateDialogOpen(true)}
        >
          Add Developer User
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
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Mobile</TableCell>
              <TableCell>Business</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Profile</TableCell>
              <TableCell>Joined</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user._id}>
                <TableCell>
                  <Box display="flex" alignItems="center">
                    <Business sx={{ mr: 1, color: 'primary.main' }} />
                    <Box>
                      <Typography variant="body2" fontWeight="medium">
                        {user.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {user.occupation || 'Developer'}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center">
                    <Email sx={{ mr: 1, fontSize: 16 }} />
                    {user.email}
                  </Box>
                </TableCell>
                <TableCell>
                  {user.mobile ? (
                    <Box display="flex" alignItems="center">
                      <Phone sx={{ mr: 1, fontSize: 16 }} />
                      {user.mobile}
                    </Box>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      Not provided
                    </Typography>
                  )}
                </TableCell>
                <TableCell>
                  {user.professionalInfo?.businessName ? (
                    <Typography variant="body2">
                      {user.professionalInfo.businessName}
                    </Typography>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      Not specified
                    </Typography>
                  )}
                </TableCell>
                <TableCell>
                  <Box display="flex" gap={1}>
                    <Chip
                      label={user.active ? 'Active' : 'Inactive'}
                      color={user.active ? 'success' : 'default'}
                      size="small"
                    />
                    {user.isVerified && (
                      <Chip
                        label="Verified"
                        color="primary"
                        size="small"
                      />
                    )}
                  </Box>
                </TableCell>
                <TableCell>
                  {user.developerId ? (
                    <Chip
                      label="Profile Created"
                      color="success"
                      size="small"
                    />
                  ) : (
                    <Chip
                      label="No Profile"
                      color="warning"
                      size="small"
                    />
                  )}
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {formatDate(user.createdAt)}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    onClick={(e) => handleMenuOpen(e, user)}
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
        <MenuItem onClick={handleEditClick}>
          <Edit sx={{ mr: 1 }} />
          Edit
        </MenuItem>
        <MenuItem onClick={handleDeleteClick} sx={{ color: 'error.main' }}>
          <Delete sx={{ mr: 1 }} />
          Delete
        </MenuItem>
      </Menu>

      {/* Create Dialog */}
      <Dialog open={createDialogOpen} onClose={() => setCreateDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Create Developer User</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Name"
                value={createFormData.name}
                onChange={(e) => setCreateFormData({ ...createFormData, name: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={createFormData.email}
                onChange={(e) => setCreateFormData({ ...createFormData, email: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Mobile"
                value={createFormData.mobile}
                onChange={(e) => setCreateFormData({ ...createFormData, mobile: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Password"
                type="password"
                value={createFormData.password}
                onChange={(e) => setCreateFormData({ ...createFormData, password: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Occupation"
                value={createFormData.occupation}
                onChange={(e) => setCreateFormData({ ...createFormData, occupation: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }}>
                <Typography variant="subtitle2">Professional Information</Typography>
              </Divider>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Business Name"
                value={createFormData.professionalInfo.businessName}
                onChange={(e) => setCreateFormData({
                  ...createFormData,
                  professionalInfo: { ...createFormData.professionalInfo, businessName: e.target.value }
                })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Years of Experience"
                type="number"
                value={createFormData.professionalInfo.yearsOfExperience}
                onChange={(e) => setCreateFormData({
                  ...createFormData,
                  professionalInfo: { ...createFormData.professionalInfo, yearsOfExperience: parseInt(e.target.value) || 0 }
                })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Business Address"
                multiline
                rows={2}
                value={createFormData.professionalInfo.businessAddress}
                onChange={(e) => setCreateFormData({
                  ...createFormData,
                  professionalInfo: { ...createFormData.professionalInfo, businessAddress: e.target.value }
                })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Business Phone"
                value={createFormData.professionalInfo.businessPhone}
                onChange={(e) => setCreateFormData({
                  ...createFormData,
                  professionalInfo: { ...createFormData.professionalInfo, businessPhone: e.target.value }
                })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Business Website"
                value={createFormData.professionalInfo.businessWebsite}
                onChange={(e) => setCreateFormData({
                  ...createFormData,
                  professionalInfo: { ...createFormData.professionalInfo, businessWebsite: e.target.value }
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
            Create User
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Edit Developer User</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Name"
                value={editFormData.name}
                onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={editFormData.email}
                onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Mobile"
                value={editFormData.mobile}
                onChange={(e) => setEditFormData({ ...editFormData, mobile: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Occupation"
                value={editFormData.occupation}
                onChange={(e) => setEditFormData({ ...editFormData, occupation: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={editFormData.active}
                    onChange={(e) => setEditFormData({ ...editFormData, active: e.target.checked })}
                  />
                }
                label="Active"
              />
            </Grid>
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }}>
                <Typography variant="subtitle2">Professional Information</Typography>
              </Divider>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Business Name"
                value={editFormData.professionalInfo.businessName}
                onChange={(e) => setEditFormData({
                  ...editFormData,
                  professionalInfo: { ...editFormData.professionalInfo, businessName: e.target.value }
                })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Years of Experience"
                type="number"
                value={editFormData.professionalInfo.yearsOfExperience}
                onChange={(e) => setEditFormData({
                  ...editFormData,
                  professionalInfo: { ...editFormData.professionalInfo, yearsOfExperience: parseInt(e.target.value) || 0 }
                })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Business Address"
                multiline
                rows={2}
                value={editFormData.professionalInfo.businessAddress}
                onChange={(e) => setEditFormData({
                  ...editFormData,
                  professionalInfo: { ...editFormData.professionalInfo, businessAddress: e.target.value }
                })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Business Phone"
                value={editFormData.professionalInfo.businessPhone}
                onChange={(e) => setEditFormData({
                  ...editFormData,
                  professionalInfo: { ...editFormData.professionalInfo, businessPhone: e.target.value }
                })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Business Website"
                value={editFormData.professionalInfo.businessWebsite}
                onChange={(e) => setEditFormData({
                  ...editFormData,
                  professionalInfo: { ...editFormData.professionalInfo, businessWebsite: e.target.value }
                })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleEditSubmit} variant="contained" startIcon={<Save />}>
            Update User
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={viewDialogOpen} onClose={() => setViewDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Developer User Details</DialogTitle>
        <DialogContent>
          {selectedUser && (
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <Card>
                  <CardHeader title="Basic Information" />
                  <CardContent>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">Name</Typography>
                        <Typography variant="body1">{selectedUser.name}</Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">Email</Typography>
                        <Typography variant="body1">{selectedUser.email}</Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">Mobile</Typography>
                        <Typography variant="body1">{selectedUser.mobile || 'Not provided'}</Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">Occupation</Typography>
                        <Typography variant="body1">{selectedUser.occupation || 'Not specified'}</Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">Status</Typography>
                        <Box display="flex" gap={1}>
                          <Chip
                            label={selectedUser.active ? 'Active' : 'Inactive'}
                            color={selectedUser.active ? 'success' : 'default'}
                            size="small"
                          />
                          {selectedUser.isVerified && (
                            <Chip
                              label="Verified"
                              color="primary"
                              size="small"
                            />
                          )}
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">Joined</Typography>
                        <Typography variant="body1">{formatDate(selectedUser.createdAt)}</Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>

              {selectedUser.professionalInfo && (
                <Grid item xs={12}>
                  <Card>
                    <CardHeader title="Professional Information" />
                    <CardContent>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="subtitle2" color="text.secondary">Business Name</Typography>
                          <Typography variant="body1">
                            {selectedUser.professionalInfo.businessName || 'Not specified'}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="subtitle2" color="text.secondary">Years of Experience</Typography>
                          <Typography variant="body1">
                            {selectedUser.professionalInfo.yearsOfExperience || 0} years
                          </Typography>
                        </Grid>
                        <Grid item xs={12}>
                          <Typography variant="subtitle2" color="text.secondary">Business Address</Typography>
                          <Typography variant="body1">
                            {selectedUser.professionalInfo.businessAddress || 'Not provided'}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="subtitle2" color="text.secondary">Business Phone</Typography>
                          <Typography variant="body1">
                            {selectedUser.professionalInfo.businessPhone || 'Not provided'}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="subtitle2" color="text.secondary">Business Website</Typography>
                          <Typography variant="body1">
                            {selectedUser.professionalInfo.businessWebsite || 'Not provided'}
                          </Typography>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
              )}

              <Grid item xs={12}>
                <Card>
                  <CardHeader title="Developer Profile Status" />
                  <CardContent>
                    {selectedUser.developerId ? (
                      <Box>
                        <Typography variant="body1" color="success.main" gutterBottom>
                          ✓ Developer profile is created
                        </Typography>
                        <Typography variant="body2">
                          Profile Name: {selectedUser.developerId.name}
                        </Typography>
                        {selectedUser.developerId.website && (
                          <Typography variant="body2">
                            Website: {selectedUser.developerId.website}
                          </Typography>
                        )}
                      </Box>
                    ) : (
                      <Typography variant="body1" color="warning.main">
                        ⚠ No developer profile created yet
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid>
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

export default DeveloperUsersTable;
