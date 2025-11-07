import React from 'react';
import type { Metadata } from 'next';
import BlogsTable from '../BlogsTable';

export const metadata: Metadata = {
  title: 'Blog Management | Admin | Squarefooot',
  description: 'Manage blog posts and articles',
};

export default function BlogsPage() {
  return <BlogsTable />;
}

