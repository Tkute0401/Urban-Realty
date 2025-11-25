'use client'

import { ReactNode, useMemo, useState, useContext, useEffect, memo } from 'react'
import { QueryClientProvider } from '@tanstack/react-query'
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
import { queryClient } from '@/lib/react-query'

type ProvidersProps = { children: ReactNode }

// Memoized wrapper for all context providers that don't depend on theme
// This prevents them from re-rendering when theme changes
// Using a custom comparison function to ensure it only re-renders if children actually change
const StableProviders = memo(({ children }: ProvidersProps) => {
  return (
    <QueryClientProvider client={queryClient}>
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
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}, (prevProps, nextProps) => {
  // Always return true to prevent re-renders unless children reference actually changes
  // This ensures providers don't re-render when parent re-renders
  return prevProps.children === nextProps.children;
})

StableProviders.displayName = 'StableProviders'

// Inner component to access theme context
function ThemeIntegratedProviders({ children }: ProvidersProps) {
  
  // Get theme context
  const { theme } = useContext(ThemeContext);

  // Initialize web vitals and performance monitoring
  useEffect(() => {
    if (typeof window !== 'undefined') {
      reportWebVitals()
      setupPerformanceObserver()
    }
  }, [])

  const muiTheme = useMemo(() => createUrbanRealtyTheme(theme as 'light' | 'dark'), [theme])

  return (
    <MuiThemeProvider theme={muiTheme}>
      <CssBaseline />
      <StableProviders>
        {children}
      </StableProviders>
    </MuiThemeProvider>
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

