import _ from 'lodash';
let fs = require('fs'); // Need to use require rather than import due to browserify issue

module.exports = {
  mountEngine() {
    let engine = fs.readFileSync(__dirname + '/../templates/slide_engine.html', 'utf-8');
    $(engine).insertBefore('.diff-view');
  },
  mountTab() {
    let tab = fs.readFileSync(__dirname + '/../templates/tab.html', 'utf-8');
    $(tab).insertAfter($('.tabnav-tab.js-pjax-history-navigate').has('.octicon-diff'));
  },
  listen() {
    $(document).on('click', '.vym-slide-nav', function (e) {
      e.preventDefault();

      $('.tabnav-tab.js-pjax-history-navigate').removeClass('selected');
      $(e.target).addClass('selected');
      window.location.hash = 'slides';
    });
  },
  mountSlides(data) {
    data.slides.forEach(function (slide, slideIndex) {
      let slideNumber = slideIndex + 1;

      $('<div/>', {
        class: `vym-slide vym-slide-${slideNumber}`
      }).appendTo('.vym-slide-engine .vym-slides');

      slide.sections.forEach(function (section) {
        if (section.type === 'file') {
          $(`.file-header[data-path='${section.fileHeader}']`)
            .closest('.file')
            .appendTo(`.vym-slide-${slideNumber}`);
        }
      });
    });
  }
};
