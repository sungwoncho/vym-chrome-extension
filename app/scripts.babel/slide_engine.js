import templates from './templates';

class SlideEngine {
  constructor(slideDeck) {
    this.slideDeck = slideDeck;
    this.slideCount = slideDeck.slides.length;
    this.currentSlideNumber = 1;
    this.editMode = false;
  }

  mountEngine() {
    $('.diff-view').hide(); // Hide the original diff view
    $(templates.engine).insertBefore('.diff-view');
  }

  mountSlides() {
    this.slideDeck.slides.forEach(function (slide) {
      $('<div/>', {
        class: `vym-slide vym-slide-${slide.number}`
      }).appendTo('.vym-slide-engine .vym-slides');

      slide.sections.forEach(function (section) {
        if (section.type === 'file') {
          $(`.file-header[data-path='${section.filename}']`)
            .closest('.file')
            .appendTo(`.vym-slide-${slide.number}`);
        }
      });
    });

    this.refreshCurrentSlide();
  }

  unmountSlides() {
    $('.vym-slides').empty();
  }

  refreshCurrentSlide(number = 1) {
    console.log('refreshing for', number);
    $('.vym-slide').removeClass('vym-current-slide');
    $(`.vym-slide-${number}`).addClass('vym-current-slide');
  }

  toggleEditMode() {
    this.editMode = !this.editMode;

    if (this.editMode) {
      this.unmountSlides();
      this.mountWizard();
    } else {
      this.unmountWizard();
      this.mountSlides();
    }
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
