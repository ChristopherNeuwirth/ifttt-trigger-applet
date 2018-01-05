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
function now() {
  return moment().utc(1).format('YYYY-MM-DD HH:mm');
}

/**
 * Main Application
 * First the options are set based on the environment (prod, dev) and then the request is triggered.
 */
const wrappedFunction = catchErrors(doRequest);

// Mo - Fr, 9:45 - 10:30, every minute
let startTime = moment({hour: 9, minute: 45}).utc(1);
let endTime = moment(startTime).add(45, 'minutes');

// Debug:
//let endTime = moment({hour: 11, minute: 27}).utc(1);

let range = moment.range(startTime, endTime);

let cronLog = true;

console.log(`[LOG]     ${now()}: 🚀  Omnomnom ${process.env.ENV} Cronjob started.`);

schedule.scheduleJob({
  rule: '*/1 * * * 1-5' 
}, () => {

  if(range.contains(moment().utc(1)) && !cronLog) {
    cronLog = true;
    if(cronLog) console.log(`[LOG]     ${now()}: 🌈  Daily Breakfast time reached again.`);
  }

  if(range.contains(moment().utc(1))) {
    if(cronLog) console.log(`[LOG]     ${now()}: 📨  Checking Mailbox...`);
    wrappedFunction();
  } else {
    if(cronLog) console.warn(`[WARN]    ${now()}: ☝️  Breakfast Time is Over.`);
  }

  if(moment().utc(1) > endTime) {
    if(cronLog) console.warn(`[WARN]    ${now()}: 💤  Daily Endtime reached. Going to sleep. `);
    cronLog = false;
  }
  
});


// Debug:
// setTimeout(() => {
//   startTime = moment().utc(1);
//   endTime = moment(startTime).add(3, 'minutes');
//   range = moment.range(startTime, endTime);
//   console.log('changed range!', range);
// }, 300000);