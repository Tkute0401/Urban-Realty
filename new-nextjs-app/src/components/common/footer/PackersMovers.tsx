"use client";

import { useEffect, useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { TruckIcon, CubeIcon, ShieldCheckIcon, HomeIcon, ClockIcon } from '@heroicons/react/24/outline';
import ComingSoonPopup from './ComingSoonPopup';
import { ThemeContext } from '@/contexts/ThemeProvider';
import { createThemeColors } from '@/lib/theme/colors';

const PackersMovers = () => {
  const { theme } = useContext(ThemeContext);
  const colors = createThemeColors(theme as 'light' | 'dark');
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [showPopup, setShowPopup] = useState(true);
  const services = [
    {
      icon: <CubeIcon className="w-8 h-8" style={{ color: colors.primary.main }} />,
      title: "Professional Packing",
      description: "Expert packing using high-quality materials to ensure complete protection of your belongings"
    },
    {
      icon: <TruckIcon className="w-8 h-8" style={{ color: colors.primary.main }} />,
      title: "Safe Transportation",
      description: "GPS-enabled vehicles with trained personnel for secure relocation"
    },
    {
      icon: <HomeIcon className="w-8 h-8" style={{ color: colors.primary.main }} />,
      title: "Unpacking & Setup",
      description: "We unpack and arrange your items at your new location as per your preference"
    },
    {
      icon: <ShieldCheckIcon className="w-8 h-8" style={{ color: colors.primary.main }} />,
      title: "Insurance Coverage",
      description: "All shipments come with basic insurance coverage (optional upgrades available)"
    }
  ];

  const pricingPlans = [
    {
      name: "Basic",
      price: "₹5,000",
      features: [
        "Packing materials provided",
        "1 BHK relocation",
        "Local moving",
        "1 loading/unloading helper"
      ],
      bestValue: false
    },
    {
      name: "Standard",
      price: "₹10,000",
      features: [
        "Professional packing service",
        "2 BHK relocation",
        "Inter-city moving",
        "2 loading/unloading helpers",
        "Basic insurance"
      ],
      bestValue: true
    },
    {
      name: "Premium",
      price: "₹18,000",
      features: [
        "Complete packing & unpacking",
        "3+ BHK relocation",
        "State-wide moving",
        "4+ loading/unloading helpers",
        "Enhanced insurance",
        "Priority scheduling"
      ],
      bestValue: false
    }
  ];

  return (
    <div 
      className="min-h-screen"
      style={{ 
        backgroundColor: colors.bg.primary, 
        color: colors.text.primary 
      }}
    >
      {/* Coming soon popup */}
      <ComingSoonPopup isOpen={showPopup} onClose={() => setShowPopup(false)} />
        
      {/* Hero Section */}
      <section className="relative h-[50vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 to-black/30 z-10" />
        <img 
          src="/packers-movers.png" 
          alt="Packers & Movers" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-20 text-center px-4"
        >
          <div className="flex items-center justify-center mb-4">
            <TruckIcon className="w-10 h-10 mr-3" style={{ color: '#F76B1C' }} />
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold font-poppins text-white">
              Packers & <span style={{ color: '#F76B1C' }}>Movers</span>
            </h1>
          </div>
          <p className="text-lg sm:text-xl max-w-2xl mx-auto text-gray-200">
            Stress-free relocation services with complete packing, moving, and unpacking solutions
          </p>
        </motion.div>
      </section>

      {/* Services Section */}
      <section className="py-16 px-4 sm:px-8 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="mb-16 text-center"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-6 font-poppins">
            Our Relocation <span style={{ color: colors.primary.main }}>Services</span>
          </h2>
          <p 
            className="max-w-3xl mx-auto text-lg"
            style={{ color: colors.text.muted }}
          >
            Comprehensive moving solutions tailored to your specific needs
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="p-8 rounded-xl border transition-all h-full hover:border-opacity-50"
              style={{ 
                backgroundColor: colors.bg.secondary,
                borderColor: `${colors.primary.main}33`
              }}
            >
              <div className="mb-4">{service.icon}</div>
              <h3 className="text-xl font-bold mb-3" style={{ color: colors.text.primary }}>{service.title}</h3>
              <p style={{ color: colors.text.muted }}>{service.description}</p>
            </motion.div>
          ))}
        </div>

        {/* How It Works */}
        <div className="mb-20">
          <h3 className="text-2xl font-bold mb-12 text-center font-poppins">
            How It <span style={{ color: colors.primary.main }}>Works</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="p-8 rounded-xl border text-center"
              style={{ 
                backgroundColor: colors.bg.secondary,
                borderColor: `${colors.primary.main}33`
              }}
            >
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ backgroundColor: colors.primary.main }}
              >
                <ClockIcon className="w-6 h-6" style={{ color: colors.primary.contrast }} />
              </div>
              <h4 className="text-lg font-bold mb-2" style={{ color: colors.text.primary }}>Schedule Your Move</h4>
              <p style={{ color: colors.text.muted }}>
                Book online or call us to schedule your moving date
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="p-8 rounded-xl border text-center"
              style={{ 
                backgroundColor: colors.bg.secondary,
                borderColor: `${colors.primary.main}33`
              }}
            >
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ backgroundColor: colors.primary.main }}
              >
                <CubeIcon className="w-6 h-6" style={{ color: colors.primary.contrast }} />
              </div>
              <h4 className="text-lg font-bold mb-2" style={{ color: colors.text.primary }}>We Pack & Load</h4>
              <p style={{ color: colors.text.muted }}>
                Our team carefully packs and loads your belongings
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
              className="p-8 rounded-xl border text-center"
              style={{ 
                backgroundColor: colors.bg.secondary,
                borderColor: `${colors.primary.main}33`
              }}
            >
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ backgroundColor: colors.primary.main }}
              >
                <HomeIcon className="w-6 h-6" style={{ color: colors.primary.contrast }} />
              </div>
              <h4 className="text-lg font-bold mb-2" style={{ color: colors.text.primary }}>Deliver & Unpack</h4>
              <p style={{ color: colors.text.muted }}>
                We transport and unpack at your new location
              </p>
            </motion.div>
          </div>
        </div>

        {/* Pricing Plans */}
        <div className="mb-20">
          <h3 className="text-2xl font-bold mb-12 text-center font-poppins">
            Pricing <span style={{ color: colors.primary.main }}>Plans</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="rounded-xl overflow-hidden border"
                style={{ 
                  backgroundColor: colors.bg.secondary,
                  borderColor: plan.bestValue ? colors.primary.main : `${colors.primary.main}33`
                }}
              >
                {plan.bestValue && (
                  <div 
                    className="text-center py-2 font-bold"
                    style={{ 
                      backgroundColor: colors.primary.main,
                      color: colors.primary.contrast
                    }}
                  >
                    BEST VALUE
                  </div>
                )}
                <div className="p-8">
                  <h4 className="text-xl font-bold mb-2 text-center" style={{ color: colors.text.primary }}>{plan.name}</h4>
                  <p className="text-3xl font-bold mb-6 text-center" style={{ color: colors.primary.main }}>{plan.price}</p>
                  <ul className="space-y-3">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start">
                        <div 
                          className="w-1.5 h-1.5 mt-2 mr-2 rounded-full flex-shrink-0"
                          style={{ backgroundColor: colors.primary.main }}
                        ></div>
                        <span style={{ color: colors.text.secondary }}>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <button 
                    className="mt-6 w-full py-3 rounded-lg font-bold transition-colors"
                    style={plan.bestValue ? {
                      backgroundColor: colors.primary.main,
                      color: colors.primary.contrast
                    } : {
                      backgroundColor: 'transparent',
                      border: `1px solid ${colors.primary.main}`,
                      color: colors.primary.main
                    }}
                  >
                    Book Now
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div 
          className="p-8 sm:p-12 rounded-xl border text-center"
          style={{ 
            backgroundColor: colors.bg.secondary,
            borderColor: `${colors.primary.main}33`
          }}
        >
          <h3 className="text-2xl sm:text-3xl font-bold mb-6" style={{ color: colors.text.primary }}>
            Ready to Move?
          </h3>
          <p className="mb-8 max-w-2xl mx-auto" style={{ color: colors.text.muted }}>
            Get a free quote and let us handle your relocation with care
          </p>
          <button 
            className="font-bold py-3 px-8 rounded-lg transition-colors shadow-lg"
            style={{ 
              backgroundColor: colors.primary.main,
              color: colors.primary.contrast
            }}
          >
            Get Free Quote
          </button>
        </div>
      </section>
    </div>
  );
};

export default PackersMovers;