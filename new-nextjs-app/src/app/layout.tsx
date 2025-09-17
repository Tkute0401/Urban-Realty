import React from 'react'
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
          <Header />
          <main>
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  )
}
