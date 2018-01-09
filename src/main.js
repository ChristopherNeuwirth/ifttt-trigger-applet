let fs = require('fs');
let path = require('path');
let util = require('util'); // console.log(util.inspect(myObject, false, null));
let request = require('request-promise');
let schedule = require('node-schedule'); // for doc see: https://github.com/node-schedule/node-schedule
let httpHeader = require('../environment/ifttt.header.json');
let core = require('./lib/core');

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
core.configCore(moment);

// Timing 
// Mo - Fr, 9:45 - 10:30, every minute
let startTime = core.now({hour: 9, minute: 35});
let endTime = core.now({hour: 10, minute: 30});
let range = moment.range(startTime, endTime);

// Default values 
let cronLog = true; // responsible for showing log messages 
let debug = true; // responsible for showing debug messages

// config the options object based on environment.
options = core.setOptions(
  core.setUrl(environment),
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

      core.logger.err(`${err.statusCode} ${err.statusMessage}`);
    });
  }
}

// actual request.
async function doRequest() {
  const response = await request(options);
  core.logger.success(`${response.statusCode} ${response.statusMessage}`);
}

/**
 * Main Application
 * First the options are set based on the environment (prod, dev) and then the request is triggered.
 */
const wrappedFunction = catchErrors(doRequest);

core.logger.log('🚀', `Omnomnom ${process.env.ENV} Cronjob started.`);
if(debug) console.log('Range:', range);

schedule.scheduleJob({
  rule: '*/1 * * * 1-5' 
}, () => {

  if(debug) {
    core.logger.debug('🕐', `Is_In_Range:   ${range.contains(core.now())} - Timestamp: ${core.now()}`);
    core.logger.debug('🕐', `Now > endTime: ${core.now() > endTime} - Timestamp: ${core.now()} - EndTime: ${endTime}`);
  }

  if(range.contains(core.now()) && !cronLog) {
    cronLog = true;
    if(cronLog) core.logger.log('🌈', `Daily Breakfast time reached again.`);
  }

  if(range.contains(core.now())) {
    if(cronLog) core.logger.log('📨', `Checking Mailbox...`);
    wrappedFunction();
  } else {
    if(cronLog) core.logger.warn('️️️️☝️', `Breakfast Time is Over.`);
  }
  
  if(core.now() > endTime) {
    if(cronLog) core.logger.log('💤', `Daily Endtime reached. Going to sleep.`);
    cronLog = false;
  }

});
