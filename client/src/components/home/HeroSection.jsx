import React, { useState } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { UserIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const [searchText, setSearchText] = useState("");
  const navigate = useNavigate();
  
  const navigation = ['CITY', 'PROPERTY', 'SERVICES', 'CONTACT US'];

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchText.trim()) {
      navigate(`/properties?search=${searchText.trim()}`);
    }
  };

  return (
    <section className="h-screen relative flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <img 
          src="/building_5.jpg"
          alt="City skyline at night" 
          className="w-full h-full object-cover"
        />
      </div>

      <div className="absolute inset-x-8 top-4 bottom-16 rounded-3xl mx-40 overflow-hidden">
        <div className="absolute inset-0 bg-white/10 backdrop-blur"></div>
        
        <div className="relative w-full max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 21H21M5 21V7L13 3V21M19 21V11L13 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="font-poppins text-2xl font-bold text-white">UR 360</span>
            </div>

            <nav className="hidden lg:flex gap-10">
              {navigation.map((item) => (
                <a
                  key={item}
                  className="font-poppins text-lg font-medium text-white hover:text-[#78cadc] transition-colors duration-200 cursor-pointer"
                >
                  {item}
                </a>
              ))}
            </nav>

            <button onClick={() => navigate('/profile')} className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-white bg-transparent border border-white hover:bg-white/10 transition-colors">
              <UserIcon className="w-5 h-5 text-white" />
              <span className="font-poppins font-semibold">ACCOUNT</span>
            </button>
          </div>
        </div>

        <div className="relative h-full flex items-center">
          <div className="w-full max-w-7xl mx-auto px-8">
            <div className="text-center mb-16">
              <h1 className="font-poppins text-6xl leading-tight font-bold mb-2 text-white">
                Find Your <br />Perfect <span className="text-[#78cadc]">Spot.</span>
              </h1>
              
              <p className="text-gray-300 mb-8 max-w-xl mx-auto">
                Discover your dream property from our extensive collection of 
                homes, apartments, and commercial spaces across the country.
              </p>
            </div>

            <div className="flex items-center justify-between">
              <div className="w-32 h-32 rounded-full overflow-hidden border border-gray-700/50">
                <img 
                  src="/building_1.jpg" 
                  alt="Map view" 
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="text-white text-sm text-center px-4 max-w-lg">
                <p className="mb-1">EXPERIENCE THE PERFECT BLEND OF COMFORT AND</p>
                <p>NATURE, CRAFTED FOR YOUR ULTIMATE ESCAPE.</p>
              </div>
              
              <div className="bg-white/0 p-4 rounded-xl">
                <div className="flex gap-1 mb-1 items-center">
                  <span className="text-yellow-400 text-3xl">★</span>
                  <span className="text-white text-5xl font-bold">4.9</span>
                </div>
                <span className="text-sm font-poppins text-gray-300">FROM 6,900+ CUSTOMERS</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <form onSubmit={handleSearch} className="absolute bottom-16 left-0 right-0 flex justify-center" style={{ transform: "translateY(50%)" }}>
        <div className="max-w-2xl w-full mx-8">
          <div className="relative flex items-center px-6 py-4 rounded-full bg-white/20 backdrop-blur-sm border-0">
            <MagnifyingGlassIcon className="w-6 h-6 text-white mr-3" />
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Didn't find what you're looking for? Try searching here..."
              className="w-full bg-transparent outline-none text-white placeholder:text-gray-400 border-0"
            />
          </div>
          

        </div>
      </form>
      <div className="absolute bottom-0 left-0 w-full h-10 bg-gradient-to-b from-transparent to-[#08171A] pointer-events-none"></div>
    </section>
  );
};

export default HeroSection;