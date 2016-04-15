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

    $('.vym-total-slide-count').text(this.slideCount);

    this.refreshCurrentSlide();
  }

  refreshCurrentSlide(number = 1) {
    console.log('refreshing for', number);
    console.log(this.slideDeck);
    console.log(this.slideCount);

    this.currentSlideNumber = number;
    $('.vym-slide').removeClass('vym-current-slide');
    $(`.vym-slide-${number}`).addClass('vym-current-slide');

    $('.vym-current-slide-number').text(number);

    if (!this.hasNext()) {
      $('.vym-nav-next').attr('disabled', true);
    } else {
      $('.vym-nav-next').removeAttr('disabled');
    }

    if (!this.hasPrev()) {
      $('.vym-nav-prev').attr('disabled', true);
    } else {
      $('.vym-nav-prev').removeAttr('disabled');
    }
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
    return this.slideCount > this.currentSlideNumber;
  }

  hasPrev() {
    return this.currentSlideNumber > 1;
  }
};

export default SlideEngine;
