'use client'
import React from "react";
import AdminDashboard from "@/components/admin/AdminDashboard";

export default function AdminPage() {
  console.log('🔧 Admin Page rendering...');
  
  React.useEffect(() => {
    console.log('🔧 Admin Page mounted on client side!');
  }, []);

  return <AdminDashboard />;
}