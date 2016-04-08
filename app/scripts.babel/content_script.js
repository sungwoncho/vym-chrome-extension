import SlideEngine from './slide_engine';

console.log('VYM loaded');

let fs = require('fs');
let exampleData = JSON.parse(fs.readFileSync(__dirname + '/../slide_deck_example.json', 'utf-8'));
let dom = require('./dom');

const filesPathRegex = /.*\/.*\/pull\/\d\/files/;

$(document).on('ready pjax:success', function () {
  dom.mountTab();
  dom.listen();
});

$(window).on('hashchange', function () {
  if (filesPathRegex.test(window.location.pathname) && window.location.hash === '#slides') {
    console.log('mounting slide engine and slides...');

    $('.diff-view').hide(); // Hide the original diff view
    dom.mountEngine();
    dom.mountSlides(exampleData);

    function refreshCurrentSlide(number) {
      console.log('refreshing for', number);
      $('.vym-slide').removeClass('vym-current-slide');
      $(`.vym-slide-${number}`).addClass('vym-current-slide');
    }

    let engine = new SlideEngine(exampleData);

    refreshCurrentSlide(engine.currentSlideNumber);

    $(document).on('click', '.vym-nav-next', function () {
      engine.moveNext();
      refreshCurrentSlide(engine.currentSlideNumber);
    });
    $(document).on('click', '.vym-nav-prev', function () {
      engine.movePrev();
      refreshCurrentSlide(engine.currentSlideNumber);
    });
  }
});
