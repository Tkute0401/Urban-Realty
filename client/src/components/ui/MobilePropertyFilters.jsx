const { IconButton } = require("@mui/material");

const MobilePropertyFilters = ({ open, onClose, filters, setFilters }) => {
    const theme = useTheme();
  
    return (
      <Drawer
        anchor="bottom"
        open={open}
        onClose={onClose}
        sx={{
          '& .MuiDrawer-paper': {
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            maxHeight: '80vh'
          }
        }}
      >
        <Box sx={{ p: 3 }}>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            mb: 3
          }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Filters
            </Typography>
            <IconButton onClick={onClose}>
              <Close />
            </IconButton>
          </Box>
  
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
              Price Range
            </Typography>
            <Slider
              value={[filters.minPrice, filters.maxPrice]}
              onChange={(e, newValue) => {
                setFilters({
                  ...filters,
                  minPrice: newValue[0],
                  maxPrice: newValue[1]
                });
              }}
              valueLabelDisplay="auto"
              min={0}
              max={10000000}
              step={100000}
              valueLabelFormat={(value) => formatPrice(value)}
              sx={{
                '& .MuiSlider-valueLabel': {
                  backgroundColor: 'primary.main'
                }
              }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
              <Typography variant="caption">
                {formatPrice(filters.minPrice)}
              </Typography>
              <Typography variant="caption">
                {formatPrice(filters.maxPrice)}
              </Typography>
            </Box>
          </Box>
  
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
              Property Type
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {['House', 'Apartment', 'Villa', 'Condo', 'Land'].map((type) => (
                <Chip
                  key={type}
                  label={type}
                  clickable
                  variant={filters.type === type ? 'filled' : 'outlined'}
                  color={filters.type === type ? 'primary' : 'default'}
                  onClick={() => {
                    setFilters({
                      ...filters,
                      type: filters.type === type ? '' : type
                    });
                  }}
                />
              ))}
            </Box>
          </Box>
  
          <Button
            fullWidth
            variant="contained"
            size="large"
            onClick={() => {
              // Apply filters
              onClose();
            }}
            sx={{
              mt: 2,
              py: 1.5,
              fontWeight: 600
            }}
          >
            Apply Filters
          </Button>
        </Box>
      </Drawer>
    );
  };