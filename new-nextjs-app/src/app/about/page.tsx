'use client'
import React from "react";
import AboutUs from "@/components/common/footer/AboutUs";

export default function AboutPage() {
  console.log('🔧 About Page rendering...');
  
  React.useEffect(() => {
    console.log('🔧 About Page mounted on client side!');
  }, []);

  return <AboutUs />;
}