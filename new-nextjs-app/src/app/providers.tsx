'use client'

import { ReactNode, useMemo, useState, useContext, useEffect } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { ThemeProvider as MuiThemeProvider, CssBaseline } from '@mui/material'
import { createUrbanRealtyTheme } from '@/lib/theme/NewTheme'
import ThemeProvider, { ThemeContext } from '@/contexts/ThemeProvider'
import { AuthProvider } from '@/contexts/AuthContext'
import { PropertiesProvider } from '@/contexts/PropertiesContext'
import { AgentsProvider } from '@/contexts/AgentsContext'
import { DevelopersProvider } from '@/contexts/DevelopersContext'
import { ProjectsProvider } from '@/contexts/ProjectsContext'
import { ComparisonProvider } from '@/contexts/ComparisonContext'
import ErrorBoundary from '@/components/common/ErrorBoundary'
import PerformanceMonitor from '@/components/PerformanceMonitor'
import HydrationWrapper from '@/components/common/HydrationWrapper'
import { reportWebVitals, setupPerformanceObserver } from '@/lib/performance/webVitals'

type ProvidersProps = { children: ReactNode }

// Inner component to access theme context
function ThemeIntegratedProviders({ children }: ProvidersProps) {
  const { theme } = useContext(ThemeContext);
  
  const queryClient = useMemo(() => new QueryClient({
    defaultOptions: {
      queries: {
        retry: 1,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: false,
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
      },
    },
  }), [])

  // Initialize web vitals and performance monitoring
  useEffect(() => {
    if (typeof window !== 'undefined') {
      reportWebVitals()
      setupPerformanceObserver()
    }
  }, [])

  const muiTheme = useMemo(() => createUrbanRealtyTheme(theme as 'light' | 'dark'), [theme])

  return (
    <QueryClientProvider client={queryClient}>
      <MuiThemeProvider theme={muiTheme}>
        <CssBaseline />
        <ErrorBoundary>
          <AuthProvider>
            <PropertiesProvider>
              <AgentsProvider>
                <DevelopersProvider>
                  <ProjectsProvider>
                    <ComparisonProvider>
                      <HydrationWrapper>
                        {children}
                      </HydrationWrapper>
                    
                    {/* Performance monitoring - only in production */}
                    {process.env.NODE_ENV === 'production' && (
                      <PerformanceMonitor enableReporting={true} />
                    )}
                    
                    {/* Development performance monitoring with console logging */}
                    {process.env.NODE_ENV === 'development' && (
                      <PerformanceMonitor 
                        enableReporting={false} 
                        enableConsoleLogging={true} 
                      />
                    )}
                    </ComparisonProvider>
                  </ProjectsProvider>
                </DevelopersProvider>
              </AgentsProvider>
            </PropertiesProvider>
          </AuthProvider>
        </ErrorBoundary>
      </MuiThemeProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}

export default function Providers({ children }: ProvidersProps) {
  if (process.env.NODE_ENV === 'development') {
    console.log('🔧 Providers component rendering...');
  }
  
  return (
    <ThemeProvider>
      <ThemeIntegratedProviders>
        {children}
      </ThemeIntegratedProviders>
    </ThemeProvider>
  )
}

