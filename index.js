let fork = require('child_process').fork;

module.exports = (req, res) => {
  fork('./src/main.js');
  res.end('Welcome to Micro');
}