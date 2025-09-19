import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Alert,
  Paper
} from '@mui/material';
import {
  Error as ErrorIcon,
  Refresh as RefreshIcon,
  Home as HomeIcon
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null 
    };
    if (process.env.NODE_ENV === 'development') {
      console.log('🔧 ErrorBoundary constructor called');
    }
  }

  static getDerivedStateFromError(error) {
    if (process.env.NODE_ENV === 'development') {
      console.log('🔧 ErrorBoundary getDerivedStateFromError called with:', error?.message || 'Unknown error');
    }
    return { hasError: true };
  }

  componentDidMount() {
    if (process.env.NODE_ENV === 'development') {
      console.log('🔧 ErrorBoundary mounted');
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.hasError !== this.state.hasError && process.env.NODE_ENV === 'development') {
      console.log('🔧 ErrorBoundary state updated - hasError:', this.state.hasError);
    }
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    
    // Log error to console for debugging
    if (process.env.NODE_ENV === 'development') {
      console.error('🔧 ErrorBoundary caught an error:', {
        message: error?.message,
        stack: error?.stack,
        componentStack: errorInfo?.componentStack
      });
    }
    
    // You can also log to an error reporting service here
    // logErrorToService(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback 
        error={this.state.error} 
        errorInfo={this.state.errorInfo}
        resetError={() => this.setState({ hasError: false, error: null, errorInfo: null })}
      />;
    }

    return this.props.children;
  }
}

const ErrorFallback = ({ error, errorInfo, resetError }) => {
  if (process.env.NODE_ENV === 'development') {
    console.log('🔧 ErrorFallback rendering with error:', {
      message: error?.message,
      componentStack: errorInfo?.componentStack?.slice(0, 200) + '...' // Truncate for readability
    });
  }
  
  const router = useRouter();

  const handleReset = () => {
    if (process.env.NODE_ENV === 'development') {
      console.log('🔧 ErrorFallback - Reset button clicked');
    }
    resetError();
    window.location.reload();
  };

  const handleGoHome = () => {
    if (process.env.NODE_ENV === 'development') {
      console.log('🔧 ErrorFallback - Go Home button clicked');
    }
    router.push('/');
  };

  return (
    <Box 
      sx={{ 
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 3,
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}
    >
      <Card sx={{ maxWidth: 600, width: '100%' }}>
        <CardContent sx={{ textAlign: 'center', p: 4 }}>
          <ErrorIcon sx={{ fontSize: 64, color: 'error.main', mb: 2 }} />
          
          <Typography variant="h4" gutterBottom fontWeight="bold" color="error.main">
            Oops! Something went wrong
          </Typography>
          
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            We encountered an unexpected error. Don&apos;t worry, our team has been notified and is working to fix it.
          </Typography>

          {process.env.NODE_ENV === 'development' && error && (
            <Paper sx={{ p: 2, mb: 3, textAlign: 'left', maxHeight: 200, overflow: 'auto' }}>
              <Typography variant="h6" gutterBottom color="error.main">
                Error Details (Development Only):
              </Typography>
              <Typography variant="body2" component="pre" sx={{ 
                fontSize: '0.75rem', 
                color: 'text.secondary',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word'
              }}>
                {error.toString()}
              </Typography>
              {errorInfo && (
                <Typography variant="body2" component="pre" sx={{ 
                  fontSize: '0.75rem', 
                  color: 'text.secondary',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                  mt: 1
                }}>
                  {errorInfo.componentStack}
                </Typography>
              )}
            </Paper>
          )}

          <Alert severity="info" sx={{ mb: 3 }}>
            <Typography variant="body2">
              <strong>What you can do:</strong>
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              • Try refreshing the page
            </Typography>
            <Typography variant="body2">
              • Go back to the home page
            </Typography>
            <Typography variant="body2">
              • Contact support if the problem persists
            </Typography>
          </Alert>

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              startIcon={<RefreshIcon />}
              onClick={handleReset}
              sx={{ 
                background: 'linear-gradient(45deg, #667eea 0%, #764ba2 100%)',
                '&:hover': { transform: 'translateY(-2px)' }
              }}
            >
              Refresh Page
            </Button>
            
            <Button
              variant="outlined"
              startIcon={<HomeIcon />}
              onClick={handleGoHome}
            >
              Go Home
            </Button>
          </Box>

          <Typography variant="caption" color="text.secondary" sx={{ mt: 3, display: 'block' }}>
            Error ID: {Date.now()}
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ErrorBoundary;