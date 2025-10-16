import React from 'react';
import type { Metadata } from 'next';
import EditProjectClient from './EditProjectClient';

interface EditProjectPageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: EditProjectPageProps): Promise<Metadata> {
  return {
    title: 'Edit Project | Squarefooot',
    description: 'Edit your real estate development project details.',
  };
}

export default function EditProjectPage({ params }: EditProjectPageProps) {
  return <EditProjectClient projectId={params.id} />;
}
