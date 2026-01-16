import React from 'react';
import type { Metadata } from 'next';
import ProjectListingsClient from './ProjectListingsClient';

export const metadata: Metadata = {
    title: 'Featured Project Listings for Squarefooot Property Expo',
    description: 'Browse our curated collection of premium real estate development projects. Find your dream property from trusted developers.',
    keywords: [
        'real estate projects',
        'development projects',
        'residential projects',
        'commercial projects',
        'property listings',
        'new projects',
        'property development',
        'premium projects'
    ],
};

export default function ProjectListingsPage() {
    return <ProjectListingsClient />;
}
