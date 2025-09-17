'use client'
import React from "react";
import ContactUs from "@/components/common/footer/ContactUs";

export default function ContactPage() {
  console.log('🔧 Contact Page rendering...');
  
  React.useEffect(() => {
    console.log('🔧 Contact Page mounted on client side!');
  }, []);

  return <ContactUs />;
}