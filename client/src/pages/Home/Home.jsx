import React from "react";
import HeroSection from "../../components/home/HeroSection";
import PropertiesSection from "../../components/home/PropertiesSection";
import OwnerServiceBlock from "../../components/home/OwnerServiceBox";
import ServiceBlock from "../../components/home/ServiceBlock";

const Home = () => {
  return (
    <div className="font-sans bg-[#0c0d0e] text-white">
      <HeroSection />
      <PropertiesSection />
      <ServiceBlock 
        title="BUY A HOME"
        subtitle="Find, Buy & Own Your"
        buttonText="Explore Buying"
        propertyType="Home"
      />
      <OwnerServiceBlock />
      <ServiceBlock 
        title="RENT A HOME" 
        subtitle="Rental Homes for Everyone" 
        buttonText="Explore Renting" 
        imageRight={true}
        propertyType="Home"
      />
      <ServiceBlock 
        title="BUY PLOTS/LAND" 
        subtitle="Residential & Commercial" 
        buttonText="Explore Plots/Land" 
        propertyType="Land"
      />
    </div>
  );
};

export default Home;