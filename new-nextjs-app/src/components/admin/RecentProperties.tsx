import {
    Box,
    Typography,
    List,
    ListItem,
    ListItemAvatar,
    Avatar,
    ListItemText,
    Chip,
    Divider,
    useTheme
  } from '@mui/material';
  import { Home, Star, CalendarToday, AttachMoney } from '@mui/icons-material';
  import { formatDistanceToNow } from 'date-fns';
  import { formatPrice } from '@/lib/utils/format';
  
  const RecentProperties = ({ properties }) => {
    const theme = useTheme();
  
    return (
      <Box
        sx={{
          backgroundColor: 'var(--color-bg-primary)',
          borderRadius: 2,
          boxShadow: 'var(--shadow-sm)',
          p: 2,
          height: '100%'
        }}
      >
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
          <Home sx={{ mr: 1, color: 'var(--color-primary)' }} />
          Recent Properties
        </Typography>
        
        <List dense>
          {properties.map((property, index) => (
            <Box key={property._id}>
              <ListItem>
                <ListItemAvatar>
                  <Avatar 
                    variant="rounded"
                    src={property.images?.[0]?.url}
                    sx={{
                      bgcolor: 'var(--color-bg-tertiary)',
                      color: 'var(--color-text-secondary)'
                    }}
                  >
                    <Home />
                  </Avatar>
                </ListItemAvatar>
                
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography variant="subtitle2" sx={{ mr: 1 }}>
                        {property.title}
                      </Typography>
                      {property.featured && (
                        <Star fontSize="small" sx={{ 
                          color: 'var(--color-warning)',
                          fontSize: '1rem'
                        }} />
                      )}
                    </Box>
                  }
                  secondary={
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                      <CalendarToday fontSize="small" sx={{ 
                        fontSize: '0.8rem', 
                        mr: 0.5,
                        color: 'var(--color-text-secondary)' 
                      }} />
                      <Typography variant="caption" color="text.secondary" sx={{ mr: 1 }}>
                        {formatDistanceToNow(new Date(property.createdAt), { addSuffix: true })}
                      </Typography>
                      <AttachMoney fontSize="small" sx={{ 
                        fontSize: '0.8rem', 
                        mr: 0.5,
                        color: 'var(--color-text-secondary)' 
                      }} />
                      <Typography variant="caption" color="text.secondary">
                        {formatPrice(property.price)}
                      </Typography>
                    </Box>
                  }
                  sx={{ my: 0 }}
                />
                
                <Chip
                  label={property.status}
                  size="small"
                  color={
                    property.status === 'For Sale' ? 'primary' : 
                    property.status === 'For Rent' ? 'secondary' : 'default'
                  }
                  sx={{ 
                    height: 20,
                    textTransform: 'capitalize'
                  }}
                />
              </ListItem>
              
              {index < properties.length - 1 && <Divider variant="inset" component="li" />}
            </Box>
          ))}
        </List>
        
        {properties.length === 0 && (
          <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 2 }}>
            No recent properties found
          </Typography>
        )}
      </Box>
    );
  };
  
  export default RecentProperties;