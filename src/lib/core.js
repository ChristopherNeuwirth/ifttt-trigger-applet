let core = module.exports = {};

/**
 * Generates the options object for the request.
 * @param {String} url
 * @param {Object} header
 */
core.setOptions = function (url, header) {
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
core.setUrl = function (env) {
  let appId;

  try {
    if(env === 'PROD') {
       appId = process.env.APPIDPROD;
    } else {
      appId = process.env.APPIDDEV;
    }
    if(!appId) {
      throw 'Error: No app environment set';
    }
    return process.env.BASE + process.env.URL + appId + process.env.ENDPOINT;

  } catch (e) {
    console.log(e);
    process.exit(1);
  }

}
