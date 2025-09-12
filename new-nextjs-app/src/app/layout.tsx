import './globals.css'
import '../style-constants/themes.css'
export const metadata = {
  title: 'Migration in Progress',
  description: 'Next.js migration scaffold',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head />
      <body>
        {children}
      </body>
    </html>
  )
}

