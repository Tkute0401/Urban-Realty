'use client'

import React, { Suspense } from 'react';
import { CircularProgress, Box } from '@mui/material';
import HeroSection from "@/components/home/HeroSection";
import PropertiesSection from "@/components/home/PropertiesSection";
import PopularProjectsSection from "@/components/home/PopularProjectsSection";
import PopularDevelopersSection from "@/components/home/PopularDevelopersSection";
import OwnerServiceBlock from "@/components/home/OwnerServiceBox";
import ServiceBlocksGroup from "@/components/home/ServiceBlocksGroup";
import Reviews from "@/components/common/footer/Reviews";

function HomePageLoading() {
  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
      <CircularProgress sx={{ color: 'var(--color-primary)' }} />
    </Box>
  );
}

function HomePageContent() {
  return (
    <div className="font-poppins bg-[var(--color-bg-primary)] text-[var(--color-text-primary)]">
      <HeroSection/>
      <PropertiesSection />
      <PopularProjectsSection />
      <PopularDevelopersSection />
      <ServiceBlocksGroup />
      <OwnerServiceBlock />
      <Reviews />
    </div>
  );
}

export default function HomePageWrapper() {
  return (
    <Suspense fallback={<HomePageLoading />}>
      <HomePageContent />
    </Suspense>
  );
}