import React, { ReactNode } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Typography,
  Slide,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import { Close as CloseIcon } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  actions?: ReactNode;
  size?: 'small' | 'medium' | 'large' | 'fullscreen';
  showCloseButton?: boolean;
  disableEscapeKeyDown?: boolean;
  disableBackdropClick?: boolean;
  animate?: boolean;
}

export function Modal({
  open,
  onClose,
  title,
  children,
  actions,
  size = 'medium',
  showCloseButton = true,
  disableEscapeKeyDown = false,
  disableBackdropClick = false,
  animate = true,
}: ModalProps): JSX.Element {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return { maxWidth: '400px', width: '90%' };
      case 'large':
        return { maxWidth: '800px', width: '90%' };
      case 'fullscreen':
        return { maxWidth: '100%', width: '100%', height: '100%', margin: 0 };
      case 'medium':
      default:
        return { maxWidth: '600px', width: '90%' };
    }
  };

  const handleClose = (event: object, reason: 'backdropClick' | 'escapeKeyDown') => {
    if (reason === 'backdropClick' && disableBackdropClick) return;
    if (reason === 'escapeKeyDown' && disableEscapeKeyDown) return;
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      TransitionComponent={animate ? Transition : undefined}
      fullScreen={size === 'fullscreen' || isMobile}
      PaperProps={{
        sx: {
          ...getSizeStyles(),
          borderRadius: size === 'fullscreen' || isMobile ? 0 : 'var(--radius-lg)',
          background: 'var(--color-surface)',
          backdropFilter: 'blur(20px)',
          border: '1px solid var(--color-border)',
        },
      }}
      sx={{
        '& .MuiBackdrop-root': {
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(4px)',
        },
      }}
    >
      <AnimatePresence>
        {open && (
          <motion.div
            initial={animate ? { opacity: 0, y: 20 } : false}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            {title && (
              <DialogTitle
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '20px 24px',
                  borderBottom: '1px solid var(--color-border)',
                }}
              >
                <Typography
                  variant="h6"
                  component="h2"
                  sx={{
                    fontWeight: 600,
                    color: 'var(--color-text)',
                  }}
                >
                  {title}
                </Typography>
                {showCloseButton && (
                  <IconButton
                    onClick={onClose}
                    sx={{
                      color: 'var(--color-text-muted)',
                      '&:hover': {
                        backgroundColor: 'var(--color-surface-elevated)',
                      },
                    }}
                  >
                    <CloseIcon />
                  </IconButton>
                )}
              </DialogTitle>
            )}

            <DialogContent
              sx={{
                padding: '24px',
                color: 'var(--color-text)',
              }}
            >
              {children}
            </DialogContent>

            {actions && (
              <DialogActions
                sx={{
                  padding: '16px 24px',
                  borderTop: '1px solid var(--color-border)',
                  gap: 1,
                }}
              >
                {actions}
              </DialogActions>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </Dialog>
  );
}

export { Modal as default };