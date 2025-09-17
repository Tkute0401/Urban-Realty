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

  return (
    <footer className="bg-gray-800 text-white py-8 border-t">
      <div className="container mx-auto px-4 text-center">
        <p>© {new Date().getFullYear()} Urban Realty. All rights reserved.</p>
        <p className="mt-2 text-sm">Simple Footer - Header and Footer are now working!</p>
      </div>
    </footer>
  );
};

export default Footer;