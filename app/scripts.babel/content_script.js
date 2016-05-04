import SlideEngine from './slide_engine';
import vymAPI from './vym_api';
import templates from './templates';
import debug from './debugger';

debug('Vym is loaded');

function getDemoSlideDeck() {
  let slideDeck = {
    ownerName: "vymio",
    repoName: "vym",
    prNumber: 1,
    slides: []
  };

  let sections = $('.file-header').map(function (index, elm) {
    return {
      type: 'file',
      filename: $(elm).data('path')
    };
  });

  sections = $.makeArray(sections);

  for (var i = 0; i < sections.length; i++) {
    if (i >= 6) {
      break;
    }

    if (i >= 0 && i < 2) {
      if (!slideDeck.slides[0]) {
        slideDeck.slides[0] = {number: 1, uid: 'demo-1', sections: []};
      }
      slideDeck.slides[0].sections.push(sections[i]);
    }

    if (i >= 2 && i < 4) {
      if (!slideDeck.slides[1]) {
        slideDeck.slides[1] = {number: 2, uid: 'demo-2', sections: []};
      }

      slideDeck.slides[1].sections.push(sections[i]);
    }

    if (i >= 4 && i < 6) {
      if (!slideDeck.slides[2]) {
        slideDeck.slides[2] = {number: 3, uid: 'demo-3', sections: []};
      }

      slideDeck.slides[2].sections.push(sections[i]);
    }
  }

  return slideDeck;
}

function initEngine() {
  $('.tabnav-tab.js-pjax-history-navigate').removeClass('selected');
  $('.vym-slide-nav').addClass('selected');

  debug('Mounting the slide engine and slides...');

  let engine;
  let ownerName = window.location.pathname.split('/')[1];
  let repoName = window.location.pathname.split('/')[2];
  let prNumber = window.location.pathname.split('/')[4];

  chrome.storage.sync.get('vymToken', function (items) {
    if (items.vymToken) {
      debug('Getting slide deck from Vym');
      vymAPI.getSlideDeck({ownerName, repoName, prNumber, vymToken: items.vymToken}, function (err, res) {
        if (err) {
          return console.log(err);
        }

        let slideDeck;

        if (res.body && res.body.slideDeck) {
          slideDeck = res.body.slideDeck;
          debug('Got slide deck', slideDeck);
        } else {
          slideDeck = getDemoSlideDeck();
          debug('No slideDeck found: using demo instead', slideDeck);
        }

        engine = new SlideEngine(slideDeck);
        engine.mountEngine();
        engine.mountUncoveredFilesSection();
        engine.mountSlides();
      });
    } else {
      let slideDeck = getDemoSlideDeck();
      debug('Got demo slide deck', slideDeck);

      engine = new SlideEngine(slideDeck);
      engine.mountEngine();
      engine.mountUncoveredFilesSection();
      engine.mountSlides();
    }
  });

  $(document).on('click', '.vym-nav-next', function () {
    engine.moveNext();
  });
  $(document).on('click', '.vym-nav-prev', function () {
    engine.movePrev();
  });
  $(document).on('click', '.vym-toggle-uncovered-section', function (e) {
    e.preventDefault();

    $('.vym-slides').toggle();
    $('.vym-uncovered-files-section').toggle();

    if ($('.vym-uncovered-files-section').is(':visible')) {
      $('.vym-slide-navigation').hide();
      $('.vym-toggle-uncovered-section').text('Back to slides');
    } else {
      $('.vym-slide-navigation').show();
      $('.vym-toggle-uncovered-section').text('View uncovered files');
    }
  });
};


function initInterface() {
  const filesPathRegex = /.*\/.*\/pull\/.*/;
  let currentPath = window.location.pathname;

  if (filesPathRegex.test(currentPath)) {

    let ownerName = currentPath.split('/')[1];
    let repoName = currentPath.split('/')[2];

    vymAPI.checkRepoActivated({ownerName, repoName}, function (err, res) {
      debug('Repo is activated?', res.body)

      if ($(".vym-slide-nav").length === 0) {
        $(templates.tab).insertAfter($('.tabnav-tab.js-pjax-history-navigate').has('.octicon-diff'));

        // If repo is not activated, add demo flag
        if (!res.body.activated) {
          $('<span/>', {
            class: `counter`,
            html: 'demo'
          }).appendTo('.vym-slide-nav');

        }
      }

      $(document).on('click', '.vym-slide-nav', function (e) {
        e.preventDefault();

        $('.tabnav-tab.js-pjax-history-navigate').removeClass('selected');
        $(e.target).addClass('selected');

        // Change the current location to
        // /:ownerName/:repoName/pull/:prNumber/files#slides
        if (/.*\/.*\/pull\/\d*$/.test(currentPath)) {
          window.location.replace(currentPath + '/files#slides');
        } else {
          let newPath = currentPath.replace(/(.*)\/.*$/, function(match, p1) { return p1 + '/files#slides'; });
          window.location.replace(newPath);
        }
      });

      if (window.location.hash === '#slides') {
        initEngine();
      }
    });
  }
}

$(window).on('hashchange', function () {
  initInterface();
});

$(document).on('ready pjax:success', function () {
  initInterface();
});

// Fired after installing the extension
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
      vymAPI.syncRepoAccess({vymToken}, function (err) {
        debug('Syncing repo access');
        if (err) {
          console.log(err);
        }

        window.location = '__VYM_HOST__/welcome';
      });

    });
  }
});

// Fired on Vym
$(document).on('ready', function () {
  // If not logged in on vym app, but logged in on Chrome extension, auto login
  // Wait a bit for Meteor to finish rendering
  setTimeout(function () {
    if ($('.vym-not-logged-in').length !== 0) {
      debug('not logged in');
      chrome.storage.sync.get(null, function (items) {
        debug('items', items);

        if (items.vymToken) {
          window.location = '__VYM_HOST__/auto_login';
        }
      });
    }
  }, 3000);
});
