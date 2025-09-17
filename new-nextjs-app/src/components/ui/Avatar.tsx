import React from 'react';
import { Avatar as MuiAvatar, AvatarProps as MuiAvatarProps } from '@mui/material';

interface AvatarProps extends Omit<MuiAvatarProps, 'children'> {
  name: string;
  src?: string;
  size?: 'small' | 'medium' | 'large';
  variant?: 'circular' | 'rounded' | 'square';
}

const Avatar: React.FC<AvatarProps> = ({ 
  name, 
  src, 
  size = 'medium',
  variant = 'circular',
  sx = {},
  ...props 
}) => {
  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return { width: 32, height: 32, fontSize: '0.875rem' };
      case 'large':
        return { width: 64, height: 64, fontSize: '1.5rem' };
      case 'medium':
      default:
        return { width: 40, height: 40, fontSize: '1rem' };
    }
  };

  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <MuiAvatar
      src={src}
      variant={variant}
      sx={{
        bgcolor: 'var(--color-primary)',
        color: 'var(--color-white)',
        ...getSizeStyles(),
        ...sx
      }}
      {...props}
    >
      {!src && getInitials(name)}
    </MuiAvatar>
  );
};

export default Avatar;