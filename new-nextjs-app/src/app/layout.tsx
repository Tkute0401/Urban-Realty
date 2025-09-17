'use client'

import React from 'react'
import { usePathname } from 'next/navigation'
import './globals.css'
import 'leaflet/dist/leaflet.css'
import Providers from './providers'
import Header from '@/components/common/Header'
import Footer from '@/components/common/footer/Footer'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  console.log('🔧 RootLayout rendering...')
  
  return (
    <html lang="en">
      <body>
        <Providers>
          <ConditionalHeader />
          <main>
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  )
}

function ConditionalHeader() {
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
