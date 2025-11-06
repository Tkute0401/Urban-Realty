'use client';

import React from 'react';
import { Button, IconButton, Menu, MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import {
  Phone as PhoneIcon,
  Email as EmailIcon,
  WhatsApp as WhatsAppIcon,
  MoreVert as MoreVertIcon,
  Message as MessageIcon,
  Person as PersonIcon,
  Business as BusinessIcon
} from '@mui/icons-material';
import { useContactModal } from '@/hooks/useContact';

interface ContactButtonProps {
  contactType: 'agent' | 'developer' | 'general';
  contactInfo: {
    id: string;
    name: string;
    email?: string;
    phone?: string;
    avatar?: string;
    company?: string;
    role?: string;
  };
  propertyInfo?: {
    id: string;
    title: string;
    price: number;
    address?: string;
  };
  projectInfo?: {
    id: string;
    name: string;
    developer: string;
  };
  variant?: 'button' | 'icon' | 'menu';
  size?: 'small' | 'medium' | 'large';
  color?: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info';
  fullWidth?: boolean;
  disabled?: boolean;
  showDirectOptions?: boolean;
  className?: string;
  sx?: any;
  openModal?: (type: 'agent' | 'developer' | 'general', info: any, property?: any, project?: any) => void;
  closeModal?: () => void;
}

const ContactButton: React.FC<ContactButtonProps> = ({
  contactType,
  contactInfo,
  propertyInfo,
  projectInfo,
  variant = 'button',
  size = 'medium',
  color = 'primary',
  fullWidth = false,
  disabled = false,
  showDirectOptions = true,
  className,
  sx,
  openModal: openModalProp,
  closeModal: closeModalProp
}) => {
  const contactModalHook = useContactModal();
  const openModal = openModalProp || contactModalHook.openModal;
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    if (variant === 'menu') {
      setAnchorEl(event.currentTarget);
    } else {
      openModal(contactType, contactInfo, propertyInfo, projectInfo);
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDirectContact = (method: 'phone' | 'email' | 'whatsapp') => {
    const message = propertyInfo 
      ? `Hi, I'm interested in your property: ${propertyInfo.title}`
      : projectInfo
      ? `Hi, I'm interested in your project: ${projectInfo.name}`
      : 'Hi, I would like to get in touch with you.';

    switch (method) {
      case 'phone':
        if (contactInfo.phone) {
          window.open(`tel:${contactInfo.phone}`);
        }
        break;
      case 'email':
        if (contactInfo.email) {
          window.open(`mailto:${contactInfo.email}?subject=Inquiry&body=${encodeURIComponent(message)}`);
        }
        break;
      case 'whatsapp':
        const phoneNumber = contactInfo.phone?.replace(/\D/g, '');
        if (phoneNumber) {
          window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`);
        }
        break;
    }
    handleClose();
  };

  const getContactTypeIcon = () => {
    switch (contactType) {
      case 'agent': return <PersonIcon />;
      case 'developer': return <BusinessIcon />;
      default: return <MessageIcon />;
    }
  };

  const getContactTypeLabel = () => {
    switch (contactType) {
      case 'agent': return 'Contact Agent';
      case 'developer': return 'Contact Developer';
      default: return 'Contact';
    }
  };

  const getButtonColor = () => {
    switch (color) {
      case 'success': return 'var(--color-success)';
      case 'error': return 'var(--color-error)';
      case 'warning': return 'var(--color-warning)';
      case 'info': return 'var(--color-info)';
      case 'secondary': return 'var(--color-secondary)';
      default: return 'var(--color-primary)';
    }
  };

  const getButtonHoverColor = () => {
    switch (color) {
      case 'success': return 'var(--color-success-hover)';
      case 'error': return 'var(--color-error-hover)';
      case 'warning': return 'var(--color-warning-hover)';
      case 'info': return 'var(--color-info-hover)';
      case 'secondary': return 'var(--color-secondary-hover)';
      default: return 'var(--color-primary-hover)';
    }
  };

  if (variant === 'icon') {
    return (
      <>
        <IconButton
          onClick={handleClick}
          disabled={disabled}
          className={className}
          sx={{
            color: getButtonColor(),
            '&:hover': {
              backgroundColor: `${getButtonColor()}20`,
              color: getButtonHoverColor()
            },
            ...sx
          }}
        >
          {getContactTypeIcon()}
        </IconButton>
        {showDirectOptions && (
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            <MenuItem onClick={() => openModal(contactType, contactInfo, propertyInfo, projectInfo)}>
              <ListItemIcon>
                <MessageIcon />
              </ListItemIcon>
              <ListItemText>Send Message</ListItemText>
            </MenuItem>
            {contactInfo.phone && (
              <MenuItem onClick={() => handleDirectContact('phone')}>
                <ListItemIcon>
                  <PhoneIcon />
                </ListItemIcon>
                <ListItemText>Call Now</ListItemText>
              </MenuItem>
            )}
            {contactInfo.email && (
              <MenuItem onClick={() => handleDirectContact('email')}>
                <ListItemIcon>
                  <EmailIcon />
                </ListItemIcon>
                <ListItemText>Send Email</ListItemText>
              </MenuItem>
            )}
            {contactInfo.phone && (
              <MenuItem onClick={() => handleDirectContact('whatsapp')}>
                <ListItemIcon>
                  <WhatsAppIcon />
                </ListItemIcon>
                <ListItemText>WhatsApp</ListItemText>
              </MenuItem>
            )}
          </Menu>
        )}
      </>
    );
  }

  if (variant === 'menu') {
    return (
      <>
        <Button
          onClick={handleClick}
          disabled={disabled}
          fullWidth={fullWidth}
          size={size}
          className={className}
          sx={{
            backgroundColor: getButtonColor(),
            color: 'white',
            '&:hover': {
              backgroundColor: getButtonHoverColor(),
            },
            ...sx
          }}
        >
          {getContactTypeLabel()}
        </Button>
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
        >
          <MenuItem onClick={() => openModal(contactType, contactInfo, propertyInfo, projectInfo)}>
            <ListItemIcon>
              <MessageIcon />
            </ListItemIcon>
            <ListItemText>Send Message</ListItemText>
          </MenuItem>
          {showDirectOptions && contactInfo.phone && (
            <MenuItem onClick={() => handleDirectContact('phone')}>
              <ListItemIcon>
                <PhoneIcon />
              </ListItemIcon>
              <ListItemText>Call Now</ListItemText>
            </MenuItem>
          )}
          {showDirectOptions && contactInfo.email && (
            <MenuItem onClick={() => handleDirectContact('email')}>
              <ListItemIcon>
                <EmailIcon />
              </ListItemIcon>
              <ListItemText>Send Email</ListItemText>
            </MenuItem>
          )}
          {showDirectOptions && contactInfo.phone && (
            <MenuItem onClick={() => handleDirectContact('whatsapp')}>
              <ListItemIcon>
                <WhatsAppIcon />
              </ListItemIcon>
              <ListItemText>WhatsApp</ListItemText>
            </MenuItem>
          )}
        </Menu>
      </>
    );
  }

  return (
    <Button
      onClick={handleClick}
      disabled={disabled}
      fullWidth={fullWidth}
      size={size}
      variant="contained"
      startIcon={getContactTypeIcon()}
      className={className}
      sx={{
        backgroundColor: getButtonColor(),
        color: 'white',
        '&:hover': {
          backgroundColor: getButtonHoverColor(),
        },
        ...sx
      }}
    >
      {getContactTypeLabel()}
    </Button>
  );
};

export default ContactButton;
