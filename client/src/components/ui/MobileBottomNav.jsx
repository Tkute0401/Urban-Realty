import { BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
import { Home, Search, Add, Favorite, Person } from '@mui/icons-material';

const MobileBottomNav = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  if (!isMobile) return null;

  return (
    <Paper sx={{ 
      position: 'fixed', 
      bottom: 0, 
      left: 0, 
      right: 0, 
      zIndex: 1000,
      borderTop: '1px solid',
      borderColor: 'divider'
    }} elevation={3}>
      <BottomNavigation
        showLabels
        value={location.pathname}
        onChange={(event, newValue) => {
          navigate(newValue);
        }}
        sx={{
          backgroundColor: 'background.paper',
          '& .Mui-selected': {
            color: 'primary.main'
          }
        }}
      >
        <BottomNavigationAction 
          label="Home" 
          value="/" 
          icon={<Home />} 
        />
        <BottomNavigationAction 
          label="Browse" 
          value="/properties" 
          icon={<Search />} 
        />
        {user?.role === 'agent' && (
          <BottomNavigationAction 
            label="Add" 
            value="/add-property" 
            icon={<Add />} 
          />
        )}
        <BottomNavigationAction 
          label="Profile" 
          value={user ? "/profile" : "/login"} 
          icon={<Person />} 
        />
      </BottomNavigation>
    </Paper>
  );
};