'use client';

import React from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Chip, IconButton } from '@mui/material';
import { Close, Download, Share } from '@mui/icons-material';
import { useComparison } from '@/contexts/ComparisonContext';
import { useRouter } from 'next/navigation';
import { formatPrice } from '@/lib/utils/format';
import Image from 'next/image';

const ComparisonPage: React.FC = () => {
  const { comparisonProperties, removeFromComparison, clearComparison } = useComparison();
  const router = useRouter();

  if (comparisonProperties.length === 0) {
    return (
      <Box sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          No properties to compare
        </Typography>
        <Button variant="contained" onClick={() => router.push('/properties')}>
          Browse Properties
        </Button>
      </Box>
    );
  }

  const handlePropertyClick = (propertyId: string) => {
    router.push(`/properties/${propertyId}`);
  };

  const handleExportPDF = () => {
    // TODO: Implement PDF export
    window.print();
  };

  const getComparisonData = () => {
    const rows = [
      {
        label: 'Image',
        getValue: (property: any) => property.images?.[0]?.url || null,
        isImage: true
      },
      {
        label: 'Title',
        getValue: (property: any) => property.title || property.buildingName || 'N/A'
      },
      {
        label: 'Price',
        getValue: (property: any) => formatPrice(property.price || 0)
      },
      {
        label: 'Price per sqft',
        getValue: (property: any) => {
          const pricePerSqft = property.area > 0 ? (property.price || 0) / property.area : 0;
          return formatPrice(pricePerSqft);
        }
      },
      {
        label: 'Area (sqft)',
        getValue: (property: any) => property.area ? `${property.area.toLocaleString()} sqft` : 'N/A'
      },
      {
        label: 'Bedrooms',
        getValue: (property: any) => property.bedrooms || 'N/A'
      },
      {
        label: 'Bathrooms',
        getValue: (property: any) => property.bathrooms || 'N/A'
      },
      {
        label: 'Type',
        getValue: (property: any) => property.type || 'N/A'
      },
      {
        label: 'Location',
        getValue: (property: any) => {
          if (property.address?.locality && property.address?.city) {
            return `${property.address.locality}, ${property.address.city}`;
          }
          return property.address?.city || 'N/A';
        }
      },
      {
        label: 'Amenities',
        getValue: (property: any) => property.amenities?.join(', ') || 'N/A',
        isList: true
      }
    ];

    return rows;
  };

  const comparisonRows = getComparisonData();

  return (
    <Box sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Compare Properties ({comparisonProperties.length})
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<Download />}
            onClick={handleExportPDF}
          >
            Export PDF
          </Button>
          <Button
            variant="outlined"
            startIcon={<Share />}
            onClick={() => {
              // TODO: Implement share functionality
              navigator.share?.({
                title: 'Property Comparison',
                text: `Comparing ${comparisonProperties.length} properties`,
                url: window.location.href
              });
            }}
          >
            Share
          </Button>
          <Button
            variant="outlined"
            color="error"
            onClick={clearComparison}
          >
            Clear All
          </Button>
        </Box>
      </Box>

      <TableContainer component={Paper} sx={{ overflowX: 'auto' }}>
        <Table sx={{ minWidth: 800 }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 700, minWidth: 200 }}>Feature</TableCell>
              {comparisonProperties.map((property, index) => (
                <TableCell key={property._id} align="center" sx={{ position: 'relative', minWidth: 250 }}>
                  <IconButton
                    size="small"
                    onClick={() => removeFromComparison(property._id)}
                    sx={{
                      position: 'absolute',
                      top: 4,
                      right: 4,
                      zIndex: 1
                    }}
                  >
                    <Close fontSize="small" />
                  </IconButton>
                  <Box
                    sx={{
                      cursor: 'pointer',
                      '&:hover': { opacity: 0.8 }
                    }}
                    onClick={() => handlePropertyClick(property._id)}
                  >
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                      Property {index + 1}
                    </Typography>
                  </Box>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {comparisonRows.map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                <TableCell sx={{ fontWeight: 600, background: 'var(--color-bg-secondary)' }}>
                  {row.label}
                </TableCell>
                {comparisonProperties.map((property) => {
                  const value = row.getValue(property);
                  
                  if (row.isImage) {
                    return (
                      <TableCell key={property._id} align="center">
                        {value ? (
                          <Box
                            sx={{
                              width: 120,
                              height: 80,
                              position: 'relative',
                              borderRadius: '8px',
                              overflow: 'hidden',
                              cursor: 'pointer'
                            }}
                            onClick={() => handlePropertyClick(property._id)}
                          >
                            <Image
                              src={value}
                              alt={property.title || 'Property'}
                              fill
                              style={{ objectFit: 'cover' }}
                            />
                          </Box>
                        ) : (
                          <Box
                            sx={{
                              width: 120,
                              height: 80,
                              background: 'var(--color-bg-secondary)',
                              borderRadius: '8px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            <Typography variant="caption" color="text.secondary">
                              No Image
                            </Typography>
                          </Box>
                        )}
                      </TableCell>
                    );
                  }

                  if (row.isList && Array.isArray(value)) {
                    return (
                      <TableCell key={property._id}>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {value.map((item: string, idx: number) => (
                            <Chip key={idx} label={item} size="small" />
                          ))}
                        </Box>
                      </TableCell>
                    );
                  }

                  return (
                    <TableCell key={property._id} align="center">
                      <Typography variant="body2">
                        {value}
                      </Typography>
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ComparisonPage;



