import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Migration in Progress',
  description: 'Zero-drift migration foundation',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

