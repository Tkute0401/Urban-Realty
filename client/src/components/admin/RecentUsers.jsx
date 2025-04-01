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
  import { Person, VerifiedUser, Schedule } from '@mui/icons-material';
  import { formatDistanceToNow } from 'date-fns';
  
  const RecentUsers = ({ users }) => {
    const theme = useTheme();
  
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
          <Person sx={{ mr: 1, color: theme.palette.primary.main }} />
          Recent Users
        </Typography>
        
        <List dense>
          {users.map((user, index) => (
            <Box key={user._id}>
              <ListItem>
                <ListItemAvatar>
                  <Avatar 
                    alt={user.name} 
                    src={user.avatar}
                    sx={{
                      bgcolor: theme.palette.primary.main,
                      color: theme.palette.primary.contrastText
                    }}
                  >
                    {user.name.charAt(0)}
                  </Avatar>
                </ListItemAvatar>
                
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography variant="subtitle2" sx={{ mr: 1 }}>
                        {user.name}
                      </Typography>
                      {user.role === 'agent' && (
                        <Chip
                          icon={<VerifiedUser fontSize="small" />}
                          label={user.isVerified ? 'Verified' : 'Pending'}
                          size="small"
                          color={user.isVerified ? 'success' : 'warning'}
                          sx={{ height: 20 }}
                        />
                      )}
                    </Box>
                  }
                  secondary={
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                      <Schedule fontSize="small" sx={{ 
                        fontSize: '0.8rem', 
                        mr: 0.5,
                        color: theme.palette.text.secondary 
                      }} />
                      <Typography variant="caption" color="text.secondary">
                        {formatDistanceToNow(new Date(user.createdAt), { addSuffix: true })}
                      </Typography>
                    </Box>
                  }
                  sx={{ my: 0 }}
                />
                
                <Chip
                  label={user.role}
                  size="small"
                  color={
                    user.role === 'admin' ? 'primary' : 
                    user.role === 'agent' ? 'secondary' : 'default'
                  }
                  sx={{ 
                    height: 20,
                    textTransform: 'capitalize'
                  }}
                />
              </ListItem>
              
              {index < users.length - 1 && <Divider variant="inset" component="li" />}
            </Box>
          ))}
        </List>
        
        {users.length === 0 && (
          <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 2 }}>
            No recent users found
          </Typography>
        )}
      </Box>
    );
  };
  
  export default RecentUsers;