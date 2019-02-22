module.exports = {
  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */
  apps : [

    // First application
    {
      name      : 'AQ_API',
      script    : 'dist/server/app.js',
      env: {
        NODE_ENV: 'dev',
        MONGODB_URI: 'mongodb://localhost:27017/aquarium',
        SECRET_TOKEN: 'killbit',
        SERIAL_PORT_ADDRESS: '/dev/ttyACM1'
      },
      env_production : {
        NODE_ENV: 'production',
        MONGODB_URI: 'mongodb://localhost:27017/aquarium',
        SECRET_TOKEN: 'killbit',
        SERIAL_PORT_ADDRESS: '/dev/ttyACM1'
      }
    }
  ],

  /**
   * Deployment section
   * http://pm2.keymetrics.io/docs/usage/deployment/
   */
  deploy : {
    // production : {
    //   user : 'node',
    //   host : '212.83.163.1',
    //   ref  : 'origin/master',
    //   repo : 'git@github.com:repo.git',
    //   path : '/var/www/production',
    //   'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production'
    // }
    // dev : {
    //   user : 'node',
    //   host : '212.83.163.1',
    //   ref  : 'origin/master',
    //   repo : 'git@github.com:repo.git',
    //   path : '/var/www/development',
    //   'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env dev',
    //   env  : {
    //     NODE_ENV: 'dev'
    //   }
    // }
  }
};
