import SlideEngine from './slide_engine';
import vymAPI from './vym_api';
import templates from './templates';

console.log('VYM loaded');

function initEngine() {
  $('.tabnav-tab.js-pjax-history-navigate').removeClass('selected');
  $('.vym-slide-nav').addClass('selected');

  console.log('mounting slide engine and slides...');

  let ownerName = window.location.pathname.split('/')[1];
  let repoName = window.location.pathname.split('/')[2];
  let prNumber = window.location.pathname.split('/')[4];
  chrome.storage.sync.get('vymToken', function (items) {
    vymAPI.getSlideDeck({ownerName, repoName, prNumber, vymToken: items.vymToken}, function (err, res) {
      console.log('getting slide deck');

      let {slideDeck} = res.body;

      if (err) {
        return console.log(err);
      }

      if (!slideDeck) {
        return;
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
  });
};

$(document).on('ready pjax:success hashchange', function () {
  const filesPathRegex = /.*\/.*\/pull\/.*/;

  if (filesPathRegex.test(window.location.pathname)) {

    let ownerName = window.location.pathname.split('/')[1];
    let repoName = window.location.pathname.split('/')[2];

    vymAPI.checkRepoActivated({ownerName, repoName}, function (err, res) {
      if (!res.body.activated) {
        return;
      }
      if ($(".vym-slide-nav").length === 0) {
        $(templates.tab).insertAfter($('.tabnav-tab.js-pjax-history-navigate').has('.octicon-diff'));
      }

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

    });
  }
});

// Fired when GitHub is opened after installing the extension
$(document).on('ready', function () {
  function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    let regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)", "i"),
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
