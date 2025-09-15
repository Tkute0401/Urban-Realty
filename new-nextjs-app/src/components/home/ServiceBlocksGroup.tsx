"use client";

import React from "react";
import ServiceBlock from "@/components/home/ServiceBlock";

const ServiceBlocksGroup: React.FC = () => {
  return (
    <>
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
    </>
  );
};

export default ServiceBlocksGroup;

