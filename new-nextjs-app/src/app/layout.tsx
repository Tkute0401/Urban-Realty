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
        <meta httpEquiv="Permissions-Policy" content="payment=*, otp-credentials=*" />
        <meta httpEquiv="Content-Security-Policy" content="script-src 'self' 'unsafe-inline' 'unsafe-eval' https://checkout.razorpay.com; connect-src 'self' http://localhost:3001 https://api.razorpay.com https://checkout.razorpay.com; frame-src 'self' https://api.razorpay.com https://checkout.razorpay.com;" />
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
