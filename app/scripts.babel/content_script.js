import SlideEngine from './slide_engine';
import genieAPI from './vym_genie_api';
import templates from './templates';

console.log('VYM loaded');

const filesPathRegex = /.*\/.*\/pull\/.*/;

let init = function () {
  console.log('init...');

  if (filesPathRegex.test(window.location.pathname)) {

    $(document).on('click', '.vym-slide-nav', function (e) {
      e.preventDefault();

      $('.tabnav-tab.js-pjax-history-navigate').removeClass('selected');
      $(e.target).addClass('selected');
      var newPath = window.location.pathname.replace(/(.*)\/.*$/, function(match, p1) { return p1 + '/files#slides'; });
      window.location.replace(newPath);
      window.location.hash = '#slides';
    });

    if (window.location.hash === '#slides') {
      initEngine();
    }
  }
};

let initEngine = function () {
  $('.tabnav-tab.js-pjax-history-navigate').removeClass('selected');
  $('.vym-slide-nav').addClass('selected');

  console.log('mounting slide engine and slides...');

  let ownerName = window.location.pathname.split('/')[1];
  let repoName = window.location.pathname.split('/')[2];
  let prNumber = window.location.pathname.split('/')[4];

  genieAPI.getSlideDeck({ownerName, repoName, prNumber}, function (err, res) {
    console.log('getting slide deck');

    let slideDeck = res.body;

    if (err) {
      return console.log(err);
    }

    let engine = new SlideEngine(slideDeck);
    engine.mountEngine();
    engine.mountSlides();

    $(document).on('click', '.vym-nav-next', function () {
      engine.moveNext();
    });
    $(document).on('click', '.vym-nav-prev', function () {
      engine.movePrev();
    });
  });
};

$(window).on('hashchange', function () {
  init();
});

$(document).on('ready pjax:success', function () {
  $(templates.tab).insertAfter($('.tabnav-tab.js-pjax-history-navigate').has('.octicon-diff'));

  init();
});

$(document).on('ready', function () {
  function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)", "i"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
  }

  let vymToken = getParameterByName('vymToken');

  if (vymToken) {
    chrome.storage.sync.set({vymToken}, function () {
      window.location = 'https://github.com';
    });
  }
});
