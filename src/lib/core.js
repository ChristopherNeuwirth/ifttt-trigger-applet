let _moment = undefined;
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
  let momentObject;

  certainMoment ? 
    momentObject = _moment.utc(certainMoment).subtract(1, 'hours') : 
    momentObject = _moment.utc();
  
  return momentObject.utcOffset('+01:00'); 
  
}


core.logMessage = (type, emoji, message) => {

  emoji === 'err' ? emoji = '🚨' : emoji;
  emoji === 'success' ? emoji = '✅' : emoji;

  console.log(`${type}${core.now().format('YYYY-MM-DD HH:mm')}: ${emoji}  ${message}`);
}

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
  }
}