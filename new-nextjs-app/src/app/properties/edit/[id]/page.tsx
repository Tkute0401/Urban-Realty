import React from 'react';
import type { Metadata } from 'next';
import EditPropertyClient from './EditPropertyClient';

interface EditPropertyPageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: EditPropertyPageProps): Promise<Metadata> {
  return {
    title: 'Edit Property | Squarefooot',
    description: 'Edit your property listing details.',
  };
}

export default function EditPropertyPage({ params }: EditPropertyPageProps) {
  return <EditPropertyClient propertyId={params.id} />;
}


