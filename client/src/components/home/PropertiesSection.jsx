import { useNavigate } from "react-router-dom";
import { useProperties } from "../../context/PropertiesContext";
import PropertyCard from "../property/PropertyCard";

const PropertiesSection = () => {
  const { featuredProperties } = useProperties();
  const navigate = useNavigate();

  const handleViewAll = () => {
    navigate('/properties');
  };

  return (
    <section className="py-20 bg-[#0c0d0e]">
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
          {console.log(featuredProperties)}
          {featuredProperties.slice(0, 4).map((property, index) => (
            <PropertyCard key={property._id} index={index} property={property} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PropertiesSection;