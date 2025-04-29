import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  Container, 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Alert,
  Paper
} from '@mui/material';
import { Login as LoginIcon } from '@mui/icons-material';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  const { login, error, clearError, loading } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();
    
    // Basic validation
    if (!formData.email || !formData.password) {
      // Use the setError from context if needed
      return;
    }

    await login(formData);
  };

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4, border:"1px solid #78CADC", bgcolor: "#08171A", color: "#FFFFFF"}}>
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
            Login
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email Address"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            sx={{
              mb: 2,
              '& .MuiOutlinedInput-root': {
                backgroundColor: '#08171A',   // default background
                color: 'white',
                '& fieldset': {
                  borderColor: '#78CADC',     // normal border
                },
                '&:hover fieldset': {
                  borderColor: '#78CADC',     // border when hovered
                },
                '&.Mui-focused': {
                  backgroundColor: '#08171A',  // maintain background even when focused
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#78CADC',     // border when focused
                },
              },
              '& .MuiInputLabel-root': {
                color: 'white',                // label default
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: 'white',                // label when focused
              },
              input: {
                color: 'white',                // text color
              }
            }}
          />
          <TextField
            fullWidth
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
            sx={{
              mb: 2,
              '& .MuiOutlinedInput-root': {
                backgroundColor: '#08171A',   // default background
                color: 'white',
                '& fieldset': {
                  borderColor: '#78CADC',     // normal border
                },
                '&:hover fieldset': {
                  borderColor: '#78CADC',     // border when hovered
                },
                '&.Mui-focused': {
                  backgroundColor: '#08171A',  // maintain background even when focused
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#78CADC',     // border when focused
                },
              },
              '& .MuiInputLabel-root': {
                color: 'white',                // label default
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: 'white',                // label when focused
              },
              input: {
                color: 'white',                // text color
              }
            }}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            startIcon={<LoginIcon />}
            sx={{ mt: 3, mb: 2, py: 1.5, bgcolor: "#78CADC" }}
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;