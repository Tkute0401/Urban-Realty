import { useNavigate } from "react-router-dom";
import { useProperties } from "../../context/PropertiesContext";
import PropertyCard from "./PropertyCard";
import { useEffect } from "react";

const PropertiesSection = () => {
  const { featuredProperties, getFeaturedProperties } = useProperties();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeaturedProperties = async () => {
      try {
        await getFeaturedProperties();
      } catch (error) {
        console.error("Error fetching featured properties:", error);
      }
    };
    
    fetchFeaturedProperties();
  }, [getFeaturedProperties]);

  const handleViewAll = () => {
    navigate('/properties');
  };

  return (
    <section className="py-12 sm:py-20 bg-[#08171A] z-[5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-4">
          <h2 className="font-poppins text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 sm:mb-0">
            Properties based on <span className="text-[#78cadc]">Your Location</span>
          </h2>
          <button 
            onClick={handleViewAll}
            className="text-[#78cadc] hover:text-sky-300 transition-colors text-sm sm:text-base"
          >
            View All →
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mt-6 sm:mt-10">
          {featuredProperties.slice(0, 4).map((property, index) => (
            <PropertyCard key={property._id} index={index} property={property} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PropertiesSection;