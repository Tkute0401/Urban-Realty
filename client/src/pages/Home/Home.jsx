// // Main Page Component
// import React from "react";
// import BlurHeader from "../../components/home/BlurHeader";
// import HeroSection from "../../components/home/HeroSection";
// import PropertiesSection from "../../components/home/PropertiesSection";
// import OwnerServiceBlock from "../../components/home/OwnerServiceBox";
// import ServiceBlock from "../../components/home/ServiceBlock";

// const Home = () => {
//   return (
//     <div className="font-sans bg-gray-900 text-white">
//       {/* <BlurHeader /> */}
//       <HeroSection />
//       <PropertiesSection />
//       <ServiceBlock 
//         title="BUY A HOME"
//         subtitle="Find, Buy & Own Your Dream" 
//         buttonText="Explore Buying" 
//       />
//       <OwnerServiceBlock />
//       <ServiceBlock 
//         title="RENT A HOME" 
//         subtitle="Rental Homes for Everyone." 
//         buttonText="Explore Renting" 
//         imageRight={true}
//       />
//       <ServiceBlock 
//         title="BUY PLOTS/LAND" 
//         subtitle="Residencial & Commercial" 
//         buttonText="Explore Plots/Land" 
//       />
//     </div>
//   );
// };

// export default Home;

// Main Page Component
import React from "react";
import HeroSection from "../../components/home/HeroSection";
import PropertiesSection from "../../components/home/PropertiesSection";
import OwnerServiceBlock from "../../components/home/OwnerServiceBox";
import ServiceBlock from "../../components/home/ServiceBlock";

// Main Page Component
const Home = () => {
  return (
    <div className="font-sans bg-gray-900 text-white">
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
        buttonText="Explore Plots/Land" 
      />
    </div>
  );
};

export default Home;