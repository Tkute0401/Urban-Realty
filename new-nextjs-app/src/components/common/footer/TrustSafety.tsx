"use client";

import { motion } from "framer-motion";
import { ShieldCheckIcon, LockClosedIcon, CheckBadgeIcon, HandRaisedIcon, EyeIcon } from "@heroicons/react/24/outline";
import { useEffect, useContext } from "react";
import { ThemeContext } from '@/contexts/ThemeProvider';
import { createThemeColors } from '@/lib/theme/colors';

const TrustSafety = () => {
  const { theme } = useContext(ThemeContext);
  const colors = createThemeColors(theme as 'light' | 'dark');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo(0, 0);
    }
  }, []);
  
  const features = [
    {
      icon: <ShieldCheckIcon className="w-8 h-8" style={{ color: colors.primary.main }} />,
      title: "Verified Listings",
      description: "Every property undergoes rigorous verification to ensure accuracy and authenticity",
      details: [
        "On-site inspections by certified professionals",
        "Document verification for ownership and legal status",
        "Regular updates to maintain listing accuracy"
      ]
    },
    {
      icon: <LockClosedIcon className="w-8 h-8" style={{ color: colors.primary.main }} />,
      title: "Secure Transactions",
      description: "Your financial safety is our top priority during every transaction",
      details: [
        "256-bit SSL encryption for all data transfers",
        "Escrow services for secure fund handling",
        "Fraud detection systems monitoring 24/7"
      ]
    },
    {
      icon: <CheckBadgeIcon className="w-8 h-8" style={{ color: colors.primary.main }} />,
      title: "Vetted Professionals",
      description: "We partner only with the most reputable agents and service providers",
      details: [
        "Background checks and license verification",
        "Performance reviews and client feedback analysis",
        "Ongoing training on ethics and compliance"
      ]
    },
    {
      icon: <HandRaisedIcon className="w-8 h-8" style={{ color: colors.primary.main }} />,
      title: "Transparent Pricing",
      description: "No hidden fees or surprise charges in any of our services",
      details: [
        "Clear breakdown of all costs upfront",
        "Price comparison tools for market awareness",
        "Fixed-fee options where available"
      ]
    },
    {
      icon: <EyeIcon className="w-8 h-8" style={{ color: colors.primary.main }} />,
      title: "Continuous Monitoring",
      description: "Our systems work around the clock to protect your interests",
      details: [
        "AI-powered anomaly detection",
        "Dedicated trust & safety team",
        "Immediate response protocols"
      ]
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
      {/* Hero Section */}
      <section className="relative h-[50vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 to-black/30 z-10" />
        <img 
          src="/trust-safety-2.png" 
          alt="Trust & Safety" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-20 text-center px-4"
        >
          <div className="flex items-center justify-center mb-4">
            <ShieldCheckIcon className="w-10 h-10 mr-3" style={{ color: '#F76B1C' }} />
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold font-poppins text-white">
              Trust & <span style={{ color: '#F76B1C' }}>Safety</span>
            </h1>
          </div>
          <p className="text-lg sm:text-xl max-w-2xl mx-auto text-gray-200">
            Your security and peace of mind are at the heart of everything we do
          </p>
        </motion.div>
      </section>

      {/* Commitment Section */}
      <section className="py-16 px-4 sm:px-8 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="mb-16 text-center"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-6 font-poppins">
            Our <span style={{ color: colors.primary.main }}>Commitment</span> to You
          </h2>
          <p 
            className="max-w-4xl mx-auto text-lg"
            style={{ color: colors.text.muted }}
          >
            At SQUAREFOOT, we&apos;ve built our reputation on trust and integrity. We go beyond industry standards to 
            create the safest real estate marketplace, combining cutting-edge technology with human expertise to protect 
            your transactions and personal information.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {features.map((feature, index) => (
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
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold mb-3" style={{ color: colors.text.primary }}>{feature.title}</h3>
              <p className="mb-4" style={{ color: colors.text.muted }}>{feature.description}</p>
              <ul className="space-y-2">
                {feature.details.map((detail, i) => (
                  <li key={i} className="flex items-start">
                    <div 
                      className="w-1 h-1 mt-2 mr-2 rounded-full flex-shrink-0"
                      style={{ backgroundColor: colors.primary.main }}
                    ></div>
                    <span className="text-sm" style={{ color: colors.text.secondary }}>{detail}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Protection Banner */}
        <div className="relative rounded-2xl overflow-hidden mb-16">
          <div 
            className="absolute inset-0 opacity-90"
            style={{ 
              background: `linear-gradient(to right, ${colors.primary.main}, ${colors.primary.light})`
            }}
          ></div>
          <div 
            className="relative z-10 p-8 sm:p-12"
            style={{ color: colors.primary.contrast }}
          >
            <div className="max-w-4xl mx-auto">
              <h3 className="text-2xl sm:text-3xl font-bold mb-6">
                Comprehensive Protection at Every Step
              </h3>
              <p className="mb-8">
                From your first property search to closing day and beyond, our multi-layered security measures ensure 
                you&apos;re protected throughout your real estate journey.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div 
                  className="p-4 rounded-lg backdrop-blur-sm"
                  style={{ backgroundColor: `${colors.primary.contrast}20` }}
                >
                  <div className="text-2xl font-bold mb-1">100%</div>
                  <div className="text-sm">Listing Verification</div>
                </div>
                <div 
                  className="p-4 rounded-lg backdrop-blur-sm"
                  style={{ backgroundColor: `${colors.primary.contrast}20` }}
                >
                  <div className="text-2xl font-bold mb-1">24/7</div>
                  <div className="text-sm">Fraud Monitoring</div>
                </div>
                <div 
                  className="p-4 rounded-lg backdrop-blur-sm"
                  style={{ backgroundColor: `${colors.primary.contrast}20` }}
                >
                  <div className="text-2xl font-bold mb-1">₹1M+</div>
                  <div className="text-sm">Transaction Protection</div>
                </div>
                <div 
                  className="p-4 rounded-lg backdrop-blur-sm"
                  style={{ backgroundColor: `${colors.primary.contrast}20` }}
                >
                  <div className="text-2xl font-bold mb-1">500+</div>
                  <div className="text-sm">Trusted Partners</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reporting Section */}
        <div 
          className="p-8 sm:p-12 rounded-xl border"
          style={{ 
            backgroundColor: colors.bg.secondary,
            borderColor: `${colors.primary.main}33`
          }}
        >
          <div className="flex flex-col lg:flex-row gap-8 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="lg:w-1/2"
            >
              <h2 className="text-3xl font-bold mb-6 font-poppins">
                Report a <span style={{ color: colors.primary.main }}>Concern</span>
              </h2>
              <p 
                className="mb-6"
                style={{ color: colors.text.muted }}
              >
                If you encounter any suspicious activity or have concerns about a listing, agent, or transaction, 
                our dedicated Trust & Safety team is here to help.
              </p>
              <button 
                className="font-bold py-3 px-8 rounded-lg transition-colors shadow-lg"
                style={{ 
                  backgroundColor: colors.primary.main,
                  color: colors.primary.contrast
                }}
              >
                Submit a Report
              </button>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="lg:w-1/2 p-6 rounded-lg"
              style={{ backgroundColor: colors.bg.primary }}
            >
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2" style={{ color: colors.text.primary }}>Trust & Safety Hotline</h4>
                  <p style={{ color: colors.text.secondary }}>+1 (800) 555-SAFE</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2" style={{ color: colors.text.primary }}>Email</h4>
                  <p style={{ color: colors.text.secondary }}>safety@squarefooot.com</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2" style={{ color: colors.text.primary }}>Response Time</h4>
                  <p style={{ color: colors.text.secondary }}>Typically within 2 hours for urgent matters</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TrustSafety;