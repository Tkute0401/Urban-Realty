module.exports = {
  apps: [
    {
      name: 'squarefooot-nextjs',
      script: './nextjs/server.js',
      cwd: './',
      instances: 1,
      exec_mode: 'cluster',
      max_memory_restart: '800M',
      node_args: [
        '--max-old-space-size=512',
        '--enable-source-maps=false',
        '--max-semi-space-size=64',
        '--optimize-for-size'
      ].join(' '),
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        HOSTNAME: '0.0.0.0',
        NEXT_SHARP: '0',
        NEXT_TELEMETRY_DISABLED: '1',
        SQUAREFOOOT_SERVICE: 'frontend',
        TZ: 'UTC'
      },
      error_file: './logs/nextjs-error.log',
      out_file: './logs/nextjs-out.log',
      log_file: './logs/nextjs-combined.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      time: true,
      autorestart: true,
      watch: false,
      max_restarts: 5,
      min_uptime: '15s',
      restart_delay: 2000,
      exponential_backoff_restart_delay: 100,
      kill_timeout: 5000,
      listen_timeout: 10000,
      shutdown_with_message: true,
      force: true,
      merge_logs: true,
      log_type: 'json'
    },
    {
      name: 'squarefooot-api',
      script: './server/server.js',
      cwd: './',
      instances: 1,
      exec_mode: 'cluster',
      max_memory_restart: '800M',
      node_args: [
        '--max-old-space-size=512',
        '--enable-source-maps=false',
        '--max-semi-space-size=64',
        '--optimize-for-size'
      ].join(' '),
      env: {
        NODE_ENV: 'production',
        PORT: 5000,
        API_PORT: 5000,
        SQUAREFOOOT_SERVICE: 'api',
        TZ: 'UTC'
      },
      error_file: './logs/server-error.log',
      out_file: './logs/server-out.log',
      log_file: './logs/server-combined.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      time: true,
      autorestart: true,
      watch: false,
      max_restarts: 5,
      min_uptime: '15s',
      restart_delay: 2000,
      exponential_backoff_restart_delay: 100,
      kill_timeout: 5000,
      listen_timeout: 10000,
      shutdown_with_message: true,
      force: true,
      merge_logs: true,
      log_type: 'json'
    }
  ],
  deploy: {
    production: {
      user: 'squarefooot',
      host: 'railway.app',
      ref: 'origin/main',
      repo: 'git@github.com:user/repo.git',
      path: '/app',
      'post-deploy': 'npm install && pm2 reload ecosystem.config.js --env production'
    }
  }
};