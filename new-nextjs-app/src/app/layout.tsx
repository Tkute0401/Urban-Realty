'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { ThemeProvider as MuiThemeProvider, CssBaseline } from '@mui/material'
import { createUrbanRealtyTheme } from '@/lib/theme/NewTheme'
import ThemeProvider from '@/contexts/ThemeProvider'
import { AuthProvider } from '@/contexts/AuthContext'
import { PropertiesProvider } from '@/contexts/PropertiesContext'
import { AgentsProvider } from '@/contexts/AgentsContext'
import { DevelopersProvider } from '@/contexts/DevelopersContext'
import ErrorBoundary from '@/components/common/ErrorBoundary'
import './globals.css'
import 'leaflet/dist/leaflet.css'
import { useState } from 'react'

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
    },
  },
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState('light')
  const muiTheme = createUrbanRealtyTheme(theme)

  return (
    <html lang="en" data-theme={theme}>
      <body>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider>
            <MuiThemeProvider theme={muiTheme}>
              <CssBaseline />
              <ErrorBoundary>
                <AuthProvider>
                  <PropertiesProvider>
                    <AgentsProvider>
                      <DevelopersProvider>
                        {children}
                      </DevelopersProvider>
                    </AgentsProvider>
                  </PropertiesProvider>
                </AuthProvider>
              </ErrorBoundary>
            </MuiThemeProvider>
          </ThemeProvider>
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </body>
    </html>
  )
}

