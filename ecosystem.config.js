module.exports = {
  apps: [
    {
      name: "se-back",
      script: "./bin/www.js",
      env: {
        NODE_ENV: "pro",
        PORT: 8899,
      },
    },
  ],
};

// COMANDO PARA PRODUCCION
// pm2 start ecosystem.config.js
// pm2 restart all
// pm2 stop all
