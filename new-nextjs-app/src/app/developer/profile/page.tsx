import React from 'react';
import type { Metadata } from 'next';
import DeveloperProfileClient from './DeveloperProfileClient';

export const metadata: Metadata = {
  title: 'Developer Profile | Squarefooot',
  description: 'Manage your developer profile and company information.',
};

export default function DeveloperProfilePage() {
  return <DeveloperProfileClient />;
}
