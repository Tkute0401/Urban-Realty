// import { ChevronRightIcon } from "@heroicons/react/24/outline";

// // Service Block for Homes and Properties
// const ServiceBlock = ({ title, subtitle, buttonText, imageRight = false }) => {
//   // Safely determine whether to show "Plots/Land." or "Home."
//   const endingText = subtitle && subtitle.includes("Plots/Land") ? "Plots/Land." : "Home.";

//   return (
//     <section className="py-16 bg-gray-900">
//       <div className={`max-w-7xl mx-auto px-8 flex flex-col ${imageRight ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-12`}>
//         <div className="lg:w-1/2 rounded-3xl overflow-hidden">
//           <img src="/api/placeholder/600/400" alt="Nature landscape" className="w-full h-full object-cover" />
//         </div>
        
//         <div className="lg:w-1/2 flex flex-col justify-center">
//           <span className="text-gray-400 font-sans font-bold mb-2">WANT TO {title}?</span>
//           <h2 className="font-serif text-4xl font-bold mb-4 text-white">
//             {subtitle} <span className="text-sky-400">{endingText}</span>
//           </h2>
//           <p className="font-sans text-gray-300 mb-8">
//             EXPLORE FROM APARTMENTS, ROW HOUSES, BUNGALOW AND MANY MORE.
//           </p>
//           <button className="flex items-center gap-2 bg-sky-400 text-gray-900 font-bold px-6 py-3 rounded-lg w-fit hover:bg-sky-300 transition-colors">
//             <span>{buttonText}</span>
//             <ChevronRightIcon className="w-5 h-5" />
//           </button>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default ServiceBlock;

import { ChevronRightIcon } from "@heroicons/react/24/outline";
import ServiceBlckImg from "../../../dist/assets/building_2.jpg";

// Service Block for Homes and Properties
const ServiceBlock = ({ title, subtitle, buttonText, imageRight = false }) => {
  // Determine the section type based on title
  const isBuyHome = title === "BUY A HOME";
  const isRentHome = title === "RENT A HOME";
  const isPlots = title === "BUY PLOTS/LAND";
  
  // Determine the appropriate button text based on section type
  const displayButtonText = isBuyHome ? "Explore Buying" : 
                            isRentHome ? "Explore Renting" : 
                            "Explore Plots/Land";
  
  return (
    <section className="py-16 bg-gray-900">
      <div className={`max-w-7xl mx-auto px-8 flex flex-col ${imageRight ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-12`}>
        <div className="lg:w-1/2 rounded-3xl overflow-hidden">
          {/* Using placeholder image for demonstration */}
          <img 
            src={ServiceBlckImg} 
            alt="Property landscape" 
            className="w-full h-full object-cover" 
          />
        </div>
        
        <div className="lg:w-1/2 flex flex-col justify-center">
          <span className="text-gray-400 font-sans font-bold mb-2">
            {isPlots ? "WANT TO BUY PLOTS/LAND?" : isRentHome ? "WANT TO RENT A HOME?" : "WANT TO BUY A HOME?"}
          </span>
          
          <h2 className="font-serif text-4xl font-bold mb-4 text-white">
            {isPlots ? (
              <>Residencial & Commercial <span className="text-sky-400">Plots/Land.</span></>
            ) : isRentHome ? (
              <>Rental Homes for <span className="text-sky-400">Everyone.</span></>
            ) : (
              <>Find, Buy & Own <span className="text-sky-400">Your Dream Home.</span></>
            )}
          </h2>
          
          <p className="font-sans text-gray-300 mb-8">
            {isPlots 
              ? "EXPLORE RESIDENTIAL, AGRICULTURAL, INDUSTRIAL AND COMMERCIAL PLOTS/LAND."
              : "EXPLORE FROM APARTMENTS, ROW HOUSES, BUNGALOW AND MANY MORE."}
          </p>
          
          <button className="flex items-center gap-2 bg-sky-400 text-gray-900 font-bold px-6 py-3 rounded-lg w-fit hover:bg-sky-300 transition-colors">
            <span>{displayButtonText}</span>
            <ChevronRightIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default ServiceBlock;