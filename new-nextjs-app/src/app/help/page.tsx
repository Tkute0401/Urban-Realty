'use client'
import React from "react";
import HelpCenter from "@/components/common/footer/HelpCenter";

export default function HelpPage() {
  console.log('🔧 Help Page rendering...');
  
  React.useEffect(() => {
    console.log('🔧 Help Page mounted on client side!');
  }, []);

  return <HelpCenter />;
}