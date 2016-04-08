import templates from './templates';

class SlideEngine {
  constructor(slideDeck) {
    this.slideDeck = slideDeck;
    this.slideCount = slideDeck.slides.length;
    this.currentSlideNumber = 1;
  }

  mount() {
    $('.diff-view').hide(); // Hide the original diff view
    $(templates.engine).insertBefore('.diff-view');

    this.mountSlides();
  }

  mountSlides() {
    this.slideDeck.slides.forEach(function (slide, slideIndex) {
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

    this.refreshCurrentSlide();
  }

  refreshCurrentSlide(number = 1) {
    console.log('refreshing for', number);
    $('.vym-slide').removeClass('vym-current-slide');
    $(`.vym-slide-${number}`).addClass('vym-current-slide');
  }

  moveNext() {
    this.currentSlideNumber++;
    this.refreshCurrentSlide(this.currentSlideNumber);
  }

  movePrev() {
    this.currentSlideNumber--;
    this.refreshCurrentSlide(this.currentSlideNumber);
  }

  hasNext() {
    return this.slidesCount > this.currentSlideNumber;
  }

  hasPrev() {
    return this.currentSlideNumber > 1;
  }
};

export default SlideEngine;
