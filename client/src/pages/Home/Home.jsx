// Main Page Component
import React from "react";
import BlurHeader from "../../components/home/BlurHeader";
import HeroSection from "../../components/home/HeroSection";
import PropertiesSection from "../../components/home/PropertyCard";
import OwnerServiceBlock from "../../components/home/ServiceBlock";
import ServiceBlock from "../../components/home/ServiceBlock";


// Main Page Component
const Home = () => {
  return (
    <div className="font-sans bg-gray-900 text-white">
      <BlurHeader />
      <HeroSection />
      <PropertiesSection />
      <ServiceBlock 
        title="BUY A HOME"
        subtitle="Find, Buy & Own Your Dream" 
        buttonText="Explore Buying" 
      />
      <OwnerServiceBlock />
      <ServiceBlock 
        title="RENT A HOME" 
        subtitle="Rental Homes for Everyone." 
        buttonText="Explore Renting" 
        imageRight={true}
      />
      <ServiceBlock 
        title="BUY PLOTS/LAND" 
        subtitle="Residencial & Commercial" 
        buttonText="Explore Renting" 
      />
    </div>
  );
};

export default Home;