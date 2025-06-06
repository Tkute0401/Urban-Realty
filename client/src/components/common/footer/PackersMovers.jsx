import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { TruckIcon, CubeIcon, ShieldCheckIcon, HomeIcon, ClockIcon } from '@heroicons/react/24/outline';

const PackersMovers = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const services = [
    {
      icon: <CubeIcon className="w-8 h-8 text-[#78cadc]" />,
      title: "Professional Packing",
      description: "Expert packing using high-quality materials to ensure complete protection of your belongings"
    },
    {
      icon: <TruckIcon className="w-8 h-8 text-[#78cadc]" />,
      title: "Safe Transportation",
      description: "GPS-enabled vehicles with trained personnel for secure relocation"
    },
    {
      icon: <HomeIcon className="w-8 h-8 text-[#78cadc]" />,
      title: "Unpacking & Setup",
      description: "We unpack and arrange your items at your new location as per your preference"
    },
    {
      icon: <ShieldCheckIcon className="w-8 h-8 text-[#78cadc]" />,
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
    <div className="bg-[#08171A] text-white min-h-screen">
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
            <TruckIcon className="w-10 h-10 text-[#78cadc] mr-3" />
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold font-poppins">
              Packers & <span className="text-[#78cadc]">Movers</span>
            </h1>
          </div>
          <p className="text-lg sm:text-xl max-w-2xl mx-auto text-gray-300">
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
            Our Relocation <span className="text-[#78cadc]">Services</span>
          </h2>
          <p className="text-gray-400 max-w-3xl mx-auto text-lg">
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
              className="bg-[#0c2327] p-8 rounded-xl border border-[#78cadc]/20 hover:border-[#78cadc]/50 transition-all h-full"
            >
              <div className="mb-4">{service.icon}</div>
              <h3 className="text-xl font-bold mb-3">{service.title}</h3>
              <p className="text-gray-400">{service.description}</p>
            </motion.div>
          ))}
        </div>

        {/* How It Works */}
        <div className="mb-20">
          <h3 className="text-2xl font-bold mb-12 text-center font-poppins">
            How It <span className="text-[#78cadc]">Works</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="bg-[#0c2327] p-8 rounded-xl border border-[#78cadc]/20 text-center"
            >
              <div className="bg-[#78cadc] w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <ClockIcon className="w-6 h-6 text-[#08171A]" />
              </div>
              <h4 className="text-lg font-bold mb-2">Schedule Your Move</h4>
              <p className="text-gray-400">
                Book online or call us to schedule your moving date
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-[#0c2327] p-8 rounded-xl border border-[#78cadc]/20 text-center"
            >
              <div className="bg-[#78cadc] w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <CubeIcon className="w-6 h-6 text-[#08171A]" />
              </div>
              <h4 className="text-lg font-bold mb-2">We Pack & Load</h4>
              <p className="text-gray-400">
                Our team carefully packs and loads your belongings
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
              className="bg-[#0c2327] p-8 rounded-xl border border-[#78cadc]/20 text-center"
            >
              <div className="bg-[#78cadc] w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <HomeIcon className="w-6 h-6 text-[#08171A]" />
              </div>
              <h4 className="text-lg font-bold mb-2">Deliver & Unpack</h4>
              <p className="text-gray-400">
                We transport and unpack at your new location
              </p>
            </motion.div>
          </div>
        </div>

        {/* Pricing Plans */}
        <div className="mb-20">
          <h3 className="text-2xl font-bold mb-12 text-center font-poppins">
            Pricing <span className="text-[#78cadc]">Plans</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`bg-[#0c2327] rounded-xl overflow-hidden border ${plan.bestValue ? 'border-[#78cadc]' : 'border-[#78cadc]/20'}`}
              >
                {plan.bestValue && (
                  <div className="bg-[#78cadc] text-[#08171A] text-center py-2 font-bold">
                    BEST VALUE
                  </div>
                )}
                <div className="p-8">
                  <h4 className="text-xl font-bold mb-2 text-center">{plan.name}</h4>
                  <p className="text-3xl font-bold text-[#78cadc] mb-6 text-center">{plan.price}</p>
                  <ul className="space-y-3">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start">
                        <div className="w-1.5 h-1.5 mt-2 mr-2 bg-[#78cadc] rounded-full flex-shrink-0"></div>
                        <span className="text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <button className={`mt-6 w-full py-3 rounded-lg font-bold transition-colors ${plan.bestValue ? 'bg-[#78cadc] text-[#08171A] hover:bg-[#8DD9E5]' : 'bg-transparent border border-[#78cadc] text-[#78cadc] hover:bg-[#78cadc]/10'}`}>
                    Book Now
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-[#0c2327] p-8 sm:p-12 rounded-xl border border-[#78cadc]/20 text-center">
          <h3 className="text-2xl sm:text-3xl font-bold mb-6">
            Ready to Move?
          </h3>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
            Get a free quote and let us handle your relocation with care
          </p>
          <button className="bg-[#78cadc] hover:bg-[#8DD9E5] text-[#08171A] font-bold py-3 px-8 rounded-lg transition-colors shadow-lg">
            Get Free Quote
          </button>
        </div>
      </section>
    </div>
  );
};

export default PackersMovers;