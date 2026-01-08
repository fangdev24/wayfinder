/**
 * PM2 Ecosystem Configuration for Wayfinder
 *
 * Manages all Wayfinder services as persistent processes.
 *
 * Services:
 *   - wayfinder-app:  Next.js web application (port 3001)
 *   - wayfinder-pods: Community Solid Server (port 3002)
 *   - wayfinder-slack: Slack bot for knowledge graph queries (port 3003)
 *
 * Usage:
 *   pm2 start ecosystem.config.js            # Start all services (production)
 *   pm2 start ecosystem.config.js --env dev  # Start in development mode
 *   pm2 stop all                             # Stop all services
 *   pm2 restart all                          # Restart all services
 *   pm2 logs wayfinder-app                   # View Next.js logs
 *   pm2 logs wayfinder-pods                  # View Solid server logs
 *   pm2 logs wayfinder-slack                 # View Slack bot logs
 *
 * Tunnel:
 *   Domain: wayfinder.pbj.cx → localhost:3001
 *   Restart tunnel after config change: pm2 restart tunnel
 */

module.exports = {
  apps: [
    {
      name: 'wayfinder-app',
      cwd: './app',
      script: 'npm',
      args: 'start',
      env: {
        NODE_ENV: 'production',
        PORT: 3001,
        // Slack credentials loaded from shell environment - set in ~/.bashrc or similar
        // SLACK_BOT_TOKEN and SLACK_FEEDBACK_CHANNEL must be exported before pm2 start
      },
      env_dev: {
        NODE_ENV: 'development',
        PORT: 3001,
        args: 'run dev',
      },
      watch: false,
      autorestart: true,
      max_restarts: 10,
      restart_delay: 1000,
    },
    {
      name: 'wayfinder-pods',
      cwd: './pods',
      script: 'npx',
      args: [
        '@solid/community-server',
        '-p', '3002',
        '-c', '@css:config/file.json',
        '-f', './.data',
        '--seedConfig', './seed-config.json',
      ],
      env: {
        NODE_ENV: 'development',
      },
      watch: false,
      autorestart: true,
      max_restarts: 5,
      restart_delay: 2000,
    },
    {
      name: 'wayfinder-slack',
      cwd: './slack-bot',
      script: 'npm',
      args: 'run dev',
      env: {
        NODE_ENV: 'development',
        PORT: 3003,
      },
      watch: false,
      autorestart: true,
      max_restarts: 5,
      restart_delay: 2000,
    },
  ],
};
