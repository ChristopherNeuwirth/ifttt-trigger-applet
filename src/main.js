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

// Timing start, end
core.setTimeIntervall(
  {hour: 9, minute: 35},
  {hour: 10, minute: 30}
);

let range = core.setRange();

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
        core.logger.warn('️️️️🙇', `Script Conflict. IFTTT just executed itself.`);
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

core.logger.log('🚀', `Some nice Applet ${process.env.ENV} Cronjob started.`);

schedule.scheduleJob({
  rule: '*/1 * * * *' 
}, () => {

  // Example for triggering an action during the time interval which was set in core.setTimeIntervall

  if(range.contains(core.now()) && !cronLog) {
    cronLog = true;
    if(cronLog) core.logger.log('🌈', `Daily time interval reached again.`);
  }

  if(range.contains(core.now())) {
    if(cronLog) core.logger.log('📨', `Checking Mailbox...`);

    // actual action
    wrappedFunction();
  } else {
    if(cronLog) core.logger.warn('️️️️☝️', `Time is Over.`);
  }
  
  if(core.now() > core.now(core.getTimeIntervall().endTime)) {
    if(cronLog) core.logger.log('🕔', `Time set for the next day.`);
    range = core.updateRange();
    if(cronLog) core.logger.log('💤', `Daily Endtime reached. Going to sleep.`);
    cronLog = false;
  }

});
