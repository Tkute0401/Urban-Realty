"use client";

import React, { useMemo, useState } from 'react';
import { Box, Container, Pagination, Stack, useMediaQuery, useTheme } from '@mui/material';
import { useSearchParams } from 'next/navigation';
import { usePropertiesQuery } from '@/hooks/api/properties';
import PropertyCard from './PropertyCard';
import PropertiesMap from './PropertiesMap';
import styles from './PropertiesExplorer.module.css';

export default function PropertiesExplorer() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const searchParams = useSearchParams();
  const [page, setPage] = useState(1);
  const itemsPerPage = 12;

  const params = useMemo(() => {
    const obj: Record<string, any> = {};
    searchParams.forEach((value, key) => { obj[key] = value; });
    return obj;
  }, [searchParams]);

  const { data, isLoading, error } = usePropertiesQuery(params);
  const properties = Array.isArray(data?.items) ? data.items : Array.isArray(data) ? data : [];

  const paginated = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    return properties.slice(start, start + itemsPerPage);
  }, [properties, page]);

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        Loading properties...
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        Failed to load properties
      </Container>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.gridSection}>
        <div className={styles.grid}> 
          {paginated.map((property: any) => (
            <PropertyCard 
              key={property._id}
              id={`property-${property._id}`}
              property={property}
              index={0}
              isSelected={false}
            />
          ))}
        </div>
        {properties.length > itemsPerPage && (
          <Stack spacing={1} className={styles.paginationContainer}>
            <Pagination
              count={Math.ceil(properties.length / itemsPerPage)}
              page={page}
              onChange={(_, value) => setPage(value)}
              color="primary"
              size={isMobile ? 'small' : 'medium'}
            />
          </Stack>
        )}
      </div>
      {!isMobile && (
        <div className={styles.mapSection}>
          <PropertiesMap 
            properties={properties}
            selectedProperty={null}
            onMarkerClick={() => {}}
          />
        </div>
      )}
    </div>
  );
}

