let fs = require('fs'); // Need to use require rather than import due to browserify issue

module.exports = {
  engine: fs.readFileSync(__dirname + '/../templates/slide_engine.html', 'utf-8'),
  tab: fs.readFileSync(__dirname + '/../templates/tab.html', 'utf-8')
};
