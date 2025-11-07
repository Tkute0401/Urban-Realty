import React from 'react';
import type { Metadata } from 'next';
import EditBlogClient from './EditBlogClient';

export const metadata: Metadata = {
  title: 'Edit Blog Post | Admin | Squarefooot',
  description: 'Edit blog post',
};

export default function EditBlogPage() {
  return <EditBlogClient />;
}

