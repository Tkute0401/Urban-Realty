import React from "react";
import { Link } from 'react-router-dom';
import { motion } from "framer-motion";
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import XIcon from '@mui/icons-material/X';
import YoutubeIcon from '@mui/icons-material/YouTube';

const Footer = () => {
  const cities = [
    "Nashik", "Delhi", "Mumbai", "Pune", "Bangalore", "New York", "Los Angeles", "Chicago", "Houston", "Phoenix", 
    "Philadelphia"
  ];

  const resources = [
    "Blog", "Guides", "FAQ", { name: "Help Center", path: "/help"}, { name: "Privacy Policy", path: "/privacy"}, { name: "Terms & Conditions", path: "terms"}, 
    "Licenses", "Sitemap", "Ad Choices", "Accessibility"
  ];

  const about = [
    { name: "About Us", path: "/about" }, { name: "Career", path: "/career"}, { name: "Contact Us", path: "/contact" }, "Press", "Investors", 
    "Research", { name: "Trust & Safety", path: "/trust" }, { name: "How We Work", path: "/how-we-work" }
  ];

  const services = [
    "Buy a Home", "Sell a Home", "Rent a Home", "Pre-approval", 
    "Loan Calculator", "Mortgage Rates", "Real Estate Agents"
  ];

  const partners = [
    { name: "Digital Supremacy", path: "https://digitalsupremacy.in/" }, { name: "FireFist Solutions", path: "https://firefist.co.in/" }, { name: "CodeHub India", path: "https://www.codehubindia.in/" }
  ];

  return (
    <motion.footer 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="bg-[#08171A] text-gray-300 border-t border-[#78cadc]/20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12 sm:py-16">
        {/* Top section with links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-12 mb-12">
          {/* Cities */}
          <div>
            <h3 className="font-poppins text-lg font-bold text-white mb-4">Popular Cities</h3>
            <ul className="space-y-2">
              {cities.map((city, index) => (
                <li key={index}>
                  <link 
                    to={`/properties?city=${city}`} 
                    className="font-poppins text-sm hover:text-[#78cadc] transition-colors"
                  >
                    {city} Real Estate
                  </link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-poppins text-lg font-bold text-white mb-4">Resources</h3>
            <ul className="space-y-2">
              {resources.map((item, index) => (
                <li key={index}>
                  <Link 
                    to={item.path} 
                    className="font-poppins text-sm hover:text-[#78cadc] transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* About */}
          <div>
            <h3 className="font-poppins text-lg font-bold text-white mb-4">About</h3>
            <ul className="space-y-2">
              {about.map((item, index) => (
                <li key={index}>
                  <Link 
                    to={item.path}
                    className="font-poppins text-sm hover:text-[#78cadc] transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-poppins text-lg font-bold text-white mb-4">Services</h3>
            <ul className="space-y-2">
              {services.map((item, index) => (
                <li key={index}>
                  <Link 
                    to={item.path} 
                    className="font-poppins text-sm hover:text-[#78cadc] transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Our Partners */}
        <div>
            <h3 className="font-poppins text-lg font-bold text-white mb-4">Our Partners</h3>
            <ul className="space-y-2">
              {partners.map((item, index) => (
                <li key={index}>
                  <Link 
                    to={item.path} 
                    className="font-poppins text-sm hover:text-[#78cadc] transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        {/* Divider */}
        <div className="h-px bg-[#78cadc]/20 my-8"></div>

        {/* Middle section - now just social links centered */}
        <div className="flex flex-col items-center mb-12">
          <h3 className="font-poppins text-lg font-bold text-white mb-6">Connect with Us</h3>
          <div className="flex gap-6">
            <a href="https://www.facebook.com/share/16U1BQ69Un/?mibextid=wwXIfr" className="p-2 rounded-full bg-[#78cadc]/10 hover:bg-[#78cadc]/20 transition-colors">
              <FacebookIcon className="w-6 h-6 text-white" />
            </a>
            <a href="#" className="p-2 rounded-full bg-[#78cadc]/10 hover:bg-[#78cadc]/20 transition-colors">
              <XIcon className="w-6 h-6 text-white" />
            </a>
            <a href="https://www.instagram.com/urbanrealty360?igsh=cmUyOXdweDd2ZjVr" className="p-2 rounded-full bg-[#78cadc]/10 hover:bg-[#78cadc]/20 transition-colors">
              <InstagramIcon className="w-6 h-6 text-white" />
            </a>
            <a href="https://www.linkedin.com/company/uraban-realty-360" className="p-2 rounded-full bg-[#78cadc]/10 hover:bg-[#78cadc]/20 transition-colors">
              <LinkedInIcon className="w-6 h-6 text-white" />
            </a>
            <a href="#" className="p-2 rounded-full bg-[#78cadc]/10 hover:bg-[#78cadc]/20 transition-colors">
              <YoutubeIcon className="w-6 h-6 text-white" />
            </a>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-[#78cadc]/20 my-8"></div>

        {/* Bottom section with copyright and logo */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <img src="/vite.png" alt="Logo" className="w-8 h-8" />
            <span className="font-poppins text-white font-bold">URBAN REALTY 360</span>
          </div>
          
          <div className="text-center md:text-right">
            <p className="font-poppins text-xs">
              © {new Date().getFullYear()} Urban Realty 360, Inc. All rights reserved.
            </p>
            <p className="font-poppins text-xs mt-1">
              Urban Realty 360® is a registered trademark of Urban Realty 360, Inc.
            </p>
          </div>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;