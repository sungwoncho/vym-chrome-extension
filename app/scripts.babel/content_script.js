console.log('VYM loaded');

let fs = require('fs');
let exampleData = JSON.parse(fs.readFileSync(__dirname + '/../example.json', 'utf-8'));

let slideEngine = require('./slide_engine');

// Hide the original diff view
$('.diff-view').hide();

slideEngine.mount();
slideEngine.mountSlides(exampleData);
