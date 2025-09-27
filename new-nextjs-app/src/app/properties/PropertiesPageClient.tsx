'use client'

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search as SearchIcon,
  FilterAlt as FilterIcon
} from '@mui/icons-material';
import styles from './Properties.module.css';

// Import the components
import PriceDropdown from '@/components/property/filters/PriceDropdown';
import BedBath from '@/components/property/filters/BedBath';
import HomeType from '@/components/property/filters/HomeType';
import More from '@/components/property/filters/More';
import PropertiesMap from '@/components/property/PropertiesMap';
import { PropertyCard as UnifiedPropertyCard } from '@/components/ui';
import type { Property } from '@/components/ui';

interface PropertiesPageClientProps {
  initialProperties: any[];
  initialSearchParams: { [key: string]: string | string[] | undefined };
}

const PropertyGridCard = ({ property, index, onClick }: { property: Property; index: number; onClick: (property: Property) => void }) => {
  return (
    <UnifiedPropertyCard
      property={property}
      index={index}
      showFavorite
      showStatus
      showRating
      showFeatures
      onClick={onClick}
    />
  );
};

const PropertiesPageClient: React.FC<PropertiesPageClientProps> = ({ 
  initialProperties,
  initialSearchParams 
}) => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState((initialSearchParams.location as string) || '');
  const [activeBtn, setActiveBtn] = useState((initialSearchParams.type as string)?.toUpperCase() || 'BUY');
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [isLoaded, setIsLoaded] = useState(false);
  const [properties, setProperties] = useState<any[]>(initialProperties);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>(initialProperties as Property[]);
  const [loading, setLoading] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<any>(null);
  
  const amenityOptions = [
    'Pool', 'Gym', 'Parking', 'Garden', 'Balcony', 
    'Security', 'Furnished', 'Fireplace', 'Elevator'
  ];

  useEffect(() => {
    window.scrollTo(0, 0);
    setIsLoaded(true);
    
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Filter properties whenever filters, search term, or activeBtn change
  useEffect(() => {
    let filtered = properties;

    // Filter by property type (buy/rent)
    if (activeBtn === 'BUY') {
      filtered = filtered.filter(property => 
        property.listingType?.toLowerCase() === 'sale' || 
        property.type?.toLowerCase() === 'sale' ||
        !property.listingType // Default to sale if no type specified
      );
    } else {
      filtered = filtered.filter(property => 
        property.listingType?.toLowerCase() === 'rent' || 
        property.type?.toLowerCase() === 'rent'
      );
    }

    // Filter by search term (location)
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(property => {
        const address = property.address || {};
        const location = property.location || '';
        return (
          address.city?.toLowerCase().includes(searchLower) ||
          address.state?.toLowerCase().includes(searchLower) ||
          address.street?.toLowerCase().includes(searchLower) ||
          (typeof location === 'string' && location.toLowerCase().includes(searchLower)) ||
          property.title?.toLowerCase().includes(searchLower)
        );
      });
    }

    // Apply price filters
    if (filters.minPrice || filters.maxPrice) {
      filtered = filtered.filter(property => {
        const price = property.price || 0;
        const minPrice = filters.minPrice ? Number(filters.minPrice) : 0;
        const maxPrice = filters.maxPrice ? Number(filters.maxPrice) : Infinity;
        return price >= minPrice && price <= maxPrice;
      });
    }

    // Apply bed/bath filters
    if (filters.bedrooms) {
      const bedroomCount = filters.bedrooms.toString().replace('+', '');
      const minBedrooms = Number(bedroomCount);
      filtered = filtered.filter(property => 
        (property.bedrooms || 0) >= minBedrooms
      );
    }

    if (filters.bathrooms) {
      const bathroomCount = filters.bathrooms.toString().replace('+', '');
      const minBathrooms = Number(bathroomCount);
      filtered = filtered.filter(property => 
        (property.bathrooms || 0) >= minBathrooms
      );
    }

    // Apply home type filter
    if (filters.propertyTypes && filters.propertyTypes.length > 0) {
      filtered = filtered.filter(property => {
        const propertyType = property.propertyType || property.type || '';
        return filters.propertyTypes.some((filterType: string) => {
          // Map common property types to filter labels
          const typeMapping: Record<string, string[]> = {
            'Houses': ['house', 'single-family', 'home'],
            'Apartments': ['apartment', 'flat'],
            'Condos/Co-ops': ['condo', 'co-op', 'condominium'],
            'Townhomes': ['townhome', 'townhouse'],
            'Multi-family': ['multi-family', 'multifamily', 'duplex'],
            'Lots/Land': ['lot', 'land', 'plot'],
            'Manufactured': ['manufactured', 'mobile']
          };
          
          const mappedTypes = typeMapping[filterType] || [filterType.toLowerCase()];
          return mappedTypes.some(mapped => 
            propertyType.toLowerCase().includes(mapped)
          );
        });
      });
    }

    // Apply amenities filter
    if (filters.amenities && filters.amenities.length > 0) {
      filtered = filtered.filter(property => {
        const propertyAmenities = property.amenities || [];
        return filters.amenities.some((amenity: string) => 
          propertyAmenities.some((propAmenity: string) => 
            propAmenity.toLowerCase().includes(amenity.toLowerCase())
          )
        );
      });
    }

    // Apply additional location filters
    if (filters.city) {
      const cityFilter = filters.city.toLowerCase();
      filtered = filtered.filter(property => {
        const address = property.address || {};
        return address.city?.toLowerCase().includes(cityFilter) || 
               (typeof property.location === 'string' && property.location.toLowerCase().includes(cityFilter));
      });
    }

    if (filters.state) {
      const stateFilter = filters.state.toLowerCase();
      filtered = filtered.filter(property => {
        const address = property.address || {};
        return address.state?.toLowerCase().includes(stateFilter);
      });
    }

    // Apply area filters
    if (filters.minArea || filters.maxArea) {
      filtered = filtered.filter(property => {
        const area = property.area || property.sqft || 0;
        const minArea = filters.minArea ? Number(filters.minArea) : 0;
        const maxArea = filters.maxArea ? Number(filters.maxArea) : Infinity;
        return area >= minArea && area <= maxArea;
      });
    }

    setFilteredProperties(filtered);
    
    // Update URL with search parameters for SEO
    const params = new URLSearchParams();
    if (searchTerm.trim()) params.set('location', searchTerm);
    if (activeBtn !== 'BUY') params.set('type', activeBtn.toLowerCase());
    if (Object.keys(filters).length > 0) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value && value !== '' && (!Array.isArray(value) || value.length > 0)) {
          params.set(key, Array.isArray(value) ? value.join(',') : String(value));
        }
      });
    }
    
    const newUrl = `/properties${params.toString() ? `?${params.toString()}` : ''}`;
    router.replace(newUrl, { scroll: false });
    
  }, [properties, filters, searchTerm, activeBtn, router]);

  const removeFilter = (filterKey: string) => {
    const updatedFilters = { ...filters };
    delete updatedFilters[filterKey];
    setFilters(updatedFilters);
  };

  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu);
  };

  const handleMoreFiltersApply = (newFilters: Record<string, any>) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters
    }));
  };

  const handlePriceFilterApply = (min: string, max: string) => {
    setFilters(prev => ({
      ...prev,
      minPrice: min,
      maxPrice: max
    }));
  };

  const handleBedBathFilterApply = (bedrooms: string, bathrooms: string) => {
    setFilters(prev => ({
      ...prev,
      bedrooms,
      bathrooms
    }));
  };

  const handleHomeTypeFilterApply = (propertyTypes: string[]) => {
    setFilters(prev => ({
      ...prev,
      propertyTypes
    }));
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is handled automatically via useEffect
  };

  const handleMarkerClick = (property: any) => {
    setSelectedProperty(property);
  };

  const handlePropertyClick = (property: Property) => {
    router.push(`/properties/${property._id}`);
  };

  return (
    <div className={`${styles.mainContainer} ${isLoaded ? styles.fadeIn : ''}`}>
      {/* NavBar */}
      <div className={styles.navbar}>
        <form className={`${styles.searchContainer} ${styles.slideInLeft}`} onSubmit={handleSearchSubmit}>
          <input 
            type="text" 
            placeholder="SEARCH BY LOCATION (STATE OR CITY)" 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
          <button type="submit" className={styles.searchButton}>
            <SearchIcon className={styles.searchIcon} />
          </button>
        </form>
        
        {isMobile ? (
          <button className={styles.mobileMenuButton} onClick={toggleMobileMenu}>
            <FilterIcon fontSize="small" />
            <span>Filters</span>
          </button>
        ) : (
          <div className={`${styles.navbarBtn} ${styles.slideInRight}`}>
            <div className={styles.buyRentToggle}>
              <button 
                className={`${styles.toggleBtn} ${activeBtn === 'BUY' ? styles.active : styles.inactive}`}
                onClick={() => setActiveBtn('BUY')}
              >
                BUY
              </button>
              <button 
                className={`${styles.toggleBtn} ${activeBtn === 'RENT' ? styles.active : styles.inactive}`}
                onClick={() => setActiveBtn('RENT')}
              >
                RENT
              </button>
            </div>
            <div className={styles.otherNavbarBtn}>
              <HomeType onApply={handleHomeTypeFilterApply} />
              <PriceDropdown 
                activeBtn={activeBtn} 
                onApply={handlePriceFilterApply}
                currentMin={filters.minPrice || ''}
                currentMax={filters.maxPrice || ''}
              />
              <BedBath onApply={handleBedBathFilterApply} />
              <More
                onApply={handleMoreFiltersApply} 
                amenityOptions={amenityOptions}
                currentFilters={filters}
              />
              <button className={`${styles.saveBtn} ${styles.btnAnimate}`}>SAVE SEARCH</button>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Menu */}
      {isMobile && showMobileMenu && (
        <div className={styles.mobileMenu}>
          <div className={styles.mobileMenuContent}>
            <div className={styles.buyRentToggle}>
              <button 
                className={`${styles.toggleBtn} ${activeBtn === 'BUY' ? styles.active : styles.inactive}`}
                onClick={() => {
                  setActiveBtn('BUY');
                  setShowMobileMenu(false);
                }}
              >
                BUY
              </button>
              <button 
                className={`${styles.toggleBtn} ${activeBtn === 'RENT' ? styles.active : styles.inactive}`}
                onClick={() => {
                  setActiveBtn('RENT');
                  setShowMobileMenu(false);
                }}
              >
                RENT
              </button>
            </div>
            <div className={styles.mobileMenuFilters}>
              <HomeType onApply={handleHomeTypeFilterApply} />
              <PriceDropdown 
                activeBtn={activeBtn} 
                onApply={handlePriceFilterApply}
                currentMin={filters.minPrice || ''}
                currentMax={filters.maxPrice || ''}
              />
              <BedBath onApply={handleBedBathFilterApply} />
              <More
                onApply={handleMoreFiltersApply}
                amenityOptions={amenityOptions}
                currentFilters={filters}
              />
              <button className={`${styles.saveBtn} ${styles.btnAnimate}`}>SAVE SEARCH</button>
            </div>
          </div>
        </div>
      )}

      <div className={`${styles.breadcrumb} ${styles.fadeInDelay1}`}>
        <a href="/">HOME</a>
        <span className={styles.separator}>&gt;</span>
        <a href="#">{activeBtn}</a>
        <span className={styles.separator}>&gt;</span>
        <a href="#">PROPERTIES</a>
      </div>

      <div className={`${styles.pageTitle} ${styles.fadeInDelay2}`}>
        <h1>Available Properties <span>Listings</span></h1>
        <div className={styles.listingsCount}>{filteredProperties.length} LISTINGS</div>
      </div>

      <div className={`${styles.filterTags} ${styles.fadeInDelay3}`}>
        {Object.entries(filters).map(([key, value]) => (
          value && value !== '' && (!Array.isArray(value) || value.length > 0) ? (
            <div key={key} className={styles.filterTag}>
              <span>{key}: {Array.isArray(value) ? value.join(', ') : String(value)}</span>
              <button onClick={() => removeFilter(key)} className={styles.removeFilter}>×</button>
            </div>
          ) : null
        ))}
      </div>

      <div className={`${styles.contentWrapper} ${styles.fadeInDelay4}`}>
        <div className={styles.leftSection}>
          <div className={`${styles.propertiesGrid} ${styles.slideInUp}`}>
            {loading ? (
              <div className={styles.loadingContainer}>
                <div className={styles.spinner}></div>
                <p>Loading properties...</p>
              </div>
            ) : filteredProperties.length > 0 ? (
              filteredProperties.map((property, index) => (
                <PropertyGridCard
                  key={property._id || index}
                  property={property}
                  index={index}
                  onClick={handlePropertyClick}
                />
              ))
            ) : (
              <div className={styles.noResults}>
                <h3>No properties found</h3>
                <p>Try adjusting your search criteria or filters.</p>
              </div>
            )}
          </div>
        </div>

        <div className={styles.rightSection}>
          <div className={`${styles.mapContainer} ${styles.slideInRight}`}>
            <PropertiesMap
              properties={filteredProperties}
              onMarkerClick={handleMarkerClick}
              selectedProperty={selectedProperty}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertiesPageClient;