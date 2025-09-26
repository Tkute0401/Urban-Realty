'use client';

import React, { useEffect, useState } from 'react';

interface PerformanceMetrics {
  lcp?: number;
  fid?: number;
  cls?: number;
  fcp?: number;
  ttfb?: number;
  propertyListingLoad?: number;
  propertyDetailsLoad?: number;
  searchResponseTime?: number;
  propertyImageLoad?: number;
}

// Performance monitoring dashboard for development
export default function PerformanceDashboard() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({});
  const [isVisible, setIsVisible] = useState(false);
  const isDevelopment = process.env.NODE_ENV === 'development';

  useEffect(() => {
    if (!isDevelopment) return;

    // Initialize performance monitoring
    const updateMetrics = () => {
      if (window.realEstatePerformance) {
        const report = window.realEstatePerformance.getPerformanceReport();
        setMetrics(report);
      }
    };

    // Update metrics every 2 seconds
    const interval = setInterval(updateMetrics, 2000);

    // Listen for keyboard shortcut (Ctrl+P) to toggle dashboard
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'p') {
        e.preventDefault();
        setIsVisible(!isVisible);
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    
    return () => {
      clearInterval(interval);
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [isDevelopment, isVisible]);

  if (!isDevelopment) return null;

  const formatMetric = (value: number | undefined, unit: string = 'ms') => {
    if (value === undefined) return 'N/A';
    return `${value.toFixed(2)}${unit}`;
  };

  const getMetricStatus = (value: number | undefined, good: number, poor: number) => {
    if (value === undefined) return 'unknown';
    if (value <= good) return 'good';
    if (value <= poor) return 'needs-improvement';
    return 'poor';
  };

  return (
    <>
      {/* Toggle button */}
      <div
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          zIndex: 10000,
          background: '#1976d2',
          color: 'white',
          padding: '10px',
          borderRadius: '50%',
          cursor: 'pointer',
          fontSize: '12px',
          fontWeight: 'bold'
        }}
        onClick={() => setIsVisible(!isVisible)}
        title="Toggle Performance Dashboard (Ctrl+P)"
      >
        📊
      </div>

      {/* Performance Dashboard */}
      {isVisible && (
        <div
          style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            width: '350px',
            maxHeight: '80vh',
            overflow: 'auto',
            background: 'rgba(0, 0, 0, 0.9)',
            color: 'white',
            padding: '20px',
            borderRadius: '8px',
            fontFamily: 'monospace',
            fontSize: '12px',
            zIndex: 10001,
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <h3 style={{ margin: 0, color: '#1976d2' }}>🚀 Real Estate Performance</h3>
            <button
              onClick={() => setIsVisible(false)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'white',
                cursor: 'pointer',
                fontSize: '16px'
              }}
            >
              ✕
            </button>
          </div>

          {/* Core Web Vitals */}
          <div style={{ marginBottom: '15px' }}>
            <h4 style={{ color: '#4caf50', margin: '0 0 10px 0' }}>Core Web Vitals</h4>
            
            <div style={{ marginBottom: '5px' }}>
              <span style={{ color: getMetricColor(getMetricStatus(metrics.lcp, 2500, 4000)) }}>
                ● LCP: {formatMetric(metrics.lcp)}
              </span>
              <span style={{ opacity: 0.7, marginLeft: '10px' }}>(&lt; 2.5s good)</span>
            </div>
            
            <div style={{ marginBottom: '5px' }}>
              <span style={{ color: getMetricColor(getMetricStatus(metrics.fid, 100, 300)) }}>
                ● FID: {formatMetric(metrics.fid)}
              </span>
              <span style={{ opacity: 0.7, marginLeft: '10px' }}>(&lt; 100ms good)</span>
            </div>
            
            <div style={{ marginBottom: '5px' }}>
              <span style={{ color: getMetricColor(getMetricStatus(metrics.cls, 0.1, 0.25)) }}>
                ● CLS: {formatMetric(metrics.cls, '')}
              </span>
              <span style={{ opacity: 0.7, marginLeft: '10px' }}>(&lt; 0.1 good)</span>
            </div>
            
            <div style={{ marginBottom: '5px' }}>
              <span style={{ color: getMetricColor(getMetricStatus(metrics.fcp, 1800, 3000)) }}>
                ● FCP: {formatMetric(metrics.fcp)}
              </span>
              <span style={{ opacity: 0.7, marginLeft: '10px' }}>(&lt; 1.8s good)</span>
            </div>
            
            <div style={{ marginBottom: '5px' }}>
              <span style={{ color: getMetricColor(getMetricStatus(metrics.ttfb, 800, 1800)) }}>
                ● TTFB: {formatMetric(metrics.ttfb)}
              </span>
              <span style={{ opacity: 0.7, marginLeft: '10px' }}>(&lt; 800ms good)</span>
            </div>
          </div>

          {/* Real Estate Specific Metrics */}
          <div style={{ marginBottom: '15px' }}>
            <h4 style={{ color: '#ff9800', margin: '0 0 10px 0' }}>Real Estate Metrics</h4>
            
            <div style={{ marginBottom: '5px' }}>
              <span style={{ color: getMetricColor(getMetricStatus(metrics.propertyListingLoad, 2000, 4000)) }}>
                🏠 Property Listing Load: {formatMetric(metrics.propertyListingLoad)}
              </span>
            </div>
            
            <div style={{ marginBottom: '5px' }}>
              <span style={{ color: getMetricColor(getMetricStatus(metrics.propertyDetailsLoad, 1500, 3000)) }}>
                🏡 Property Details Load: {formatMetric(metrics.propertyDetailsLoad)}
              </span>
            </div>
            
            <div style={{ marginBottom: '5px' }}>
              <span style={{ color: getMetricColor(getMetricStatus(metrics.searchResponseTime, 500, 1000)) }}>
                🔍 Search Response: {formatMetric(metrics.searchResponseTime)}
              </span>
            </div>
            
            <div style={{ marginBottom: '5px' }}>
              <span style={{ color: getMetricColor(getMetricStatus(metrics.propertyImageLoad, 1000, 2000)) }}>
                📸 Property Image Load: {formatMetric(metrics.propertyImageLoad)}
              </span>
            </div>
          </div>

          {/* Performance Tips */}
          <div style={{ marginBottom: '15px' }}>
            <h4 style={{ color: '#e91e63', margin: '0 0 10px 0' }}>Performance Tips</h4>
            <div style={{ fontSize: '11px', opacity: 0.8, lineHeight: '1.4' }}>
              {getPerformanceTips(metrics)}
            </div>
          </div>

          {/* Actions */}
          <div style={{ borderTop: '1px solid #333', paddingTop: '10px' }}>
            <button
              onClick={() => {
                if (window.realEstatePerformance) {
                  console.log('Performance Report:', window.realEstatePerformance.getPerformanceReport());
                }
              }}
              style={{
                background: '#1976d2',
                color: 'white',
                border: 'none',
                padding: '5px 10px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '11px',
                marginRight: '10px'
              }}
            >
              Log Full Report
            </button>
            
            <button
              onClick={() => setMetrics({})}
              style={{
                background: '#f44336',
                color: 'white',
                border: 'none',
                padding: '5px 10px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '11px'
              }}
            >
              Clear Metrics
            </button>
          </div>

          <div style={{ marginTop: '10px', fontSize: '10px', opacity: 0.6 }}>
            Press Ctrl+P to toggle dashboard
          </div>
        </div>
      )}
    </>
  );

  function getMetricColor(status: string): string {
    switch (status) {
      case 'good': return '#4caf50';
      case 'needs-improvement': return '#ff9800';
      case 'poor': return '#f44336';
      default: return '#9e9e9e';
    }
  }

  function getPerformanceTips(metrics: PerformanceMetrics): React.ReactNode {
    const tips: string[] = [];

    if (metrics.lcp && metrics.lcp > 2500) {
      tips.push('• Optimize LCP: Preload hero images, use WebP format');
    }

    if (metrics.fid && metrics.fid > 100) {
      tips.push('• Reduce FID: Minimize JavaScript execution, use code splitting');
    }

    if (metrics.cls && metrics.cls > 0.1) {
      tips.push('• Fix CLS: Set image dimensions, avoid dynamic content insertion');
    }

    if (metrics.propertyListingLoad && metrics.propertyListingLoad > 2000) {
      tips.push('• Speed up listings: Implement virtual scrolling, optimize API calls');
    }

    if (metrics.searchResponseTime && metrics.searchResponseTime > 500) {
      tips.push('• Optimize search: Add debouncing, use search indexing');
    }

    if (tips.length === 0) {
      tips.push('✅ Performance is looking good! Keep monitoring.');
    }

    return tips.map((tip, index) => (
      <div key={index} style={{ marginBottom: '3px' }}>{tip}</div>
    ));
  }
}