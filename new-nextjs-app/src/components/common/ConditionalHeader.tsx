'use client'

import React from 'react'
import { usePathname } from 'next/navigation'
import Header from './Header'

export default function ConditionalHeader() {
  const pathname = usePathname()
  console.log('🔧 ConditionalHeader - Current path:', pathname)
  
  // Don't show header on homepage
  if (pathname === '/') {
    console.log('🔧 ConditionalHeader - Skipping header for homepage')
    return null
  }
  
  console.log('🔧 ConditionalHeader - Rendering header for path:', pathname)
  return <Header />
}