// Lazy-loaded Property Card Component
import React, { Suspense } from 'react';
import LoadingSpinner from '../common/LoadingSpinner';

// Lazy load the actual PropertyCard component
const PropertyCard = React.lazy(() => import('../property/PropertyCard'));

interface PropertyCardLazyProps {
  property: any;
  className?: string;
}

const PropertyCardLazy: React.FC<PropertyCardLazyProps> = ({ property, className }) => {
  return (
    <Suspense
      fallback={
        <div className={`bg-white rounded-lg shadow-md overflow-hidden ${className}`}>
          <div className="h-48 bg-gray-200 animate-pulse" />
          <div className="p-4">
            <div className="h-4 bg-gray-200 rounded animate-pulse mb-2" />
            <div className="h-3 bg-gray-200 rounded animate-pulse mb-2" />
            <div className="h-3 bg-gray-200 rounded animate-pulse w-2/3" />
          </div>
        </div>
      }
    >
      <PropertyCard property={property} className={className} />
    </Suspense>
  );
};

export default PropertyCardLazy;