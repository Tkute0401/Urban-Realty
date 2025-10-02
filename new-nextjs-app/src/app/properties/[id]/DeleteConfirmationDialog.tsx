'use client';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Alert
} from '@mui/material';
import { Warning } from '@mui/icons-material';

interface DeleteConfirmationDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  propertyTitle: string;
}

const DeleteConfirmationDialog = ({
  open,
  onClose,
  onConfirm,
  propertyTitle
}: DeleteConfirmationDialogProps) => {
  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Warning color="error" />
          <Typography variant="h6" fontWeight="bold">
            Delete Property
          </Typography>
        </Box>
      </DialogTitle>
      
      <DialogContent>
        <Alert severity="warning" sx={{ mb: 2 }}>
          This action cannot be undone. The property will be permanently deleted.
        </Alert>
        
        <Typography variant="body1" gutterBottom>
          Are you sure you want to delete the property:
        </Typography>
        
        <Typography variant="h6" fontWeight="bold" color="primary.main" gutterBottom>
          "{propertyTitle}"
        </Typography>
        
        <Typography variant="body2" color="text.secondary">
          This will remove the property from all listings and cannot be recovered.
        </Typography>
      </DialogContent>
      
      <DialogActions sx={{ p: 3 }}>
        <Button onClick={onClose} variant="outlined">
          Cancel
        </Button>
        <Button 
          onClick={onConfirm} 
          variant="contained" 
          color="error"
        >
          Delete Property
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteConfirmationDialog;
