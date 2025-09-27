module.exports = {
  apps: [
    {
      name: 'urban-realty-unified',
      script: 'server.js',
      cwd: '/app',
      instances: 1,
      exec_mode: 'fork',
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
      
      // Railway-optimized logging configuration
      log_file: '/app/logs/app-combined.log',
      out_file: '/app/logs/app-out.log',
      error_file: '/app/logs/app-error.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      
      // Railway-optimized restart configuration
      max_restarts: 5,
      min_uptime: '30s',
      restart_delay: 2000,
      
      // Memory management
      max_memory_restart: '1G',
      
      // Railway-optimized process management
      watch: false,
      kill_timeout: 5000,
      wait_ready: true,
      listen_timeout: 15000,
      
      // Error handling
      autorestart: true,
      
      // Railway-specific optimizations
      node_args: '--max-old-space-size=1024',
      source_map_support: false,
      
      // Health check configuration for Railway
      health_check_grace_period: 60000,
      health_check_interval: 30000
    }
  ]
};