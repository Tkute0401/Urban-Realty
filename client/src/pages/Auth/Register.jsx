import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  Container, 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Grid, 
  MenuItem, 
  Alert,
  Paper
} from '@mui/material';
import { PersonAdd } from '@mui/icons-material';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'buyer'
  });
  
  const { register, error, clearError, loading } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();
    const { success } = await register(formData);
    if (success) {
      navigate('/');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
            Create Account
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Join Urban Realty as a buyer or agent
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
                inputProps={{ minLength: 6 }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                select
                fullWidth
                label="Account Type"
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
              >
                <MenuItem value="buyer">Buyer</MenuItem>
                <MenuItem value="agent">Real Estate Agent</MenuItem>
              </TextField>
            </Grid>
          </Grid>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            startIcon={<PersonAdd />}
            sx={{ mt: 3, mb: 2, py: 1.5 }}
            disabled={loading}
          >
            {loading ? 'Registering...' : 'Register'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Register;