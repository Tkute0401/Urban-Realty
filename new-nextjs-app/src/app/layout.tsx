import React from 'react'
import './globals.css'
import 'leaflet/dist/leaflet.css'
import Providers from './providers'
import ConditionalHeader from '../components/common/ConditionalHeader'
import Footer from '@/components/common/footer/Footer'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  console.log('🔧 RootLayout rendering...')
  
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* Restrict to supported directives only */}
        <meta httpEquiv="Permissions-Policy" content="payment=(self)" />
      </head>
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
