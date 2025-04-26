import { useNavigate } from "react-router-dom";
import { useProperties } from "../../context/PropertiesContext";
import PropertyCard from "./PropertyCard";
import { useEffect } from "react"; // Add this import

const PropertiesSection = () => {
  const { featuredProperties, getFeaturedProperties } = useProperties(); // Destructure getFeaturedProperties
  const navigate = useNavigate();

  // Add this useEffect to fetch featured properties on component mount
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
    <section className="py-20 bg-[#08171A]">
      <div className="max-w-7xl mx-auto px-8">
        <div className="flex justify-between items-center">
          <h2 className="font-serif text-4xl font-bold text-white mb-4">
            Properties based on <span className="text-[#78cadc]">Your Location</span>
          </h2>
          <button 
            onClick={handleViewAll}
            className="text-[#78cadc] hover:text-sky-300 transition-colors"
          >
            View All →
          </button>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
          {featuredProperties.slice(0, 4).map((property, index) => (
            <PropertyCard key={property._id} index={index} property={property} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PropertiesSection;