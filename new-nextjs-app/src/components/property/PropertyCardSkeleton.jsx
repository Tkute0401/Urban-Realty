import Skeleton from '@mui/material/Skeleton';

const PropertyCardSkeleton = ({ count = 1 }) => {
  return (
    <>
      {Array.from(new Array(count)).map((_, index) => (
        <Card key={index} sx={{ mb: 2 }}>
          <Skeleton variant="rectangular" width="100%" height={200} />
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Skeleton variant="text" width="40%" height={30} />
              <Skeleton variant="text" width="30%" height={30} />
            </Box>
            <Skeleton variant="text" width="80%" height={25} sx={{ mb: 1 }} />
            <Skeleton variant="text" width="60%" height={20} sx={{ mb: 2 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Skeleton variant="text" width="20%" height={20} />
              <Skeleton variant="text" width="20%" height={20} />
              <Skeleton variant="text" width="20%" height={20} />
            </Box>
            <Skeleton variant="text" width="30%" height={30} sx={{ mt: 2, ml: 'auto' }} />
          </CardContent>
        </Card>
      ))}
    </>
  );
};

export default PropertyCardSkeleton;