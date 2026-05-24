module.exports = {
  apps: [{
    name: 'svms',
    script: 'build/server/index.js',
    cwd: '/var/www/svms/apps/web',
    interpreter: 'node',
    env: {
      NODE_ENV: 'production',
      PORT: '3000'
    },
    error_file: '/var/log/svms/error.log',
    out_file: '/var/log/svms/out.log',
    merge_logs: true,
    restart_delay: 3000
  }]
}
