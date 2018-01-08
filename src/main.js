let fs = require('fs');
let path = require('path');
let util = require('util'); // console.log(util.inspect(myObject, false, null));
let request = require('request-promise');
let schedule = require('node-schedule'); // for doc see: https://github.com/node-schedule/node-schedule
let httpHeader = require('../environment/ifttt.header.json');
let coreLib = require('./lib/core');

let Moment = require('moment');
let MomentRange = require('moment-range');
let moment = MomentRange.extendMoment(Moment);

require('dotenv').config({path: path.resolve(__dirname, '..', 'environment/.env')});

// base config.
let options = {};
let environment = process.env.ENV;
let secretHeaderInformation = {
  token: process.env.TOKEN,
  cookie: process.env.COOKIE,
  referer: process.env.REFERER
};

// config coreLib
coreLib.configCore(moment);

// Timing 
// Mo - Fr, 9:45 - 10:30, every minute
let startTime = coreLib.now({hour: 9, minute: 35});
let endTime = coreLib.now({hour: 10, minute: 30});
let range = moment.range(startTime, endTime);

// Default values 
let cronLog = true; // responsible for showing log messages 
let ping = 0; // timing indicator for login out a ping message to track if application is still running

// config the options object based on environment.
options = coreLib.setOptions(
  coreLib.setUrl(environment),
  httpHeader,
  secretHeaderInformation
);

// global catch errors wrapper.
function catchErrors(fn) {
  return function (name) {
    return fn(name).catch((err) => {

      // api returns 422 if the applet is triggered by ifttt itself.
      // The app should not stop if this case occurs. 
      if(err.statusCode === 422) {
        return;
      }

      console.error(`[ERROR]   ${coreLib.now()}: 🚨  ${err.statusCode} ${err.statusMessage}`);
      process.exit(1);
    });
  }
}

// actual request.
async function doRequest() {
  const response = await request(options);
  console.log(`[SUCCESS] ${coreLib.now()}: ✅  ${response.statusCode} ${response.statusMessage}`);
}

// returns the current time with prefered configuration
// DEPRECATED
function now(certainMoment) {
  // TODO: Add summer-time + 1
  console.warn(`[WARN]    ${coreLib.now()}: 🔥  This function is DEPRECATED. Please use coreLib.now() instead.`);
  return certainMoment ? 
    moment.utc(certainMoment).format('YYYY-MM-DD HH:mm') :
    moment.utc().utcOffset('+01:00').format('YYYY-MM-DD HH:mm');
}

/**
 * Main Application
 * First the options are set based on the environment (prod, dev) and then the request is triggered.
 */
const wrappedFunction = catchErrors(doRequest);

console.log(`[LOG]     ${coreLib.now()}: 🚀  Omnomnom ${process.env.ENV} Cronjob started.`);

schedule.scheduleJob({
  rule: '*/1 * * * 1-5' 
}, () => {

  if(range.contains(coreLib.now()) && !cronLog) {
    cronLog = true;
    if(cronLog) console.log(`[LOG]     ${coreLib.now()}: 🌈  Daily Breakfast time reached again.`);
  }

  if(range.contains(coreLib.now())) {
    if(cronLog) console.log(`[LOG]     ${coreLib.now()}: 📨  Checking Mailbox...`);
    wrappedFunction();
  } else {
    if(cronLog) console.warn(`[WARN]    ${coreLib.now()}: ☝️  Breakfast Time is Over.`);
  }
  
  if(coreLib.now() > endTime) {
    if(cronLog) console.warn(`[LOG]     ${coreLib.now()}: 💤  Daily Endtime reached. Going to sleep. `);
    cronLog = false;
  }

  if(ping >= 60) {
    console.warn(`[LOG]     ${coreLib.now()}: 📣  Still running.`);
    ping = 0;
  }
  
  ping++;
  
});

