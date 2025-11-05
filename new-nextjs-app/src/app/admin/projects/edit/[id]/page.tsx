import React from 'react';
import type { Metadata } from 'next';
import EditProjectClient from '@/app/projects/edit/[id]/EditProjectClient';

interface AdminEditProjectPageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: AdminEditProjectPageProps): Promise<Metadata> {
  return {
    title: 'Edit Project | Admin | Squarefooot',
    description: 'Edit project details (Admin).',
  };
}

export default function AdminEditProjectPage({ params }: AdminEditProjectPageProps) {
  return <EditProjectClient projectId={params.id} />;
}


