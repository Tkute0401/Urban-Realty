import { useState } from 'react';
import { 
  UserIcon, 
  Bars3Icon, 
  XMarkIcon,
  ChevronDownIcon,
  ChevronUpIcon
} from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";

const BlurHeader = () => {
  const navigation = [
    { 
      name: 'CITY', 
      items: ['New York', 'Los Angeles', 'Chicago', 'Miami', 'Houston'] 
    },
    { 
      name: 'PROPERTY', 
      items: ['Apartments', 'Villas', 'Condos', 'Townhouses', 'Commercial'] 
    },
    { 
      name: 'SERVICES', 
      items: ['Valuation', 'Property Management', 'Investment Consulting', 'Interior Design'] 
    },
    { 
      name: 'CONTACT US', 
      items: ['Agents', 'Support', 'Careers', 'Feedback'] 
    }
  ];
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mobileActiveDropdown, setMobileActiveDropdown] = useState(null);
  
  const toggleMobileDropdown = (item) => {
    setMobileActiveDropdown(mobileActiveDropdown === item ? null : item);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 lg:px-8 pt-4 sm:pt-5 lg:pt-6"
      >
        <div className="max-w-7xl mx-auto bg-black/70 backdrop-blur-md rounded-3xl border border-white/10 shadow-xl">
          <div className="px-6 sm:px-8 lg:px-10 h-16 sm:h-20 lg:h-24 flex items-center justify-between">
            <div className="flex items-center gap-3 sm:gap-4">
              <img 
                src="/vite.png" 
                alt="Logo" 
                className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 transition-all duration-300 hover:scale-105" 
              />
            </div>

            <nav className="hidden xl:flex gap-8 xl:gap-10">
              {navigation.map((item) => (
                <div key={item.name} className="relative group">
                  <button className="flex items-center gap-1 font-poppins text-base xl:text-lg font-medium text-white hover:text-[#78cadc] transition-colors duration-300">
                    {item.name}
                    <ChevronDownIcon className="w-4 h-4 group-hover:rotate-180 transition-transform duration-300" />
                  </button>

                  <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                    <div className="bg-[#08171A]/95 backdrop-blur-lg rounded-xl shadow-2xl border border-white/10 overflow-hidden">
                      {item.items.map((subItem) => (
                        <a
                          key={subItem}
                          href="#"
                          className="block px-4 py-3 text-white/90 hover:text-white hover:bg-white/10 transition-colors duration-200 border-b border-white/5 last:border-0"
                        >
                          {subItem}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </nav>

            <div className="flex items-center gap-3 sm:gap-4">
              <button className="hidden xl:flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg text-white bg-transparent border border-white hover:bg-[#78cadc]/10 hover:border-[#78cadc] transition-colors duration-300 group">
                <UserIcon className="w-4 h-4 sm:w-5 sm:h-5 text-white group-hover:text-[#78cadc] transition-colors" />
                <span className="font-poppins font-semibold text-sm sm:text-base">ACCOUNT</span>
              </button>

              <button 
                className="xl:hidden p-2 text-white hover:bg-white/10 rounded-lg transition-colors duration-300"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? (
                  <XMarkIcon className="w-6 h-6 sm:w-7 sm:h-7" />
                ) : (
                  <Bars3Icon className="w-6 h-6 sm:w-7 sm:h-7" />
                )}
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Enhanced Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed top-20 sm:top-24 left-4 right-4 z-40 bg-[#08171A]/95 backdrop-blur-lg rounded-2xl border border-[#78cadc]/30 shadow-xl xl:hidden"
          >
            <div className="flex flex-col p-4 sm:p-5">
              {navigation.map((item) => (
                <div key={item.name} className="mb-2 last:mb-0">
                  <button
                    onClick={() => toggleMobileDropdown(item.name)}
                    className="w-full flex items-center justify-between px-4 py-3 text-white hover:bg-[#78cadc]/10 rounded-lg transition-colors duration-200"
                  >
                    <span className="font-poppins text-lg sm:text-xl font-medium">{item.name}</span>
                    {mobileActiveDropdown === item.name ? (
                      <ChevronUpIcon className="w-5 h-5 text-[#78cadc]" />
                    ) : (
                      <ChevronDownIcon className="w-5 h-5 text-[#78cadc]" />
                    )}
                  </button>

                  <AnimatePresence>
                    {mobileActiveDropdown === item.name && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="pl-4 py-2 space-y-2">
                          {item.items.map((subItem) => (
                            <a
                              key={subItem}
                              href="#"
                              className="block px-4 py-2 text-white/80 hover:text-white hover:bg-[#78cadc]/10 rounded-lg transition-colors duration-200"
                            >
                              {subItem}
                            </a>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
              <button 
                className="xl:hidden flex items-center justify-center gap-2 px-4 py-3 mt-2 rounded-lg text-white bg-[#78cadc]/10 border border-[#78cadc]/30 hover:bg-[#78cadc]/20 transition-colors"
              >
                <UserIcon className="w-5 h-5 sm:w-6 sm:h-6 text-[#78cadc]" />
                <span className="font-poppins font-semibold">ACCOUNT</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default BlurHeader;