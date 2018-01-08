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

      console.error(`[ERROR]   ${now()}: 🚨  ${err.statusCode} ${err.statusMessage}`);
      process.exit(1);
    });
  }
}

// actual request.
async function doRequest() {
  const response = await request(options);
  console.log(`[SUCCESS] ${now()}: ✅  ${response.statusCode} ${response.statusMessage}`);
}

// returns the current time with prefered configuration
function now(certainMoment) {
  // TODO: Add summer-time + 1
  return certainMoment ? 
    moment.utc(certainMoment).format('YYYY-MM-DD HH:mm') :
    moment.utc().utcOffset('+01:00').format('YYYY-MM-DD HH:mm');
}

/**
 * Main Application
 * First the options are set based on the environment (prod, dev) and then the request is triggered.
 */
const wrappedFunction = catchErrors(doRequest);

// Mo - Fr, 9:45 - 10:30, every minute
let startTime = now({hour: 9, minute: 35});
let endTime = now({hour: 10, minute: 30});

let range = moment.range(startTime, endTime);

let cronLog = true;
let ping = 0;

console.log(`[LOG]     ${now()}: 🚀  Omnomnom ${process.env.ENV} Cronjob started.`);

schedule.scheduleJob({
  rule: '*/1 * * * 1-5' 
}, () => {

  if(range.contains(now()) && !cronLog) {
    cronLog = true;
    if(cronLog) console.log(`[LOG]     ${now()}: 🌈  Daily Breakfast time reached again.`);
  }

  if(range.contains(now())) {
    if(cronLog) console.log(`[LOG]     ${now()}: 📨  Checking Mailbox...`);
    wrappedFunction();
  } else {
    if(cronLog) console.warn(`[WARN]    ${now()}: ☝️  Breakfast Time is Over.`);
  }
  
  if(now() > endTime) {
    if(cronLog) console.warn(`[LOG]     ${now()}: 💤  Daily Endtime reached. Going to sleep. `);
    cronLog = false;
  }

  console.warn(`[LOG]     ${now()}: ${ping}`);
  if(ping >= 3) {
    console.warn(`[LOG]     ${now()}: 📣  Still running.`);
    ping = 0;
  }

  ping++;
  
});

