console.log('VYM loaded');

let fs = require('fs');
let exampleData = JSON.parse(fs.readFileSync(__dirname + '/../example.json', 'utf-8'));
let dom = require('./dom');

const filesPathRegex = /.*\/.*\/pull\/\d\/files/;

$(document).on('ready pjax:success', function () {

  dom.mountNav();
  dom.listen();
});

$(window).on('hashchange', function () {
  if (filesPathRegex.test(window.location.pathname) && window.location.hash === '#slides') {
    console.log('mounting slide engine and slides...');

    $('.diff-view').hide(); // Hide the original diff view
    dom.mountEngine();
    dom.mountSlides(exampleData);
  }
});
