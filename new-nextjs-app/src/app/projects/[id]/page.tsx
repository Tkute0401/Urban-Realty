import React from 'react';
import type { Metadata } from 'next';
import ProjectDetailsClient from './ProjectDetailsClient';

interface ProjectDetailsPageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: ProjectDetailsPageProps): Promise<Metadata> {
  // This will be populated by the client component
  return {
    title: 'Project Details | Squarefooot',
    description: 'View detailed information about this real estate development project.',
  };
}

export default function ProjectDetailsPage({ params }: ProjectDetailsPageProps) {
  return <ProjectDetailsClient projectId={params.id} />;
}
