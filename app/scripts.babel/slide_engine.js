import _ from 'lodash';
let fs = require('fs'); // Need to use require rather than import due to browserify issue

let engine = fs.readFileSync(__dirname + '/../templates/slide_engine.html', 'utf-8');

module.exports = {
  mount() {
    $(engine).insertBefore('.diff-view');
  },
  mountSlides(data) {
    data.slides.forEach(function (slide, slideIndex) {
      $('<div/>', {
        class: `vym-slide-${slideIndex}`
      }).appendTo('.vym-slide-engine .vym-slides');

      slide.sections.forEach(function (section) {
        if (section.type === 'file') {
          $(`.file-header[data-path='${section.fileHeader}']`)
            .closest('.file')
            .detach()
            .appendTo(`.slide-${slideIndex}`);
        }
      });
    });
  }
};
