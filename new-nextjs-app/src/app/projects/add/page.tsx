import React from 'react';
import type { Metadata } from 'next';
import AddProjectClient from './AddProjectClient';

export const metadata: Metadata = {
  title: 'Add Project | Squarefooot',
  description: 'Add a new development project to showcase your work.',
};

export default function AddProjectPage() {
  return <AddProjectClient />;
}
