'use client'

import PropertiesExplorer from '@/components/property/PropertiesExplorer';

// const PropertyCard = ({ property }) => {

//   useEffect(() => {
//     window.scrollTo(0, 0);
//   }, []);

//   const [isHovered, setIsHovered] = useState(false);

//   return (
//     <div
//       className="property-card"
//       onMouseEnter={() => setIsHovered(true)}
//       onMouseLeave={() => setIsHovered(false)}
//     >
//       <div className="property-image-container">
//         <img src={(Array.isArray(property.images) ? (typeof property.images[0] === 'string' ? property.images[0] : property.images[0]?.url) : '') || '/placeholder-property.jpg'} alt={property.title} className="property-image" />
//         <div className="property-image-overlay">
//           <div className="property-image-actions">
//             <button className="image-action-btn">
//               <Add fontSize="small" />
//             </button>
//             <button className="image-action-btn">
//               <FavoriteBorder fontSize="small" />
//             </button>
//           </div>
//         </div>
//       </div>

//       <div className="property-details">
//         <div className="property-price">${property.price?.toLocaleString?.() || (typeof property.price === 'number' ? property.price.toLocaleString() : '')}</div>
//         <div className="property-specs">
//           <div className="property-spec">{property.area || property.features?.sqft || 'N/A'} sqft</div>
//           <div className="property-spec-divider">|</div>
//           <div className="property-spec">{property.bedrooms || property.features?.bedrooms || 0} Bed</div>
//           <div className="property-spec-divider">|</div>
//           <div className="property-spec">{property.bathrooms || property.features?.bathrooms || 0} Bath</div>
//         </div>
//         <div className="property-location">
//           {property.address ? `${property.address.street || ''}, ${property.address.city || ''}, ${property.address.state || ''}`.replace(/^,\s*|,\s*$/g, '') : (typeof property.location === 'object'
//             ? `${property.location.address || ''}, ${property.location.city || ''}, ${property.location.state || ''}`.replace(/^,\s*|,\s*$/g, '')
//             : property.location)}
//         </div>
//       </div>
//     </div>
//   );
// };

export default function PropertiesPage() {
  return <PropertiesExplorer />;
}