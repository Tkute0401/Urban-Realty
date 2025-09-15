'use client'

import React from "react";
import HeroSection from "@/components/home/HeroSection";
import PropertiesSection from "@/components/home/PropertiesSection";
import OwnerServiceBlock from "@/components/home/OwnerServiceBox";
import ServiceBlocksGroup from "@/components/home/ServiceBlocksGroup";
import Reviews from "@/components/common/footer/Reviews";

export default function Page() {
  return (
    <div className="font-poppins bg-[var(--color-bg-primary)] text-[var(--color-text-primary)]">
      <HeroSection/>
      <PropertiesSection />
      <ServiceBlocksGroup />
      <OwnerServiceBlock />
      <Reviews />
    </div>
  );
}

