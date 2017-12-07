let fs = require('fs');
let path = require('path');
let util = require('util'); // console.log(util.inspect(myObject, false, null));
let request = require('request-promise');
let httpHeader = require('../environment/ifttt.header.json');
let coreLib = require('./lib/core');

require('dotenv').config({path: path.resolve(__dirname, '..', 'environment/.env')});

// base config.
let options = {};
let environment = process.env.ENV;

// config the options object based on environment.
options = coreLib.setOptions(
  coreLib.setUrl(environment),
  httpHeader
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

      console.error(err.statusCode, err.statusMessage);
      process.exit(1);
    });
  }
}

// actual request.
async function doRequest() {
  const response = await request(options);
  console.log(response.statusCode, response.statusMessage);
}

/**
 * Main Application
 * First the options are set based on the environment (prod, dev) and then the request is triggered.
 */
const wrappedFunction = catchErrors(doRequest);

wrappedFunction();
setInterval(wrappedFunction, 60000); // 1 min

coreLib.terminate(2700000); // 45 min
