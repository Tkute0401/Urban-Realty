import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

const SectionHeader = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  color: '#78CADC',
  position: 'relative',
  paddingBottom: theme.spacing(2),
  marginBottom: theme.spacing(4),
  fontFamily: '"Poppins", sans-serif',
  '&:after': {
    content: '""',
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '60px',
    height: '3px',
    backgroundColor: '#78CADC',
    borderRadius: '3px'
  }
}));

export default SectionHeader;