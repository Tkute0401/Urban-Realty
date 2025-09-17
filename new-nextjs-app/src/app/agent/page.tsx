'use client'
import React from "react";
import AgentDashboard from "./AgentDashboard";

export default function AgentPage() {
  console.log('🔧 Agent Page rendering...');
  
  React.useEffect(() => {
    console.log('🔧 Agent Page mounted on client side!');
  }, []);

  return <AgentDashboard />;
}