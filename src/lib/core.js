let _moment = undefined;
let INTERVAL = {
  startTime: undefined,
  endTime: undefined
};

let core = module.exports = {};

/**
 * Generates the options object for the request.
 * @param {String} url
 * @param {Object} header
 */
core.setOptions = (url, header, secret) => {
  header['x-csrf-token'] = secret.token;
  header['cookie']       = secret.cookie;
  header['referer']      = secret.referer;

  return {
      url: url,
      method: 'POST',
      headers: header,
      resolveWithFullResponse: true
  }
}

/**
 * Sets the url based on the environment (prod, dev) and triggers the specific app.
 * @param {String} env
 */
core.setUrl = (env) => {
  let appId;

  try {
    if(env === 'PROD') {
       appId = process.env.APPIDPROD;
    } else if (env === 'DEV') {
      appId = process.env.APPIDDEV;
    } else {
      throw '[Error] No app environment set';
    }
    return process.env.BASE + process.env.URL + appId + process.env.ENDPOINT;

  } catch (e) {
    console.log(e);
    process.exit(1);
  }

}

/**
 * Provides the momentJs object to the coreLib
 * @param {Object} momentJs instance 
 */
core.configCore = (moment) => {
  _moment = moment;
}

/**
 * Returns the current time with prefered configuration 
 * @param {Object} certainMoment e.g. {hour: 9, minute: 45} 
 */
core.now = (certainMoment) => {
  // TODO: Add summer-time + 1
  // TODO: Make utc time zone configurable
  let momentObject;

  momentObject = certainMoment 
    ? _moment.utc(certainMoment).subtract(1, 'hours') 
    : _moment.utc();
  
  return momentObject.utcOffset('+01:00'); 
  
}


/**
 * Sets the internal Interval Range.
 * @param {Object} start e.g. {hour: 9, minute: 35}
 * @param {Object} end e.g. {hour: 10, minute: 35}
 */
core.setTimeIntervall = (start, end) => {
  INTERVAL.startTime = start;
  INTERVAL.endTime = end;
}

/**
 * Gets the internal Interval Range.
 */
core.getTimeIntervall = () => {
  return INTERVAL;
}

/**
 * Returns a moment Range for the time interval where the api should be checked. 
 */
core.setRange = () => {
  return _moment.range(
    core.now(INTERVAL.startTime),
    core.now(INTERVAL.endTime)
  );
}

/**
 * Updates the 
 */
core.updateRange = () => {
  return _moment.range(
    core.now(INTERVAL.startTime).add(1, 'days'), 
    core.now(INTERVAL.endTime).add(1, 'days')
  );
}

/**
 * Internal method for logger module 
 * @param {String} type 
 * @param {String} emoji 
 * @param {String} message 
 */
core.logMessage = (type, emoji, message) => {

  emoji === 'err' ? emoji = '🚨' : emoji;
  emoji === 'success' ? emoji = '✅' : emoji;
  emoji === 'debug' ? emoji = '🐛' : emoji;

  console.log(`${type}${core.now().format('YYYY-MM-DD HH:mm')}: ${emoji}  ${message}`);
}

/**
 * Logger module wrapper for aligned log messages.
 */
core.logger = {
  log: (emoji, message) => {
    return core.logMessage('[LOG]     ', emoji, message);
  },
  warn: (emoji, message) => {
    return core.logMessage('[WARN]    ', emoji, message);
  },
  err: (message) => {
    return core.logMessage('[ERROR]   ', 'err', message);
  },
  success: (message) => {
    return core.logMessage('[SUCCESS] ', 'success', message);
  },
  debug: (message) => {
    return core.logMessage('[DEBUG]   ', 'debug', message);
  }
}