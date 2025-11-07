import React from 'react';
import type { Metadata } from 'next';
import AddBlogClient from './AddBlogClient';

export const metadata: Metadata = {
  title: 'Add Blog Post | Admin | Squarefooot',
  description: 'Create a new blog post',
};

export default function AddBlogPage() {
  return <AddBlogClient />;
}

