import React from 'react';
import EditDeveloperProfileClient from './EditDeveloperProfileClient';

interface EditDeveloperProfilePageProps {
  params: {
    id: string;
  };
}

export default function EditDeveloperProfilePage({ params }: EditDeveloperProfilePageProps) {
  return <EditDeveloperProfileClient id={params.id} />;
}

