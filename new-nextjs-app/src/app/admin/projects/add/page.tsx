import React from 'react';
import type { Metadata } from 'next';
import AddProjectClient from '@/app/projects/add/AddProjectClient';

export const metadata: Metadata = {
  title: 'Add Project | Admin | Squarefooot',
  description: 'Add a new development project (Admin).',
};

export default function AdminAddProjectPage() {
  return <AddProjectClient />;
}

