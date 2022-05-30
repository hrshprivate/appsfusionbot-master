module.exports = {
    apps: [
      {
        name: 'bot',
        script: './bot.js',
        env_production : {
            "NODE_ENV": "production"
        }
      },
    ],
  };