import React from 'react';
import type { Metadata } from 'next';
import ProjectsPageWrapper from './ProjectsPageWrapper';

export const metadata: Metadata = {
  title: 'Developer Projects | Squarefooot',
  description: 'Browse real estate development projects from trusted developers.',
  keywords: [
    'real estate projects',
    'development projects',
    'residential projects',
    'commercial projects',
    'property development',
    'construction projects'
  ],
};

export default function ProjectsPage() {
  return <ProjectsPageWrapper />;
}
