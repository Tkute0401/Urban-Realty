import React from "react";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";

const ServiceBlock = ({ 
  title, 
  subtitle, 
  buttonText, 
  imageRight = false,
  propertyType = 'House'
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    const typeMap = {
      'BUY A HOME': 'BUY',
      'RENT A HOME': 'RENT',
      'BUY PLOTS/LAND': 'Land'
    };
    
    navigate(`/properties?propertyType=${typeMap[title] || 'House'}`);
  };

  return (
    <section className="py-16 bg-[#08171A]">
      <div className={`max-w-7xl mx-auto px-8 flex flex-col ${imageRight ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-12`}>
        <div className="lg:w-1/2">
          <div className="rounded-3xl overflow-hidden border border-white">
            <img 
              src="/building_4.jpg" 
              alt={title} 
              className="w-full h-full object-cover" 
            />
          </div>
        </div>
        
        <div className="lg:w-1/2 flex flex-col justify-center">
          <div className="text-right">
            <span className="text-gray-400 font-sans font-bold mb-2 block tracking-wide">
              {title}
            </span>
            
            <h2 className="font-serif text-5xl font-bold mb-4 text-white leading-tight">
              {subtitle} <br />
              <span className="text-[#78cadc]">Dream {propertyType}.</span>
            </h2>
            
            <p className="font-sans text-gray-300 mb-8 tracking-wide">
              EXPLORE FROM APARTMENTS, ROW HOUSES, BUNGALOW AND MANY MORE.
            </p>
            
            <div className="flex justify-end">
              <button 
                className="flex items-center gap-2 bg-[#78cadc] text-[#0c0d0e] font-bold px-6 py-3 rounded-lg hover:bg-sky-300 transition-colors"
                onClick={handleClick}
              >
                <ChevronLeftIcon className="w-5 h-5" />
                <span>{buttonText}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServiceBlock;