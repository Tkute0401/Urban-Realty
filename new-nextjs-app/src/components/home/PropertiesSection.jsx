'use client'

import { useRouter } from "next/navigation";
import { useProperties } from "@/contexts/PropertiesContext";
import PropertyCard from "./PropertyCard";
import { useEffect } from "react";

const PropertiesSection = () => {
  const { featuredProperties, getFeaturedProperties } = useProperties();
  const router = useRouter();

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
    router.push('/properties');
  };

  return (
    <section className="py-12 sm:py-20 bg-[var(--color-bg-dark)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-4">
          <h2 className="font-poppins text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 sm:mb-0">
            Properties based on <span className="text-[var(--color-primary)]">Your Location</span>
          </h2>
          <button 
            onClick={handleViewAll}
            className="group relative inline-flex items-center px-6 py-3 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-hover)] text-white font-medium text-sm sm:text-base rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 ease-in-out overflow-hidden"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-[var(--color-primary-hover)] to-[var(--color-primary)] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            <span className="relative flex items-center gap-2 text-[var(--color-bg-dark)]">
              View All
              <svg 
                className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M13 7l5 5m0 0l-5 5m5-5H6" 
                />
              </svg>
            </span>
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
