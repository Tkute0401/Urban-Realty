module.exports = {
  apps: [
    {
      name: 'urban-realty-nextjs',
      script: 'new-nextjs-app/server.js',
      cwd: '/app',
      instances: 1,
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: process.env.PORT || 3000,
        HOSTNAME: '0.0.0.0',
        NEXT_TELEMETRY_DISABLED: '1',
        DISABLE_ESLINT_PLUGIN: 'true',
        SKIP_ENV_VALIDATION: 'true'
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: process.env.PORT || 3000,
        HOSTNAME: '0.0.0.0',
        NEXT_TELEMETRY_DISABLED: '1',
        DISABLE_ESLINT_PLUGIN: 'true',
        SKIP_ENV_VALIDATION: 'true'
      },
      // Health check configuration
      health_check_grace_period: 30000,
      health_check_interval: 30000,
      
      // Logging configuration
      log_file: '/app/logs/combined.log',
      out_file: '/app/logs/out.log',
      error_file: '/app/logs/error.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      
      // Restart configuration
      max_restarts: 10,
      min_uptime: '10s',
      restart_delay: 4000,
      
      // Memory management
      max_memory_restart: '1G',
      
      // Advanced PM2 features
      watch: false,
      ignore_watch: ['node_modules', 'logs', 'uploads'],
      
      // Process management
      kill_timeout: 5000,
      wait_ready: true,
      listen_timeout: 10000,
      
      // Error handling
      autorestart: true,
      max_restarts: 10,
      min_uptime: '10s'
    }
  ],

  // Deployment configuration
  deploy: {
    production: {
      user: 'node',
      host: 'railway.app',
      ref: 'origin/main',
      repo: 'git@github.com:your-username/urban-realty.git',
      path: '/app',
      'post-deploy': 'npm install && cd new-nextjs-app && npm install && npm run build && pm2 reload ecosystem.config.js --env production',
      'pre-setup': 'apt-get update && apt-get install git -y'
    }
  }
};