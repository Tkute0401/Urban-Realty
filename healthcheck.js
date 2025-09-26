#!/usr/bin/env node

/**
 * Squarefooot Health Check Script for Railway Deployment
 * Optimized for speed and reliability
 */

const http = require('http');

const API_PORT = process.env.API_PORT || process.env.PORT || 5000;
const FRONTEND_PORT = process.env.PORT || 3000;
const TIMEOUT = 5000; // 5 seconds timeout

/**
 * Perform health check on a specific service
 */
function checkHealth(port, path, serviceName) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: port,
            path: path,
            method: 'GET',
            timeout: TIMEOUT,
            headers: {
                'User-Agent': 'Squarefooot-HealthCheck/1.0',
                'Accept': 'application/json'
            }
        };

        const req = http.request(options, (res) => {
            let data = '';
            
            res.on('data', (chunk) => {
                data += chunk;
            });
            
            res.on('end', () => {
                if (res.statusCode === 200) {
                    console.log(`✅ ${serviceName} health check passed (${res.statusCode})`);
                    resolve({ service: serviceName, status: 'healthy', port, statusCode: res.statusCode });
                } else {
                    console.error(`❌ ${serviceName} health check failed (${res.statusCode})`);
                    reject(new Error(`Health check failed with status ${res.statusCode}`));
                }
            });
        });

        req.on('error', (error) => {
            console.error(`❌ ${serviceName} health check error:`, error.message);
            reject(error);
        });

        req.on('timeout', () => {
            console.error(`❌ ${serviceName} health check timeout after ${TIMEOUT}ms`);
            req.destroy();
            reject(new Error(`Health check timeout after ${TIMEOUT}ms`));
        });

        req.setTimeout(TIMEOUT);
        req.end();
    });
}

/**
 * Main health check function
 */
async function performHealthCheck() {
    console.log('🏠 Starting Squarefooot health checks...');
    
    const checks = [];
    
    // Always check API health
    checks.push(checkHealth(API_PORT, '/api/v1/health', 'API'));
    
    // Check frontend health if different port
    if (FRONTEND_PORT !== API_PORT) {
        checks.push(checkHealth(FRONTEND_PORT, '/', 'Frontend'));
    }
    
    try {
        const results = await Promise.all(checks);
        console.log('✅ All Squarefooot services are healthy!');
        
        // Output summary for monitoring
        const summary = {
            timestamp: new Date().toISOString(),
            status: 'healthy',
            services: results,
            environment: process.env.NODE_ENV || 'development',
            deployment: 'railway'
        };
        
        console.log('📊 Health check summary:', JSON.stringify(summary, null, 2));
        process.exit(0);
        
    } catch (error) {
        console.error('💥 Health check failed:', error.message);
        
        // Output failure summary for monitoring
        const failureSummary = {
            timestamp: new Date().toISOString(),
            status: 'unhealthy',
            error: error.message,
            environment: process.env.NODE_ENV || 'development',
            deployment: 'railway'
        };
        
        console.error('📊 Failure summary:', JSON.stringify(failureSummary, null, 2));
        process.exit(1);
    }
}

// Run health check
if (require.main === module) {
    performHealthCheck();
}

module.exports = { checkHealth, performHealthCheck };