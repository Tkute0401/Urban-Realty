'use client'

import React from "react";
import Link from 'next/link';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import XIcon from '@mui/icons-material/X';
import YoutubeIcon from '@mui/icons-material/YouTube';

const Footer = () => {
  console.log('🔧 Footer component rendering...');
  
  React.useEffect(() => {
    console.log('🔧 Footer mounted on client side!');
  }, []);

  const cities = [
    "Nashik", "Delhi", "Mumbai", "Pune", "Bangalore", "New York", "Los Angeles", "Chicago", "Houston", "Phoenix", 
    "Philadelphia"
  ];

  const resources = [
    "Blog", "Guides", "FAQ", { name: "Help Center", path: "/help"}, { name: "Privacy Policy", path: "/privacy-policy"}, { name: "Terms & Conditions", path: "/terms"}, {name: "Developers", path: "/developers"}, "Licenses", "Sitemap", "Ad Choices", "Accessibility"
  ];

  const about = [
    { name: "About Us", path: "/about" }, { name: "Career", path: "/career"}, { name: "Contact Us", path: "/contact" }, "Press", "Investors", 
    "Research", { name: "Trust & Safety", path: "/trust" }, { name: "How We Work", path: "/how-we-work" }
  ];

  const services = [
    "Buy a Home", "Sell a Home", "Rent a Home", "Pre-approval", 
    { name: "Loan Calculator", path: "/emi-calculator" }, "Mortgage Rates", "Real Estate Agents", { name: "Interior Design", path: "/interior-design"}, { name: "Lawyer Consultancy", path: "/lawyer-consultancy" }, { name: "Packers and Movers", path: "/packers-and-movers" }
  ];

  const partners = [
    { name: "Digital Supremacy", path: "https://digitalsupremacy.in/" }, { name: "FireFist Solutions", path: "https://firefist.co.in/" }, { name: "CodeHub India", path: "https://www.codehubindia.in/" }
  ];

  return (
    <footer 
      style={{
        backgroundColor: '#0b132b',
        color: '#d1d5db',
        borderTop: '1px solid var(--color-primary)'
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12 sm:py-16">
        {/* Top section with links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-12 mb-12">
          {/* Cities */}
          <div>
            <h3 className="font-poppins text-lg font-bold mb-4" style={{ color: '#f9fafb' }}>Popular Cities</h3>
            <ul className="space-y-2">
              {cities.map((city, index) => (
                <li key={index}>
                  <a 
                    href={`/properties?city=${city}`} 
                    className="font-poppins text-sm transition-colors"
                    style={{ 
                      color: '#d1d5db',
                      fontSize: '0.875rem'
                    }}
                    onMouseEnter={(e) => {
                      (e.target as HTMLElement).style.color = 'var(--color-primary)';
                    }}
                    onMouseLeave={(e) => {
                      (e.target as HTMLElement).style.color = '#d1d5db';
                    }}
                  >
                    {city} Real Estate
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-poppins text-lg font-bold mb-4" style={{ color: '#f9fafb' }}>Resources</h3>
            <ul className="space-y-2">
              {resources.map((item, index) => (
                <li key={index}>
                  <Link 
                    href={typeof item === 'string' ? '#' : item.path} 
                    className="font-poppins text-sm transition-colors"
                    style={{ 
                      color: '#d1d5db',
                      fontSize: '0.875rem',
                      textDecoration: 'none'
                    }}
                    onMouseEnter={(e) => {
                      (e.target as HTMLElement).style.color = 'var(--color-primary)';
                    }}
                    onMouseLeave={(e) => {
                      (e.target as HTMLElement).style.color = '#d1d5db';
                    }}
                  >
                    {typeof item === 'string' ? item : item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* About */}
          <div>
            <h3 className="font-poppins text-lg font-bold mb-4" style={{ color: '#f9fafb' }}>About</h3>
            <ul className="space-y-2">
              {about.map((item, index) => (
                <li key={index}>
                  <Link 
                    href={typeof item === 'string' ? '#' : item.path}
                    className="font-poppins text-sm transition-colors"
                    style={{ 
                      color: '#d1d5db',
                      fontSize: '0.875rem',
                      textDecoration: 'none'
                    }}
                    onMouseEnter={(e) => {
                      (e.target as HTMLElement).style.color = 'var(--color-primary)';
                    }}
                    onMouseLeave={(e) => {
                      (e.target as HTMLElement).style.color = '#d1d5db';
                    }}
                  >
                    {typeof item === 'string' ? item : item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-poppins text-lg font-bold mb-4" style={{ color: '#f9fafb' }}>Services</h3>
            <ul className="space-y-2">
              {services.map((item, index) => (
                <li key={index}>
                  <Link 
                    href={typeof item === 'string' ? '#' : item.path} 
                    className="font-poppins text-sm transition-colors"
                    style={{ 
                      color: '#d1d5db',
                      fontSize: '0.875rem',
                      textDecoration: 'none'
                    }}
                    onMouseEnter={(e) => {
                      (e.target as HTMLElement).style.color = 'var(--color-primary)';
                    }}
                    onMouseLeave={(e) => {
                      (e.target as HTMLElement).style.color = '#d1d5db';
                    }}
                  >
                    {typeof item === 'string' ? item : item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Our Partners */}
        <div>
            <h3 className="font-poppins text-lg font-bold mb-4" style={{ color: '#f9fafb' }}>Our Partners</h3>
            <ul className="space-y-2">
              {partners.map((item, index) => (
                <li key={index}>
                  <Link 
                    href={item.path} 
                    className="font-poppins text-sm transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ 
                      color: '#d1d5db',
                      fontSize: '0.875rem',
                      textDecoration: 'none'
                    }}
                    onMouseEnter={(e) => {
                      (e.target as HTMLElement).style.color = 'var(--color-primary)';
                    }}
                    onMouseLeave={(e) => {
                      (e.target as HTMLElement).style.color = '#d1d5db';
                    }}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        {/* Divider */}
        <div className="h-px my-8" style={{ backgroundColor: 'var(--color-primary)', opacity: '0.2' }}></div>

        {/* Middle section - social links centered */}
        <div className="flex flex-col items-center mb-12">
          <h3 className="font-poppins text-lg font-bold mb-6" style={{ color: '#f9fafb' }}>Connect with Us</h3>
          <div className="flex gap-6">
            <a href="https://www.facebook.com/share/16U1BQ69Un/?mibextid=wwXIfr" 
               className="p-2 rounded-full transition-colors"
               style={{ 
                 backgroundColor: 'rgba(247, 107, 28, 0.1)',
                 border: '1px solid rgba(247, 107, 28, 0.3)'
               }}
               onMouseEnter={(e) => {
                 (e.target as HTMLElement).style.backgroundColor = 'rgba(247, 107, 28, 0.2)';
                 (e.target as HTMLElement).style.borderColor = 'rgba(247, 107, 28, 0.5)';
               }}
               onMouseLeave={(e) => {
                 (e.target as HTMLElement).style.backgroundColor = 'rgba(247, 107, 28, 0.1)';
                 (e.target as HTMLElement).style.borderColor = 'rgba(247, 107, 28, 0.3)';
               }}
            >
              <FacebookIcon className="w-6 h-6" style={{ color: '#f9fafb' }} />
            </a>
            <a href="https://www.instagram.com/urbanrealty360?igsh=cmUyOXdweDd2ZjVr" 
               className="p-2 rounded-full transition-colors"
               style={{ 
                 backgroundColor: 'rgba(247, 107, 28, 0.1)',
                 border: '1px solid rgba(247, 107, 28, 0.3)'
               }}
               onMouseEnter={(e) => {
                 (e.target as HTMLElement).style.backgroundColor = 'rgba(247, 107, 28, 0.2)';
                 (e.target as HTMLElement).style.borderColor = 'rgba(247, 107, 28, 0.5)';
               }}
               onMouseLeave={(e) => {
                 (e.target as HTMLElement).style.backgroundColor = 'rgba(247, 107, 28, 0.1)';
                 (e.target as HTMLElement).style.borderColor = 'rgba(247, 107, 28, 0.3)';
               }}
            >
              <InstagramIcon className="w-6 h-6" style={{ color: '#f9fafb' }} />
            </a>
            <a href="https://www.linkedin.com/company/uraban-realty-360"
               className="p-2 rounded-full transition-colors"
               style={{ 
                 backgroundColor: 'rgba(247, 107, 28, 0.1)',
                 border: '1px solid rgba(247, 107, 28, 0.3)'
               }}
               onMouseEnter={(e) => {
                 (e.target as HTMLElement).style.backgroundColor = 'rgba(247, 107, 28, 0.2)';
                 (e.target as HTMLElement).style.borderColor = 'rgba(247, 107, 28, 0.5)';
               }}
               onMouseLeave={(e) => {
                 (e.target as HTMLElement).style.backgroundColor = 'rgba(247, 107, 28, 0.1)';
                 (e.target as HTMLElement).style.borderColor = 'rgba(247, 107, 28, 0.3)';
               }}
            >
              <LinkedInIcon className="w-6 h-6" style={{ color: '#f9fafb' }} />
            </a>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px my-8" style={{ backgroundColor: 'var(--color-primary)', opacity: '0.2' }}></div>

        {/* Bottom section with copyright and logo */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <img src="/vite.png" alt="Logo" className="h-8 w-auto object-contain" />
            <span className="font-poppins font-bold" style={{ color: '#f9fafb' }}>SQUAREFOOT</span>
          </div>
          
          <div className="text-center md:text-right">
            <p className="font-poppins text-xs" style={{ color: '#d1d5db' }}>
              © {new Date().getFullYear()} SQUAREFOOT, Inc. All rights reserved.
            </p>
            <p className="font-poppins text-xs mt-1" style={{ color: '#d1d5db' }}>
              SQUAREFOOT® is a registered trademark of SQUAREFOOT, Inc.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;