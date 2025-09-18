'use client'

import { ReactNode, useMemo, useState } from 'react'
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

type ProvidersProps = { children: ReactNode }

export default function Providers({ children }: ProvidersProps) {
  console.log('🔧 Providers component rendering...');
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>('light')

  const queryClient = useMemo(() => new QueryClient({
    defaultOptions: {
      queries: {
        retry: 1,
        refetchOnWindowFocus: false,
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
      },
    },
  }), [])

  const muiTheme = useMemo(() => createUrbanRealtyTheme(themeMode), [themeMode])

  return (
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
  )
}

