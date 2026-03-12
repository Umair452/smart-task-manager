module.exports = {
    apps: [
        {
            // Name of your app in PM2
            name: 'smart-task-manager',

            // Entry point of your app
            script: 'src/app.js',

            // Use experimental vm modules for ES modules
            node_args: '--experimental-vm-modules',

            // Number of instances
            // 'max' = one per CPU core (best for production)
            // 1 = single instance (fine for now)
            instances: 1,

            // Automatically restart if app crashes
            autorestart: true,

            // Watch for file changes and restart
            // true in development, false in production
            watch: false,

            // Memory limit before restart
            // If app uses more than 1GB → restart
            max_memory_restart: '1G',

            // Environment variables for production
            env_production: {
                NODE_ENV: 'production',
                PORT: 3000
            },

            // Environment variables for development
            env_development: {
                NODE_ENV: 'development',
                PORT: 3000
            }
        }
    ]
}