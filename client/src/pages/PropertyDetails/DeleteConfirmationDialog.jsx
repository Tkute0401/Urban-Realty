import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Alert, CircularProgress, Typography } from '@mui/material';
import { Delete } from '@mui/icons-material';

const DeleteConfirmationDialog = ({ open, onClose, deleting, deleteError, handleDelete }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          backgroundColor: '#0B1011',
          color: '#fff',
          borderRadius: '16px',
          border: '2px solid #78CADC',
        }
      }}
    >
      <DialogTitle sx={{ 
        color: '#78CADC', 
        fontFamily: '"Poppins", sans-serif',
        fontWeight: 700,
        fontSize: '1.4rem',
        borderBottom: '1px solid rgba(120, 202, 220, 0.3)',
        py: 3
      }}>
        Confirm Delete
      </DialogTitle>
      <DialogContent sx={{ py: 3 }}>
        <Typography sx={{ 
          color: 'rgba(255, 255, 255, 0.85)', 
          fontFamily: '"Poppins", sans-serif',
          fontSize: '1.05rem',
          lineHeight: 1.6
        }}>
          Are you sure you want to delete this property? This action cannot be undone.
        </Typography>
        {deleteError && (
          <Alert severity="error" sx={{ mt: 3 }}>
            {deleteError}
          </Alert>
        )}
      </DialogContent>
      <DialogActions sx={{ 
        px: 3, 
        py: 2,
        borderTop: '1px solid rgba(120, 202, 220, 0.3)'
      }}>
        <Button 
          onClick={onClose}
          disabled={deleting}
          sx={{ 
            color: '#78CADC', 
            fontFamily: '"Poppins", sans-serif',
            fontWeight: 500,
            '&:hover': {
              backgroundColor: 'rgba(120, 202, 220, 0.1)'
            }
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleDelete}
          sx={{
            color: '#e74c3c',
            fontFamily: '"Poppins", sans-serif',
            fontWeight: 600,
            '&:hover': {
              backgroundColor: 'rgba(231, 76, 60, 0.1)'
            }
          }}
          disabled={deleting}
          startIcon={deleting ? <CircularProgress size={20} sx={{ color: '#e74c3c' }} /> : <Delete />}
        >
          {deleting ? 'Deleting...' : 'Delete Property'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteConfirmationDialog;