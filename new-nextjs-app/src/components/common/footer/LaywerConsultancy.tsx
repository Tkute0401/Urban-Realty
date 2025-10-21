"use client";

import { useEffect, useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { ScaleIcon, DocumentTextIcon, ShieldCheckIcon, HomeIcon, BuildingLibraryIcon } from '@heroicons/react/24/outline';
import ComingSoonPopup from './ComingSoonPopup';
import { ThemeContext } from '@/contexts/ThemeProvider';
import { createThemeColors } from '@/lib/theme/colors';

const LawyerConsultancy = () => {
  const { theme } = useContext(ThemeContext);
  const colors = createThemeColors(theme as 'light' | 'dark');
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [showForm, setShowForm] = useState(false);
  const [showPopup, setShowPopup] = useState(true);

  const services = [
    {
      icon: <DocumentTextIcon className="w-8 h-8" style={{ color: colors.primary.main }} />,
      title: "Property Documentation",
      description: "Comprehensive verification and preparation of all property documents including title deeds, sale agreements, and registration papers."
    },
    {
      icon: <ShieldCheckIcon className="w-8 h-8" style={{ color: colors.primary.main }} />,
      title: "Legal Due Diligence",
      description: "Thorough investigation of property legal status, encumbrances, litigation history, and ownership verification."
    },
    {
      icon: <HomeIcon className="w-8 h-8" style={{ color: colors.primary.main }} />,
      title: "Rental Agreement Drafting",
      description: "Professionally drafted rental agreements that protect both landlords and tenants with clear terms and conditions."
    },
    {
      icon: <BuildingLibraryIcon className="w-8 h-8" style={{ color: colors.primary.main }} />,
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
            <ScaleIcon className="w-10 h-10 mr-3" style={{ color: '#F76B1C' }} />
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold font-poppins text-white">
              Legal <span style={{ color: '#F76B1C' }}>Consultancy</span>
            </h1>
          </div>
          <p className="text-lg sm:text-xl max-w-2xl mx-auto text-gray-200">
            Expert legal guidance for property transactions - ensuring your investment is safe and compliant
          </p>
          <button 
            onClick={handleJoinTeam}
            className="mt-8 border-2 font-bold py-2 px-6 rounded-lg transition-colors"
            style={{ 
              borderColor: colors.primary.main,
              color: colors.primary.main,
              backgroundColor: 'transparent'
            }}
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
            Our Legal <span style={{ color: colors.primary.main }}>Services</span>
          </h2>
          <p 
            className="max-w-3xl mx-auto text-lg"
            style={{ color: colors.text.muted }}
          >
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

        {/* Process Section */}
        <div className="mb-20">
          <h3 className="text-2xl font-bold mb-8 text-center font-poppins">
            Our <span style={{ color: colors.primary.main }}>Process</span>
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
                  <div 
                    className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold"
                    style={{ 
                      backgroundColor: colors.primary.main,
                      color: colors.primary.contrast
                    }}
                  >
                    {step.step}
                  </div>
                </div>
                <div className={`flex-grow ${index % 2 === 0 ? 'md:order-2 md:text-left' : 'md:order-1 md:text-right'}`}>
                  <h4 className="text-xl font-bold mb-2" style={{ color: colors.text.primary }}>{step.title}</h4>
                  <p style={{ color: colors.text.muted }}>{step.description}</p>
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
            Need Legal Assistance?
          </h3>
          <p 
            className="mb-8 max-w-2xl mx-auto"
            style={{ color: colors.text.muted }}
          >
            Our team of property law experts is ready to guide you through any real estate legal matter
          </p>
          <button 
            className="font-bold py-3 px-8 rounded-lg transition-colors shadow-lg"
            style={{ 
              backgroundColor: colors.primary.main,
              color: colors.primary.contrast
            }}
          >
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
            className="rounded-xl p-8 max-w-md w-full border mt-5"
            style={{ 
              backgroundColor: colors.bg.secondary,
              borderColor: `${colors.primary.main}80`
            }}
          >
            <h3 className="text-2xl font-bold mb-6" style={{ color: colors.text.primary }}>Lawyer Application</h3>
            <p 
              className="mb-6"
              style={{ color: colors.text.muted }}
            >
              Please fill out this form to join our team of legal professionals.
            </p>
            <div className="space-y-4 mb-6">
              <input 
                type="text" 
                placeholder="Full Name" 
                className="w-full rounded-lg px-4 py-2 focus:outline-none focus:ring-2"
                style={{ 
                  backgroundColor: colors.bg.primary,
                  borderColor: `${colors.primary.main}50`,
                  color: colors.text.primary
                }}
              />
              <input 
                type="email" 
                placeholder="Email" 
                className="w-full rounded-lg px-4 py-2 focus:outline-none focus:ring-2"
                style={{ 
                  backgroundColor: colors.bg.primary,
                  borderColor: `${colors.primary.main}50`,
                  color: colors.text.primary
                }}
              />
              <input 
                type="text" 
                placeholder="Bar Association Number" 
                className="w-full rounded-lg px-4 py-2 focus:outline-none focus:ring-2"
                style={{ 
                  backgroundColor: colors.bg.primary,
                  borderColor: `${colors.primary.main}50`,
                  color: colors.text.primary
                }}
              />
              <input 
                type="text" 
                placeholder="Years of Practice" 
                className="w-full rounded-lg px-4 py-2 focus:outline-none focus:ring-2"
                style={{ 
                  backgroundColor: colors.bg.primary,
                  borderColor: `${colors.primary.main}50`,
                  color: colors.text.primary
                }}
              />
              <select 
                className="w-full rounded-lg px-4 py-2 focus:outline-none focus:ring-2"
                style={{ 
                  backgroundColor: colors.bg.primary,
                  borderColor: `${colors.primary.main}50`,
                  color: colors.text.primary
                }}
              >
                <option value="">Select Specialization</option>
                <option value="property">Property Law</option>
                <option value="contract">Contract Law</option>
                <option value="realestate">Real Estate Law</option>
                <option value="other">Other</option>
              </select>
              <textarea 
                placeholder="Briefly describe your experience in property law" 
                className="w-full rounded-lg px-4 py-2 h-24 focus:outline-none focus:ring-2"
                style={{ 
                  backgroundColor: colors.bg.primary,
                  borderColor: `${colors.primary.main}50`,
                  color: colors.text.primary
                }}
              ></textarea>
            </div>
            <div className="flex justify-end space-x-3">
              <button 
                onClick={() => setShowForm(false)}
                className="px-4 py-2 border rounded-lg"
                style={{ 
                  borderColor: colors.primary.main,
                  color: colors.primary.main,
                  backgroundColor: 'transparent'
                }}
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  // Handle form submission
                  setShowForm(false);
                }}
                className="px-4 py-2 rounded-lg"
                style={{ 
                  backgroundColor: colors.primary.main,
                  color: colors.primary.contrast
                }}
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