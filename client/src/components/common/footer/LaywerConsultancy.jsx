import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ScaleIcon, DocumentTextIcon, ShieldCheckIcon, HomeIcon, BuildingLibraryIcon } from '@heroicons/react/24/outline';

const LawyerConsultancy = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [showForm, setShowForm] = useState(false);

  const services = [
    {
      icon: <DocumentTextIcon className="w-8 h-8 text-[#78cadc]" />,
      title: "Property Documentation",
      description: "Comprehensive verification and preparation of all property documents including title deeds, sale agreements, and registration papers."
    },
    {
      icon: <ShieldCheckIcon className="w-8 h-8 text-[#78cadc]" />,
      title: "Legal Due Diligence",
      description: "Thorough investigation of property legal status, encumbrances, litigation history, and ownership verification."
    },
    {
      icon: <HomeIcon className="w-8 h-8 text-[#78cadc]" />,
      title: "Rental Agreement Drafting",
      description: "Professionally drafted rental agreements that protect both landlords and tenants with clear terms and conditions."
    },
    {
      icon: <BuildingLibraryIcon className="w-8 h-8 text-[#78cadc]" />,
      title: "Loan & Mortgage Assistance",
      description: "Guidance through home loan processes, mortgage documentation, and bank compliance requirements."
    }
  ];

  const processSteps = [
    {
      step: "01",
      title: "Initial Consultation",
      description: "Free 30-minute consultation to understand your property legal needs"
    },
    {
      step: "02",
      title: "Document Collection",
      description: "We guide you on all required documents for your specific case"
    },
    {
      step: "03",
      title: "Legal Verification",
      description: "Our team conducts thorough checks and due diligence"
    },
    {
      step: "04",
      title: "Solution Presentation",
      description: "Detailed report with recommendations and next steps"
    }
  ];

  const handleJoinTeam = () => {
    setShowForm(true);
  };

  return (
    <div className="bg-[#08171A] text-white min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[50vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 to-black/30 z-10" />
        <img 
          src="/lawyer-consultancy.png" 
          alt="Legal Services" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-20 text-center px-4"
        >
          <div className="flex items-center justify-center mb-4">
            <ScaleIcon className="w-10 h-10 text-[#78cadc] mr-3" />
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold font-poppins">
              Legal <span className="text-[#78cadc]">Consultancy</span>
            </h1>
          </div>
          <p className="text-lg sm:text-xl max-w-2xl mx-auto text-gray-300">
            Expert legal guidance for property transactions - ensuring your investment is safe and compliant
          </p>
          <button 
            onClick={handleJoinTeam}
            className="mt-8 border-2 border-[#78cadc] text-[#78cadc] hover:bg-[#78cadc] hover:text-[#08171A] font-bold py-2 px-6 rounded-lg transition-colors"
          >
            Join Our Legal Team
          </button>
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
            Our Legal <span className="text-[#78cadc]">Services</span>
          </h2>
          <p className="text-gray-400 max-w-3xl mx-auto text-lg">
            Navigate property laws with confidence through our comprehensive legal solutions
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

        {/* Process Section */}
        <div className="mb-20">
          <h3 className="text-2xl font-bold mb-8 text-center font-poppins">
            Our <span className="text-[#78cadc]">Process</span>
          </h3>
          <div className="space-y-8">
            {processSteps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex flex-col md:flex-row gap-6 items-center"
              >
                <div className={`flex-shrink-0 ${index % 2 === 0 ? 'md:order-1' : 'md:order-2'}`}>
                  <div className="bg-[#78cadc] text-[#08171A] w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold">
                    {step.step}
                  </div>
                </div>
                <div className={`flex-grow ${index % 2 === 0 ? 'md:order-2 md:text-left' : 'md:order-1 md:text-right'}`}>
                  <h4 className="text-xl font-bold mb-2">{step.title}</h4>
                  <p className="text-gray-400">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-[#0c2327] p-8 sm:p-12 rounded-xl border border-[#78cadc]/20 text-center">
          <h3 className="text-2xl sm:text-3xl font-bold mb-6">
            Need Legal Assistance?
          </h3>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
            Our team of property law experts is ready to guide you through any real estate legal matter
          </p>
          <button className="bg-[#78cadc] hover:bg-[#8DD9E5] text-[#08171A] font-bold py-3 px-8 rounded-lg transition-colors shadow-lg">
            Consult a Lawyer
          </button>
        </div>
      </section>

      {/* Lawyer Application Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#0c2327] rounded-xl p-8 max-w-md w-full border border-[#78cadc]/50 mt-5"
          >
            <h3 className="text-2xl font-bold mb-6">Lawyer Application</h3>
            <p className="text-gray-400 mb-6">
              Please fill out this form to join our team of legal professionals.
            </p>
            <div className="space-y-4 mb-6">
              <input 
                type="text" 
                placeholder="Full Name" 
                className="w-full bg-[#08171A] border border-[#78cadc]/30 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#78cadc]" 
              />
              <input 
                type="email" 
                placeholder="Email" 
                className="w-full bg-[#08171A] border border-[#78cadc]/30 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#78cadc]" 
              />
              <input 
                type="text" 
                placeholder="Bar Association Number" 
                className="w-full bg-[#08171A] border border-[#78cadc]/30 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#78cadc]" 
              />
              <input 
                type="text" 
                placeholder="Years of Practice" 
                className="w-full bg-[#08171A] border border-[#78cadc]/30 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#78cadc]" 
              />
              <select className="w-full bg-[#08171A] border border-[#78cadc]/30 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#78cadc]">
                <option value="">Select Specialization</option>
                <option value="property">Property Law</option>
                <option value="contract">Contract Law</option>
                <option value="realestate">Real Estate Law</option>
                <option value="other">Other</option>
              </select>
              <textarea 
                placeholder="Briefly describe your experience in property law" 
                className="w-full bg-[#08171A] border border-[#78cadc]/30 rounded-lg px-4 py-2 h-24 focus:outline-none focus:ring-2 focus:ring-[#78cadc]"
              ></textarea>
            </div>
            <div className="flex justify-end space-x-3">
              <button 
                onClick={() => setShowForm(false)}
                className="px-4 py-2 border border-[#78cadc] text-[#78cadc] rounded-lg hover:bg-[#78cadc]/10"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  // Handle form submission
                  setShowForm(false);
                }}
                className="px-4 py-2 bg-[#78cadc] text-[#08171A] rounded-lg hover:bg-[#8DD9E5]"
              >
                Submit Application
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default LawyerConsultancy;