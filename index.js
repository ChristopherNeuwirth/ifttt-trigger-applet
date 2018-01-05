let fork = require('child_process').fork;

module.exports = (req, res) => {
  fork('./src/main.js', [], {
    env: {
      ENV: 'PROD'
    }
  });
  res.end('You have started the cron job 🙌');
}