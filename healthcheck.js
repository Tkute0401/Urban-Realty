const http = require('http');

// Health check for both Next.js and Express servers
const checkServer = (port, path = '/', timeout = 5000) => {
  return new Promise((resolve, reject) => {
    const req = http.request({
      hostname: 'localhost',
      port: port,
      path: path,
      method: 'GET',
      timeout: timeout
    }, (res) => {
      if (res.statusCode >= 200 && res.statusCode < 400) {
        resolve({ port, status: 'healthy' });
      } else {
        reject(new Error(`Server on port ${port} returned status ${res.statusCode}`));
      }
    });

    req.on('error', (err) => {
      reject(new Error(`Server on port ${port} is not responding: ${err.message}`));
    });

    req.on('timeout', () => {
      req.abort();
      reject(new Error(`Server on port ${port} timed out`));
    });

    req.end();
  });
};

const healthCheck = async () => {
  try {
    // Check both Next.js frontend (3000) and Express backend (5000)
    const [nextjs, backend] = await Promise.all([
      checkServer(3000, '/'),
      checkServer(5000, '/api/v1/health')
    ]);
    
    console.log('Health check passed:', { nextjs, backend });
    process.exit(0);
  } catch (error) {
    console.error('Health check failed:', error.message);
    process.exit(1);
  }
};

healthCheck();