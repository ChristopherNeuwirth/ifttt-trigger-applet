let fork = require('child_process').fork;
let path = require('path');
require('dotenv').config({path: path.resolve(__dirname, 'environment/.env')});

let cronJob = undefined;

// Wrapper for creating the forked child process which represents the actual cron job instance. 
function forkChildProcess() {
  return fork('./src/main.js', [], {
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
}

module.exports = (req, res) => {

  if(req.headers.action) {
    req.headers.action.toUpperCase();
  }

  if(!cronJob) {
    cronJob = forkChildProcess();
    return 'You have started the cron job';

  } else if(req.headers.action === 'RESTART') {
    cronJob.kill('SIGINT');
    cronJob = forkChildProcess();
    return 'You have restarted the cron job';

  } else if(req.headers.action === 'INFO') {
    console.log(cronJob);
    return 'Thats your cron job mate';
  } else {
    return 'Cron job already running';
  }
  
}