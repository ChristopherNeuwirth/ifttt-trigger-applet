let fork = require('child_process').fork;
let path = require('path');
require('dotenv').config({path: path.resolve(__dirname, 'environment/.env')});

module.exports = (req, res) => {

  fork('./src/main.js', [], {
    env: {
      ENV: 'PROD',
      BASE: process.env.BASE,
      URL: process.env.URL,
      APPIDDEV: process.env.APPIDDEV,
      APPIDPROD: process.env.APPIDPROD,
      ENDPOINT: process.env.ENDPOINT,
      TOKEN: process.env.TOKEN,
      COOKIE: process.env.COOKIE,
      REFERER: process.env.REFERER
    }
  });
  return 'You have started the cron job.';
}