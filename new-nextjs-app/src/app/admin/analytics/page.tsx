'use client'
import React from "react";
import AdminAnalytics from "../AdminAnalytics";

export default function AdminAnalyticsPage() {
  console.log('🔧 Admin Analytics Page rendering...');
  
  React.useEffect(() => {
    console.log('🔧 Admin Analytics Page mounted on client side!');
  }, []);

  return <AdminAnalytics />;
}