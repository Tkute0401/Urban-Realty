import React from "react";
import HeroSection from "../../components/home/HeroSection";
import PropertiesSection from "../../components/home/PropertiesSection";
import OwnerServiceBlock from "../../components/home/OwnerServiceBox";
import ServiceBlock from "../../components/home/ServiceBlock";
import Reviews from "../../components/common/footer/Reviews";
import { Button } from "@mui/material";

const Home = () => {
  return (
    <div className="font-poppins bg-[#0c0d0e] text-white">
      <HeroSection />
      <PropertiesSection
      />
      <ServiceBlock 
        title="BUY A HOME"
        subtitle="Find, Buy & Own Your"
        buttonText="Explore Buying"
        propertyType="Home"
      />
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
      <OwnerServiceBlock />
      <div className="bg-[#0c0d0e]">
        <Button 
          variant="contained" 
          className="bg-[#78cadc] text-[#0c0d0e] font-bold px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl hover:bg-[#8DD9E5] transition-colors shadow-lg text-sm sm:text-base"
          onClick={() => window.location.href = "/developers"}
        >
          Developers
        </Button>
      </div>
      <Reviews />
    </div>
  );
};

export default Home;