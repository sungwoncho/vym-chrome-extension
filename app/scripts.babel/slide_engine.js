let fs = require('fs');
let engine = fs.readFileSync(__dirname + '/../templates/slide_engine.html', 'utf-8');

module.exports = {
  mount() {
    $(engine).insertBefore('.diff-view');
  }
};
