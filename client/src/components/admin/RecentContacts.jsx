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
  import { Email, Phone, WhatsApp, Schedule } from '@mui/icons-material';
  import { formatDistanceToNow } from 'date-fns';
  
  const RecentContacts = ({ contacts }) => {
    const theme = useTheme();
  
    const getContactIcon = (method) => {
      switch(method) {
        case 'email':
          return <Email fontSize="small" />;
        case 'phone':
          return <Phone fontSize="small" />;
        case 'whatsapp':
          return <WhatsApp fontSize="small" />;
        default:
          return <Email fontSize="small" />;
      }
    };
  
    return (
      <Box
        sx={{
          backgroundColor: theme.palette.background.paper,
          borderRadius: 2,
          boxShadow: theme.shadows[1],
          p: 2,
          height: '100%'
        }}
      >
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
          <Email sx={{ mr: 1, color: theme.palette.primary.main }} />
          Recent Contacts
        </Typography>
        
        <List dense>
          {contacts.map((contact, index) => (
            <Box key={contact._id}>
              <ListItem>
                <ListItemAvatar>
                  <Avatar 
                    alt={contact.user?.name} 
                    src={contact.user?.avatar}
                    sx={{
                      bgcolor: theme.palette.primary.main,
                      color: theme.palette.primary.contrastText
                    }}
                  >
                    {contact.user?.name?.charAt(0)}
                  </Avatar>
                </ListItemAvatar>
                
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography variant="subtitle2" sx={{ mr: 1 }}>
                        {contact.user?.name || 'Unknown User'}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {getContactIcon(contact.contactMethod)}
                        <Typography variant="caption" color="text.secondary" sx={{ ml: 0.5 }}>
                          {contact.contactMethod}
                        </Typography>
                      </Box>
                    </Box>
                  }
                  secondary={
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                      <Schedule fontSize="small" sx={{ 
                        fontSize: '0.8rem', 
                        mr: 0.5,
                        color: theme.palette.text.secondary 
                      }} />
                      <Typography variant="caption" color="text.secondary" sx={{ mr: 1 }}>
                        {formatDistanceToNow(new Date(contact.createdAt), { addSuffix: true })}
                      </Typography>
                      <Typography variant="caption" noWrap sx={{ 
                        maxWidth: 120,
                        display: 'inline-block',
                        textOverflow: 'ellipsis',
                        overflow: 'hidden'
                      }}>
                        {contact.message}
                      </Typography>
                    </Box>
                  }
                  sx={{ my: 0 }}
                />
                
                <Chip
                  label={contact.status}
                  size="small"
                  color={
                    contact.status === 'pending' ? 'default' : 
                    contact.status === 'contacted' ? 'primary' :
                    contact.status === 'completed' ? 'success' : 'error'
                  }
                  sx={{ 
                    height: 20,
                    textTransform: 'capitalize'
                  }}
                />
              </ListItem>
              
              {index < contacts.length - 1 && <Divider variant="inset" component="li" />}
            </Box>
          ))}
        </List>
        
        {contacts.length === 0 && (
          <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 2 }}>
            No recent contacts found
          </Typography>
        )}
      </Box>
    );
  };
  
  export default RecentContacts;